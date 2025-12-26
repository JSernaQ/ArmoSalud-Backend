const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {

    try {

        const header = req.headers.authorization;
        
        if (!header) {
            return res.status(401).json({
                ok: false,
                msg: 'Acceso no autorizado'
            })
        }

        const decode = jwt.verify(header, process.env.JWTKEY)
        
        next()
        

    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'Token inválido o expirado'
        });
    }

}

module.exports = { verifyToken }