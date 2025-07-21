const jwt = require('jsonwebtoken');

async function generateToken(user) {


    const token = jwt.sign(
        {
            _id: user._id,
            name: user.name,
            email: user.email,
            username: user.username,
            rol: user.rol   
        },
        process.env.JWTKEY,
        { expiresIn: "1h" }
    );

    return token;
};

module.exports = { generateToken }