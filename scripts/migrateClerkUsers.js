import 'dotenv/config';
import mongoose from 'mongoose';
import { clerkClient } from '@clerk/express';
import User from '../models/User.js';

// Default: read-only preview. Only --apply writes to Clerk and MongoDB.
const apply = process.argv.includes('--apply');
if (!process.env.MONGO_URI || (apply && !process.env.CLERK_SECRET_KEY)) {
  console.error('Configure MONGO_URI and, for --apply, CLERK_SECRET_KEY in the backend .env.');
  process.exitCode = 1;
} else {
  let imported = 0;
  let failed = 0;
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const query = { $or: [{ clerkId: { $exists: false } }, { clerkId: null }] };
    if (!apply) {
      const count = await User.countDocuments(query);
      console.log(`Preview: ${count} existing local account(s) need importing. No accounts were changed.`);
      console.log('Review your Clerk application and configuration, then run npm run migrate:clerk -- --apply to import.');
    } else {
      for await (const local of User.find(query).select('+password').cursor()) {
        try {
          const externalId = local._id.toString();
          const importedUsers = await clerkClient.users.getUserList({ externalId: [externalId], limit: 1 });
          let remote = importedUsers.data[0];
          if (!remote) {
            const existing = await clerkClient.users.getUserList({ emailAddress: [local.email], limit: 1 });
            if (existing.data.length) throw new Error('Email already exists in Clerk without a matching externalId; explicit linking is required.');
            const [firstName, ...lastName] = local.name.trim().split(/\s+/);
            remote = await clerkClient.users.createUser({
              externalId,
              emailAddress: [local.email],
              // The previous application did not verify email ownership.
              emailAddressIdentificationStatus: ['reserved'],
              firstName,
              ...(lastName.length && { lastName: lastName.join(' ') }),
              ...(local.password ? { passwordDigest: local.password, passwordHasher: 'bcrypt' } : { skipPasswordRequirement: true }),
            });
          }
          if (!remote.emailAddresses.some((email) => email.emailAddress.toLowerCase() === local.email.toLowerCase())) {
            throw new Error('Imported Clerk email does not match the local account.');
          }
          const linked = await User.findOneAndUpdate({ _id: local._id, ...query }, { $set: { clerkId: remote.id } }, { new: true, runValidators: true });
          if (!linked) throw new Error('Local account changed during import; inspect it before retrying.');
          imported++;
        } catch (error) {
          failed++;
          console.error(`Account ${local._id}: import did not complete (${error.status || error.name}). Existing data was preserved.`);
        }
      }
      console.log(`Import complete: ${imported} linked, ${failed} require review. Passwords and MongoDB IDs were preserved.`);
      if (failed) process.exitCode = 1;
    }
  } catch {
    console.error('Migration could not complete. Check the database connection and Clerk configuration.');
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}
