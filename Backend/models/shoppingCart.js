const mongoose = require('mongoose');
const AutoIncrementFactory = require('mongoose-sequence');

const AutoIncrement = AutoIncrementFactory(mongoose);

const shoppingCartSchema = new mongoose.Schema({
    idShoppingCart: {
        type: Number,
        unique: true
    },
    customer: {
        type: String,
        required: true
    },
    products: [
        {
            idProduct: { type: String, required: true },
            quantity: { type: Number, required: true, min: 1 },
            price: { type: Number, required: true }
        }
    ],
    total: {
        type: Number,
        required: true
    }
}, { timestamps: true });

// Apply auto-increment only outside of the test environment to avoid
// conflicts when tests mock or stub the model/schema.
if (process.env.NODE_ENV !== 'test') {
    shoppingCartSchema.plugin(AutoIncrement, { incField: 'idShoppingCart' });
}

module.exports = mongoose.model('ShoppingCart', shoppingCartSchema);

