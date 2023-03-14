import jwt from "jsonwebtoken";
import config from "../config.js";


const authMiddleware = async (req, res, next) => {
    if (req.method === 'OPTION') {
        next();
    }

    try {
        const tokenReq = req.headers.authorization.split(' ')[1];
        if (!tokenReq) {
            return res.status(403).json({message: `User is not authorized!`});
        }

        // if the token is not valid - the method VERIFY will generate an error
        // and the catch will work
        const decodedPayload = jwt.verify(tokenReq, config.secretKey);
        req.userId = decodedPayload.id;

        next();

    } catch (e) {
        res.status(403).json({message: `User is not authorized!`});
    }
};

export default authMiddleware;