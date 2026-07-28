const shoppingCartService = require('../services/shoppingCartService');
const customerService = require('../services/customerService');

exports.create = async (req, res) => {
    // Requerir autenticación (basicAuth middleware debe haber rellenado req.user para Bearer tokens)
    if (!req.user) return res.status(401).json({ error: 'Authentication required' });

    // Forzar que el carrito pertenezca al usuario que hace la petición
    const customerId = req.user.id || req.user.user || req.user.email;
    if (!customerId) return res.status(400).json({ error: 'Customer id not available in token' });

    try {
        // Verificar que el customer exista antes de crear el carrito
        // customerService.findById lanza si no existe
        await customerService.findById(customerId);
    } catch (err) {
        return res.status(404).json({ error: 'Customer not found' });
    }

    const data = { ...req.body, customer: customerId };
    try {
        const cart = await shoppingCartService.createShoppingCart(data);
        res.status(201).json(cart);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

function ensureAuthenticated(req, res) {
    if (!req.user) {
        res.status(401).json({ error: 'Authentication required' });
        return false;
    }
    return true;
}

function isOwnerOrAdmin(req, ownerCustomerId) {
    if (!req.user) return false;
    const uid = String(req.user.id || req.user.user || req.user.email);
    return req.user.role === 'admin' || uid === String(ownerCustomerId);
}

exports.getAll = async (req, res) => {
    // Sólo admins pueden listar todos los carritos
    if (!ensureAuthenticated(req, res)) return;
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
    const carts = await shoppingCartService.getAllShoppingCarts();
    res.json(carts);
};

exports.getById = async (req, res) => {
    if (!ensureAuthenticated(req, res)) return;
    const cart = await shoppingCartService.getShoppingCartById(req.params.id);
    if (!cart) return res.status(404).json({ error: 'Not found' });
    if (!isOwnerOrAdmin(req, cart.customer)) return res.status(403).json({ error: 'Forbidden' });
    res.json(cart);
};

exports.update = async (req, res) => {
    if (!ensureAuthenticated(req, res)) return;
    const cart = await shoppingCartService.getShoppingCartById(req.params.id);
    if (!cart) return res.status(404).json({ error: 'Not found' });
    if (!isOwnerOrAdmin(req, cart.customer)) return res.status(403).json({ error: 'Forbidden' });

    // Prevent changing owner
    const updateData = { ...req.body, customer: cart.customer };
    const updated = await shoppingCartService.updateShoppingCart(req.params.id, updateData);
    res.json(updated);
};

exports.delete = async (req, res) => {
    if (!ensureAuthenticated(req, res)) return;
    const cart = await shoppingCartService.getShoppingCartById(req.params.id);
    if (!cart) return res.status(404).json({ error: 'Not found' });
    if (!isOwnerOrAdmin(req, cart.customer)) return res.status(403).json({ error: 'Forbidden' });
    await shoppingCartService.deleteShoppingCart(req.params.id);
    res.json({ message: 'Deleted' });
};

exports.getByCustomer = async (req, res) => {
    if (!ensureAuthenticated(req, res)) return;
    const customerId = req.params.customerId;
    if (!isOwnerOrAdmin(req, customerId)) return res.status(403).json({ error: 'Forbidden' });
    const cart = await shoppingCartService.getShoppingCartByCustomer(customerId);
    if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });
    res.json(cart);
};