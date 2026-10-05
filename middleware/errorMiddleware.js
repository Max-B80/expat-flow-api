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
