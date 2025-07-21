const bcrypt = require('bcryptjs');

async function encrypt(pass) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(pass, salt);
}

async function decrypt(pass, hash) {
    return await bcrypt.compare(pass, hash)
}

module.exports = { encrypt, decrypt }