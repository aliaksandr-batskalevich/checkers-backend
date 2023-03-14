import {validationResult} from "express-validator";

const authValidateMiddleware = (req, res, next) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
        const message = validationErrors.array().map(error => error.msg).join(' & ');
        return res.status(400).json({message});
    }
    next();
};

export default authValidateMiddleware;