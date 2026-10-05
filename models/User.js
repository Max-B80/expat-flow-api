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
        
        isAdmin: {
            type: Boolean,
            required: true,
            default: false,
        },
    },
    {
        timestamps: true, // Automatically manages createdAt and updatedAt fields
    }
);

// Encrypt password using BEFORE saving user
userSchema.pre('save', async function () {
    // Only hash the password if it has been modified (or is new)
    // If password was not modified, exit early
    if (!this.isModified('password')) {
        return;
    }

    // Generate the salt and Hash the pasword
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare entered password with hashed password in database 🔑
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;