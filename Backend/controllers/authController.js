const jwt = require('jsonwebtoken');
const Customer = require('../models/customer');

exports.login = async (req, res) => {
    const { username, password } = req.body || {};
    if (!username || !password) {
        return res.status(400).json({ message: 'username and password required' });
    }

    // Admin via env (legacy/basic)
    const ADMIN_USER = process.env.BASIC_USER;
    const ADMIN_PASS = process.env.BASIC_PASS;
    if (username === ADMIN_USER && password === ADMIN_PASS) {
        const secret = process.env.JWT_SECRET || 'change-me';
        const token = jwt.sign({ id: 'admin', email: username, role: 'admin' }, secret, { expiresIn: '2h' });
        return res.json({ token, user: { id: 'admin', email: username, role: 'admin' } });
    }

    // Customer login
    try {
        const customer = await Customer.findOne({ email: username });
        if (!customer) return res.status(401).json({ message: 'Invalid credentials' });

        const match = await customer.comparePassword(password);
        if (!match) return res.status(401).json({ message: 'Invalid credentials' });

        const secret = process.env.JWT_SECRET || 'change-me';
        const payload = { id: customer._id.toString(), email: customer.email, role: customer.role || 'customer' };
        const token = jwt.sign(payload, secret, { expiresIn: '2h' });

        res.json({ token, user: { id: payload.id, email: payload.email, role: payload.role } });
    } catch (err) {
        res.status(500).json({ message: 'Login error' });
    }
};
