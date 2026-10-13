import mongoose from 'mongoose';

const visaSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User', // Links this visa entry directly to a specific User
        },
        country: {
            type: String,
            required: [true, 'Please add a country'],
        },
        visaType: {
            type: String,
            required: [true, 'Please add a visa type'],
        },
        status: {
            type: String,
            required: true,
            enum: ['Pending', 'Approved', 'Rejected', 'Expired'],
            default: 'Pending',
        },
        expirationDate: {
            type: Date,
        },
        notes: {
            type: String,
        },
        document: { // 👈 ADDED: Stores the Cloudinary file URL
            type: String,
            default: null,
        },
        },
        {
        timestamps: true, // Automatically manages createdAt and updatedAt
    }

);

/*
const visaSchema = new mongoose.Schema(
    {
        
        country: {
            type: String,
            required: [true, 'Please add a country'],
        },
        visaType: {
            type: String,
            required: [true, 'Please add a visa type'],
        },
        status: {
            type: String,
            required: true,
            enum: ['Pending', 'Approved', 'Rejected', 'Expired'],
            default: 'Pending',
        },
        expirationDate: {
            type: Date,
        },
        notes: {
            type: String,
        },
        document: { // 👈 ADDED: Stores the Cloudinary file URL
            type: String,
            default: null,
        },
        },
        {
        timestamps: true, // Automatically manages createdAt and updatedAt
    }

);
*/
const Visa = mongoose.model('Visa', visaSchema);

export default Visa