const mongoose = require('mongoose');

async function connect() {
    try {
        await mongoose.connect(process.env.MONGOURI)
        console.log('Conexion establecida');
        
    } catch (error) {
        console.log(error);
    }
}

module.exports = { connect };