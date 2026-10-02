import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
    let token;

    // 1. Check if the Authorization header exists and starts with "Bearer" 📬
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // 2. Extract the token from the "Bearer <token>" string ✂️
            token = req.headers.authorization.split(' ')[1];

            // 3. Verify the token using your JWT secret 🔑
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // 4. Find the user by ID and attach it to the request object (excluding password) 👤
            req.user = await User.findById(decoded.id).select('-password');

            // 5. Call next() to pass control to the next middleware or controller 🚦
            next();
        } catch (error) {
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};