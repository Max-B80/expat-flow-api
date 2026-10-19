import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  clerkId: { type: String, unique: true, sparse: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  isAdmin: { type: Boolean, required: true, default: false },
  // Preserve existing hashes for an explicit Clerk import. This API no longer accepts passwords.
  password: { type: String, select: false },
}, { timestamps: true });

export default mongoose.model('User', userSchema);
