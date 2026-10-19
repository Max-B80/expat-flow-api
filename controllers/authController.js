// Passwords, Google OAuth, email verification and recovery are now handled by Clerk.
export const retiredAuthentication = (req, res) => {
  res.status(410).json({ message: 'Authentication has moved to Clerk. Sign in through the ExpatFlow frontend.' });
};
