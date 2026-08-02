import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const validateUser = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(':')[1];
    if (!token) {
        return res.status(401).send("Access token required");
    }
    try {
        const decoded = jwt.verify(token, process.env.AUTH_SALT);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).send("Invalid or expired token");
    }
};