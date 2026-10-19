import User from '../models/User.js';

export const identityFromClerk = (clerkUser) => {
  const primary = clerkUser.emailAddresses.find((email) => email.id === clerkUser.primaryEmailAddressId);
  if (!primary || primary.verification?.status !== 'verified') {
    throw Object.assign(new Error('Verify your primary email in your Clerk account before continuing.'), { status: 403 });
  }
  const email = primary.emailAddress.trim().toLowerCase();
  const name = [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(' ') || clerkUser.username || email;
  return { email, name };
};

// Preserve MongoDB ObjectIds: visa.user continues to point to the same local user.
export const resolveLocalUser = async (clerkId, loadClerkUser, users = User) => {
  const linked = await users.findOne({ clerkId });
  if (linked) return linked;
  const clerkUser = await loadClerkUser(clerkId);
  const identity = identityFromClerk(clerkUser);
  const existing = await users.findOne({ email: identity.email });
  if (existing) {
    // externalId is set through Clerk's trusted Backend API during an explicit migration.
    if (existing.clerkId || clerkUser.externalId !== existing._id.toString()) {
      throw Object.assign(new Error('This email belongs to an existing ExpatFlow account. Import that account into Clerk with its MongoDB ID as externalId before continuing.'), { status: 409 });
    }
    // Conditional update prevents concurrent attempts from claiming the same legacy account.
    const migrated = await users.findOneAndUpdate(
      { _id: existing._id, $or: [{ clerkId: { $exists: false } }, { clerkId: null }] },
      { $set: { clerkId, ...identity } },
      { new: true, runValidators: true },
    );
    if (migrated) return migrated;
    const concurrent = await users.findOne({ clerkId });
    if (concurrent) return concurrent;
    throw Object.assign(new Error('This account has already been linked. Please contact support.'), { status: 409 });
  }
  if (clerkUser.externalId) {
    throw Object.assign(new Error('The imported account does not match a local user. Please check its externalId and email.'), { status: 409 });
  }
  try {
    return await users.create({ clerkId, ...identity, isAdmin: false });
  } catch (error) {
    if (error.code !== 11000) throw error;
    // Two simultaneous first requests may both attempt to provision the same user.
    const concurrent = await users.findOne({ clerkId });
    if (concurrent) return concurrent;
    throw Object.assign(new Error('This email is already assigned to another account.'), { status: 409 });
  }
};
