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

        // 2.Create new visa linked to the authenticated user (req.user._id)
        const visa = await Visa.create({
            user: req.user._id,
            country,
            visaType,
            status,
            expirationDate,
            notes,
        });

        res.status(201).json(visa);
    } catch (error) {
        // Pass error to our global errorHandler middleware
        next(error);
    }
};

// @desc    Get logged in user's visas
// @route   GET /api/visas
// @access  Private 🔒
export const getMyVisas = async (req, res) => {
    try {
        // Find visas where the 'user' field matches req.user._id
        const visas = await Visa.find({ user: req.user._id });
        res.json(visas);
    } catch (error) {
        res.status(500).json({ message: 'Server error while fetching visas' });
    } 
};

// @desc    Update a visa entry
// @route   PUT /api/visas/:id
// @access  Private 🔒
export const updateVisa = async (req, res) => {
    try {
        const visa = await Visa.findById(req.params.id);

        if (!visa) {
            return res.status(404).json({ message: 'Visa entry not found' });
        }

        // Verify that the logged-in user owns this visa record 🔐
        if (visa.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to update this visa' });
        }

        // Update fields if provided in request body, otherwise keep existing values
        visa.country = req.body.country || visa.country;
        visa.visaType = req.body.visaType || visa.visaType;
        visa.status = req.body.status || visa.status;
        visa.expirationDate = req.body.expirationDate || visa.expirationDate;
        visa.notes = req.body.notes || visa.notes;

        const updatedVisa = await visa.save();
        res.json(updatedVisa);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete a visa entry
// @route   DELETE /api/visas/:id
// @access  Private 🔒
export const deleteVisa = async (req, res) => {
    try {
        const visa = await Visa.findById(req.params.id);

        if (!visa) {
            return res.status(404).json({ message: 'Visa entry not found' });
        }

        // Verify ownership 🔐
        if (visa.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to delete this visa' });
        }

        await visa.deleteOne();
        res.json({ message: 'Visa entry removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server error while deleting visa' });
    }
};