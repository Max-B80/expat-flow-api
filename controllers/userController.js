import { clerkClient } from '@clerk/express';
import User from '../models/User.js';
import { identityFromClerk } from '../utils/clerkUsers.js';

export const getUserProfile = async (req, res, next) => {
  try {
    // Clerk is the source of truth for editable names and email addresses.
    const identity = identityFromClerk(await clerkClient.users.getUser(req.user.clerkId));
    if (req.user.name !== identity.name || req.user.email !== identity.email) {
      req.user.name = identity.name;
      req.user.email = identity.email;
      await req.user.save();
    }
    res.json({ _id: req.user._id, clerkId: req.user.clerkId, name: req.user.name, email: req.user.email, isAdmin: req.user.isAdmin });
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ message: 'This email is already assigned to another local account. Please contact support.' });
    next(error);
  }
};

export const updateUserProfile = (req, res) => {
  res.status(410).json({ message: 'Manage your name, email and password using Clerk on the account page.' });
};

export const getUsers = async (req, res, next) => {
  try {
    res.json(await User.find({}).select('_id clerkId name email isAdmin createdAt updatedAt'));
  } catch (error) { next(error); }
};
