import User from '../models/User.js';

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

// @desc    Get all users (Admin only) 👑
// @route   GET /api/users
// @access  Private/Admin
export const getUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error while fetching users' });
    }
};


// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private 🔒
export const updateUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;

        
        // If user wants to update password, check current password first
        if (req.body.newPassword) {
            if (req.body.currentPassword && (await user.matchPassword(req.body.currentPassword))) {
                user.password = req.body.newPassword;
            } else {
                return res.status(401).json({ message: 'Invalid current password' });
            }
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};