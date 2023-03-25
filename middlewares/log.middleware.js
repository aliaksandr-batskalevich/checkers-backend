const logMiddleware = (req, res, next) => {
    console.log('Request' + req.method);
    next();
};

module.exports = logMiddleware;