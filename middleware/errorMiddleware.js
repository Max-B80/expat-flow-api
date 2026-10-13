import multer from 'multer';

// Middleware to handle 404 (Not Found) routes
export const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error); // Passes the error to errorHandler
};

// Global Error Handler
export const errorHandler = (err, req, res, next) => {
    // If status code is 200, default to 500 (Server Error)
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    let message = err.message;

    if (err.status >= 400 && err.status < 600) {
        statusCode = err.status;
    }

    if (err instanceof multer.MulterError) {
        statusCode = 400;
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
            message = 'Upload one file using the form-data field named document';
        }
    }

    if (err.message === 'Multipart: Boundary not found' ||
        err.message === 'Unexpected end of form') {
        statusCode = 400;
        message = 'Invalid multipart/form-data. Let your client set Content-Type with its boundary and send the complete form';
    }

    // Handle Mongoose CastError (e.g., bad ObjectId like /api/visas/123)
    if (err.name === 'CastError' && err.kind === 'ObjectId') {
        statusCode = 404;
        message = 'Resource not found (Invalid ID format)';
    }

    res.status(statusCode).json({
        message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};
