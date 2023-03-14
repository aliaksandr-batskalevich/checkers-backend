const usersIdValidateMiddleware = (req, res, next) => {
    const id = req.params.id;
    if (!Number.isFinite(+id)) {
        return res.status(400).json({message: `ID must be a number!`});
    }
    next();
};

export default usersIdValidateMiddleware;