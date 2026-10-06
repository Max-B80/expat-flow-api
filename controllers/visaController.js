import Visa from '../models/Visa.js';

// @desc    Create a new visa entry
// @route   POST /api/visas
// @access  Private 🔒
export const createVisa = async (req, res, next) => {
    try {
        const { country, visaType, status, expirationDate, notes } = req.body;

        // 1. Validate required fields 🛡️
        if (!country || !visaType) {
            res.status(400);
            throw new Error('Please include both country and visaType fields');
        }

        // 2. Check if a document file was uploaded ☁️
        const documentUrl = req.file ? req.file.path : null;

        // 3. Create new visa record in MongoDB 💾
        const visa = await Visa.create({
            user: req.user._id,
            country,
            visaType,
            status,
            expirationDate,
            notes,
            document: documentUrl, // 👈 Stores the Cloudinary file URL
        });

        res.status(201).json(visa);
    } catch (error) {
        next(error);
    }
};

// @desc    Get logged in user's visas (with filtering & pagination) 📄
// @route   GET /api/visas
// @access  Private 🔒
export const getMyVisas = async (req, res, next) => {
    try {
        // 1. Build Query Object 🔍
        const queryObj = { user: req.user._id };

        if (req.query.status) {
            queryObj.status = req.query.status;
        }

        if (req.query.country) {
            queryObj.country = req.query.country;
        }

        // 2. Setup Pagination Settings 🧮
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // 3. Query Database 🗄️
        const totalVisas = await Visa.countDocuments(queryObj);

        const visas = await Visa.find(queryObj)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        // 4. Send Structured Response 📊
        res.status(200).json({
            visas,
            page,
            pages: Math.ceil(totalVisas / limit),
            totalVisas,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update a visa entry
// @route   PUT /api/visas/:id
// @access  Private 🔒
export const updateVisa = async (req, res, next) => {
    try {
        const visa = await Visa.findById(req.params.id);

        if (!visa) {
            res.status(404);
            throw new Error('Visa entry not found');
        }

        // Verify ownership 🔐
        if (visa.user.toString() !== req.user._id.toString()) {
            res.status(401);
            throw new Error('Not authorized to update this visa');
        }

        visa.country = req.body.country || visa.country;
        visa.visaType = req.body.visaType || visa.visaType;
        visa.status = req.body.status || visa.status;
        visa.expirationDate = req.body.expirationDate || visa.expirationDate;
        visa.notes = req.body.notes || visa.notes;

        const updatedVisa = await visa.save();
        res.status(200).json(updatedVisa);
    } catch (error) {
        next(error);
    }
};

// @desc    Delete a visa entry
// @route   DELETE /api/visas/:id
// @access  Private 🔒
export const deleteVisa = async (req, res, next) => {
    try {
        const visa = await Visa.findById(req.params.id);

        if (!visa) {
            res.status(404);
            throw new Error('Visa entry not found');
        }

        // Verify ownership 🔐
        if (visa.user.toString() !== req.user._id.toString()) {
            res.status(401);
            throw new Error('Not authorized to delete this visa');
        }

        await visa.deleteOne();
        res.status(200).json({ message: 'Visa entry removed' });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all visas (Admin only)
// @route   GET /api/visas/all
// @access  Private/Admin 🔒👑
export const getAllVisas = async (req, res, next) => {
    try {
        const visas = await Visa.find({}).populate('user', 'name email');
        res.status(200).json(visas); // 👈 Added 200 status code
    } catch (error) {
        next(error);
    }
};