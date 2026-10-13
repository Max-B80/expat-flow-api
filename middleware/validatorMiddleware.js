import { body, validationResult } from 'express-validator';

// Standard error handler for express-validator results 🛡️
export const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// Rules for creating/updating a visa 📑
export const visaValidationRules = [
    body('country')
        .notEmpty()
        .withMessage('Country is required'),
    body('visaType')
        .notEmpty()
        .withMessage('Visa type is required'),
    body('status')
        .optional()
        .isIn(['Pending', 'Approved', 'Rejected'])
        .withMessage('Invalid status value'),
    handleValidationErrors,
];

// Validation for updating a visa (flexible/optional fields) 📑
export const updateVisaValidationRules = [
    body('country').optional().notEmpty().withMessage('Country cannot be empty'),
    body('visaType').optional().notEmpty().withMessage('Visa type cannot be empty'),
    body('status').optional().isIn(['Pending', 'Approved', 'Rejected']).withMessage('Invalid status value'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];