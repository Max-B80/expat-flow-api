import { test } from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { verifyToken } from '@clerk/backend';
import User from '../models/User.js';
import { identityFromClerk, resolveLocalUser } from '../utils/clerkUsers.js';
import { admin, protect } from '../middleware/authMiddleware.js';
import { retiredAuthentication } from '../controllers/authController.js';

const id = '507f1f77bcf86cd799439011';
const profile = { id: 'user_clerk', firstName: 'Test', lastName: 'User', primaryEmailAddressId: 'email_1', emailAddresses: [{ id: 'email_1', emailAddress: 'USER@example.com', verification: { status: 'verified' } }] };
const res = () => ({ code: 200, status(code) { this.code = code; return this; }, json(body) { this.body = body; return this; } });

test('existing Clerk users retain their original MongoDB ObjectId without extra Clerk requests', async () => {
  const local = { _id: id, clerkId: profile.id, isAdmin: true };
  const result = await resolveLocalUser(profile.id, () => assert.fail('Clerk lookup not needed'), { findOne: async () => local });
  assert.equal(result._id, id); assert.equal(result.isAdmin, true);
});

test('new verified users are provisioned without passwords or elevated permissions', async () => {
  let created;
  const result = await resolveLocalUser(profile.id, async () => ({ ...profile, unsafeMetadata: { isAdmin: true } }), {
    findOne: async () => null,
    create: async (value) => { created = value; return { _id: id, ...value }; },
  });
  assert.equal(created.email, 'user@example.com'); assert.equal(created.name, 'Test User');
  assert.equal(created.isAdmin, false); assert.equal(created.password, undefined); assert.equal(result.clerkId, profile.id);
});

test('unverified primary email cannot provision an account', async () => {
  assert.throws(() => identityFromClerk({ ...profile, emailAddresses: [{ ...profile.emailAddresses[0], verification: { status: 'unverified' } }] }), { status: 403 });
});

test('matching emails alone cannot claim a legacy account', async () => {
  const legacy = { _id: id, email: 'user@example.com', isAdmin: true };
  await assert.rejects(resolveLocalUser(profile.id, async () => profile, { findOne: async (query) => query.clerkId ? null : legacy }), { status: 409 });
});

test('trusted externalId migration preserves both visa ownership and the local admin role', async () => {
  const legacy = { _id: id, email: 'user@example.com', isAdmin: true };
  const result = await resolveLocalUser(profile.id, async () => ({ ...profile, externalId: id }), {
    findOne: async (query) => query.clerkId ? null : legacy,
    findOneAndUpdate: async (query, update) => {
      assert.equal(query._id, id); assert.ok(query.$or); assert.equal(update.$set.isAdmin, undefined);
      return { ...legacy, ...update.$set };
    },
  });
  assert.equal(result._id, id); assert.equal(result.isAdmin, true); assert.equal(result.clerkId, profile.id);
});

test('an account linked to another Clerk user cannot be claimed', async () => {
  await assert.rejects(resolveLocalUser(profile.id, async () => ({ ...profile, externalId: id }), {
    findOne: async (query) => query.clerkId ? null : { _id: id, clerkId: 'user_other' },
  }), { status: 409 });
});

test('imported externalId mismatches cannot create replacement local accounts', async () => {
  await assert.rejects(resolveLocalUser(profile.id, async () => ({ ...profile, externalId: id }), {
    findOne: async () => null, create: async () => assert.fail('Must not replace existing ownership'),
  }), { status: 409 });
});

test('concurrent provisioning recovers only an account with the same Clerk ID', async () => {
  let lookups = 0;
  const local = { _id: id, clerkId: profile.id };
  const result = await resolveLocalUser(profile.id, async () => profile, {
    findOne: async () => ++lookups < 3 ? null : local,
    create: async () => { throw Object.assign(new Error('duplicate'), { code: 11000 }); },
  });
  assert.equal(result, local);
});

test('Clerk-only local users validate without a local password', async () => {
  await new User({ clerkId: profile.id, name: 'Test User', email: 'user@example.com' }).validate();
});

test('signed-out requests cannot access protected endpoints', async () => {
  const response = res();
  await protect({ auth: Object.assign(() => ({ userId: null, isAuthenticated: false, tokenType: 'session_token' }), { [Symbol.for('@clerk/express.auth')]: true }) }, response, (error) => { if (error) throw error; assert.fail('Signed-out user accepted'); });
  assert.equal(response.code, 401);
});

test('admin endpoints reject regular users', () => {
  const response = res(); admin({ user: { isAdmin: false } }, response, () => assert.fail('Admin access granted'));
  assert.equal(response.code, 403);
});

test('legacy password and OAuth endpoints are retired', () => {
  const response = res(); retiredAuthentication({}, response); assert.equal(response.code, 410);
});

const keys = crypto.generateKeyPairSync('rsa', { modulusLength: 2048 });
const jwtKey = keys.publicKey.export({ type: 'spki', format: 'pem' });
const now = Math.floor(Date.now() / 1000);
const encode = (data) => Buffer.from(JSON.stringify(data)).toString('base64url');
function token(claims = {}) {
  const data = `${encode({ alg: 'RS256', typ: 'JWT', kid: 'test-key' })}.${encode({ iss: 'https://test.clerk.accounts.dev', sub: profile.id, sid: 'sess_test', iat: now, nbf: now - 1, exp: now + 60, azp: 'http://localhost:5173', ...claims })}`;
  return `${data}.${crypto.sign('RSA-SHA256', Buffer.from(data), keys.privateKey).toString('base64url')}`;
}
test('Clerk SDK accepts a valid signature and the configured frontend origin', async () => {
  const result = await verifyToken(token(), { jwtKey, authorizedParties: ['http://localhost:5173'] });
  assert.equal(result.sub, profile.id);
});
test('Clerk SDK rejects an untrusted frontend origin', async () => {
  await assert.rejects(verifyToken(token({ azp: 'https://other.example' }), { jwtKey, authorizedParties: ['http://localhost:5173'] }));
});
test('Clerk SDK rejects expired tokens', async () => {
  await assert.rejects(verifyToken(token({ exp: now - 60 }), { jwtKey, authorizedParties: ['http://localhost:5173'] }));
});
test('Clerk SDK rejects a changed token payload', async () => {
  const parts = token().split('.'); parts[1] = encode({ sub: 'attacker', exp: now + 60 });
  await assert.rejects(verifyToken(parts.join('.'), { jwtKey, authorizedParties: ['http://localhost:5173'] }));
});
