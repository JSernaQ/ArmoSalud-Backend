const mongoose = require('mongoose');

const presentationSchema = new mongoose.Schema({

    product: {
        type: mongoose.Schema.ObjectId, 
        ref: 'Product', 
        required: true
    },
    type: {
        type: String, 
        enum:['Unidad', 'Tableta', 'Caja'],
        required: true
    },
    equivalence: {
        type: Number, 
        required: true
    },
    price: {
        type: Number, 
        required: true
    }

});

const Presentation = mongoose.model('Presentation', presentationSchema);
module.exports = { Presentation };