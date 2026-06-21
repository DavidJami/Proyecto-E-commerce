const mongoose = require('mongoose');
const ShoppingCart = require('../models/shoppingCart');

function buildCartLookup(id) {
    const numericId = Number(id);
    if (Number.isFinite(numericId) && String(numericId) === String(id).trim()) {
        return { idShoppingCart: numericId };
    }

    if (mongoose.Types.ObjectId.isValid(id)) {
        return { _id: id };
    }

    return null;
}

exports.createShoppingCart = async (data) => {
    const cart = new ShoppingCart(data);
    return await cart.save();
};

exports.getAllShoppingCarts = async () => {
    return await ShoppingCart.find();
};

exports.getShoppingCartById = async (id) => {
    const filter = buildCartLookup(id);
    if (!filter) {
        return null;
    }

    return await ShoppingCart.findOne(filter);
};

exports.updateShoppingCart = async (id, data) => {
    const filter = buildCartLookup(id);
    if (!filter) {
        return null;
    }

    return await ShoppingCart.findOneAndUpdate(filter, data, { new: true });
};

exports.deleteShoppingCart = async (id) => {
    const filter = buildCartLookup(id);
    if (!filter) {
        return null;
    }

    return await ShoppingCart.findOneAndDelete(filter);
};

exports.getShoppingCartByCustomer = async (customerId) => {
    return await ShoppingCart.findOne({ customer: customerId });
};