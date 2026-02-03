const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Product = require('../models/Product');

// @route   GET api/inventory
// @desc    Get all inventory items (with optional lowStock filter)
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const { lowStock } = req.query;
        let query = {};

        if (lowStock === 'true') {
            // Logic: where quantity < lowStockThreshold. 
            // Note: In MongoDB aggregation or $expr might be needed if comparing two fields, 
            // but here we can iterate or use $expr. Simple approach: fetch all and filter or use $expr.
            // Using $expr for efficiency at DB level.
            query = { $expr: { $lt: ["$quantity", "$lowStockThreshold"] } };
        }

        const products = await Product.find(query).sort({ date: -1 });
        res.json(products);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/inventory
// @desc    Add new item
// @access  Private
router.post('/', auth, async (req, res) => {
    const { name, description, quantity, price, lowStockThreshold } = req.body;

    try {
        const newProduct = new Product({
            name,
            description,
            quantity,
            price,
            lowStockThreshold
        });

        const product = await newProduct.save();
        res.json(product);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/inventory/:id
// @desc    Update item
// @access  Private
router.put('/:id', auth, async (req, res) => {
    const { name, description, quantity, price, lowStockThreshold } = req.body;

    // Build product object
    const productFields = {};
    if (name) productFields.name = name;
    if (description) productFields.description = description;
    if (quantity !== undefined) productFields.quantity = quantity;
    if (price !== undefined) productFields.price = price;
    if (lowStockThreshold !== undefined) productFields.lowStockThreshold = lowStockThreshold;

    try {
        let product = await Product.findById(req.params.id);

        if (!product) return res.status(404).json({ msg: 'Product not found' });

        product = await Product.findByIdAndUpdate(
            req.params.id,
            { $set: productFields },
            { new: true }
        );

        res.json(product);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/inventory/:id
// @desc    Delete item
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        let product = await Product.findById(req.params.id);

        if (!product) return res.status(404).json({ msg: 'Product not found' });

        await Product.findByIdAndDelete(req.params.id);

        res.json({ msg: 'Product removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
