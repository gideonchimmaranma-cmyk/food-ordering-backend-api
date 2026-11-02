const notFound = (req, res, next) => {
    res.status(404).json({ success: false, message: `Route not found: ${req.originalUrl}` });
};


const errorHandler = (err, req, res, next) => {
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    let message = err.message || "Internal Server Error";
    if(err.name === "CastError") {
        statusCode = 400;
        message = "Invalid resource ID";
    }
    if (err.code === 11000) {
        statusCode = 400;
        message = "Duplicate field value entered";
    }
    if (err.name === "ValidationError") {
        statusCode = 400;
        message = Object.values(err.errors).map(val => val.message).join(", ");
    }
    res.status(statusCode).json({ success: false, message });
};

module.exports = { notFound, errorHandler };