const isMyAccountMiddleware = (req, res, next) => {
    if (req.userId !== +req.params.id) {
        return res.status(403).json({message: `Access denied!`});
    }
    next();
};

export default isMyAccountMiddleware;