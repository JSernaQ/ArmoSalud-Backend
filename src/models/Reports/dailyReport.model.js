const mongoose = require('mongoose');

const SchemaSalesReport = new mongoose.Schema({
    date: {
        type: Date,
        default: Date.now(),
        required: true,
        unique: true
    },
    totalInvoices: {
        type: Number,
        required: true
    },
    totalCancelInvoices: {
        type: Number,
        required: true
    },
    totalSales: {
        type: Number,
        required: true
    },
    topProducts: [{
        product: { type: String, required: true },
        presentation: { type: String, required: true },
        totalQuantity: { type: Number, required: true },
        totalSales: { type: Number, required: true }
    }],
        invoices: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Invoice'
            }
        ]
}, { timestamps: true });

const SalesReport = mongoose.model('SalesReport', SchemaSalesReport);

module.exports = { SalesReport }