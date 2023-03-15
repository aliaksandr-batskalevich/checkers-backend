import jwt from "jsonwebtoken";


const authMiddleware = (req, res, next) => {
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
        const decodedPayload = jwt.verify(tokenReq, process.env.JWT_ACCESS_SECRET);
        req.userId = decodedPayload.id;

        next();

    } catch (e) {
        res.status(403).json({message: `User is not authorized!`});
    }
};

export default authMiddleware;