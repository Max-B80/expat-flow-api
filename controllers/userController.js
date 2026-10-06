import User from '../models/User.js';
import generateToken from '../utils/generateToken.js'; // 👈 Import helper(the Token generated in util)

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

// @desc    Register a new user 👤
// @route   POST /api/users
// @access  Public 🔓
export const registerUser = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            res.status(400);
            throw new Error('User already exists');
        }

        // Create new user (isAdmin defaults to false via schema)
        const user = await User.create({
            name,
            email,
            password,
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                token: generateToken(user._id), // 👈 Generate and send JWT!
            });
        } else {
            res.status(400);
            throw new Error('Invalid user data');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Auth user & get token 🔑
// @route   POST /api/users/login
// @access  Public 🔓
export const authUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });

        // Verify user exists and password matches 🔑
        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                token: generateToken(user._id), // 👈 Send JWT token!
            });
        } else {
            res.status(401);
            throw new Error('Invalid email or password');
        }
    } catch (error) {
        next(error);
    }
};