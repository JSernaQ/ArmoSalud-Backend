const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({

    name: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    username: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    rol: { 
        type: String, 
        required: true, 
        enum: ['seller', 'admin'], 
        default: 'seller' }
        
});

const User = mongoose.model('User', UserSchema);
module.exports = { User };