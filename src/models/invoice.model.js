const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
    
    consecutive: {
        type: Number,
        unique: true,
        require: true,
    },
    date: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        required: true,
        enum: ['Completa', 'Cancelada'],
        default: 'Completa'
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        presentationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Presentation',
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        unitPrice: {
            type: Number,
            required: true
        },
        total: {
            type: Number,
            required: true
        }
    }],
    subTotal: {
        type: Number,
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    discount: {
        type: Number,
        default: 0
    },
    paymentMethod: {
        type: String,
        required: true
    }

});

const Invoice = mongoose.model('Invoice', invoiceSchema);
module.exports = { Invoice };