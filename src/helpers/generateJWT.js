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
        { expiresIn: "12h" }
    );

    return token;
};
5
module.exports = { generateToken }