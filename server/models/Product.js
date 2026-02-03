const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    quantity: {
        type: Number,
        required: true,
        default: 0
    },
    price: {
        type: Number,
        required: true
    },
    lowStockThreshold: {
        type: Number,
        default: 10
    }
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);
