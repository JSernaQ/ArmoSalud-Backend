const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({

    code: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: false
    },
    owner: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    stock: {
        type: Number,
        required: true,
        default: 0
    },
    minStock: {
        type: Number,
        required: true,
        default: 0
    },
    presentations: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Presentation',
        default: []
    }],

}, {
    timestamps: true
});

const Product = mongoose.model('Product', productSchema);
module.exports = { Product };