import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please add a name'],
        },
        email: {
            type: String,
            required: [true, 'Please add an email'],
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: [true, 'Please add a password'],
            minlength: 6,
        },
    },
    {
        timestamp: true, // Automatically manages createdAt and updatedAt fields
    }
);

// Encrypt password using BEFORE saving user
userSchema.pre('save', async function (next) {
    // Only hash the password if it has been modified (or is new)
    if (!this. isModified('password')) {
        next();
    }

    // Generate the salt and Hash the pasword
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);

export default User;