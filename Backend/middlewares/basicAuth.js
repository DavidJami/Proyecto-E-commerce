require('dotenv').config();
const jwt = require('jsonwebtoken');

const basicAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        res.setHeader('WWW-Authenticate', 'Basic realm="Restricted Area"');
        return res.status(401).send('Authentication required.');
    }

    // Bearer token support (JWT)
    if (authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
            const secret = process.env.JWT_SECRET || 'change-me';
        try {
            const payload = jwt.verify(token, secret);
            req.user = payload;
            return next();
        } catch (err) {
            return res.status(401).send('Invalid token.');
        }
    }

    // Fallback: Basic auth (existing behavior)
    if (!authHeader.startsWith('Basic ')) {
        res.setHeader('WWW-Authenticate', 'Basic realm="Restricted Area"');
        return res.status(401).send('Authentication required.');
    }

    const [username, password] = Buffer.from(authHeader.split(' ')[1], 'base64')
        .toString()
        .split(':');

    const ADMIN_USER = process.env.BASIC_USER;
    const ADMIN_PASS = process.env.BASIC_PASS;

    if (username === ADMIN_USER && password === ADMIN_PASS) {
        next();
    } else {
        res.setHeader('WWW-Authenticate', 'Basic realm="Restricted Area"');
        return res.status(401).send('Authentication failed.');
    }
};

module.exports = basicAuth;