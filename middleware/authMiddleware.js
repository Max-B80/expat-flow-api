import { clerkClient, getAuth } from '@clerk/express';
import { resolveLocalUser } from '../utils/clerkUsers.js';

export const protect = async (req, res, next) => {
  try {
    const { userId, isAuthenticated } = getAuth(req);
    if (!isAuthenticated || !userId) return res.status(401).json({ message: 'Please sign in to continue.' });
    req.user = await resolveLocalUser(userId, (id) => clerkClient.users.getUser(id));
    next();
  } catch (error) {
    next(error);
  }
};

export const admin = (req, res, next) => {
  if (!req.user?.isAdmin) return res.status(403).json({ message: 'Not authorized as an admin.' });
  next();
};
