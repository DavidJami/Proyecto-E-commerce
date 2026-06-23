const jwt = require('jsonwebtoken');

exports.login = (req, res) => {
    const { username, password } = req.body || {};
    const ADMIN_USER = process.env.BASIC_USER;
    const ADMIN_PASS = process.env.BASIC_PASS;

    if (!username || !password) {
        return res.status(400).json({ message: 'username and password required' });
    }

    if (username !== ADMIN_USER || password !== ADMIN_PASS) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const secret = process.env.JWT_SECRET || 'change-me';
    const token = jwt.sign({ user: username }, secret, { expiresIn: '2h' });

    res.json({ token });
};
