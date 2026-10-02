// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private 🔒
export const getUserProfile = async (req, res) => {
    // req.user was attached by our protect middleware!
    if (req.user) {
        res.json({
            _id: req.user._id,
            name: req.user.name,
            email: req.user.email,
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};