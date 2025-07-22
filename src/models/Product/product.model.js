const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: false
    },
    stock: {
        type: Number,
        required: true,
        default: 0
    },
    presentations: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Presentation'
    }],

}, {
    timestamps: true
});

const Product = mongoose.model('Product', productSchema);
module.exports = { Product };