const {ApiError} = require('../exceptions/ApiError.js');

const errorsMiddleware = (error, req, res, next) => {
    console.log(error);

    if (error instanceof ApiError) {
        const {status, message, errors} = error;
        return res.status(status).json({message, errors});
    }

    res.status(500).json({message: 'Some server error. Try later.', errors: []});
};

module.exports = errorsMiddleware;