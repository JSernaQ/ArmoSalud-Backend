const { User } = require('../models/user.model');
const { encrypt, decrypt } = require('../helpers/encryptPassword');
const { generateToken } = require('../helpers/generateJWT');

const registerNewUser = async (req, res) => {

    try {
        const { name, email, username, password, rol } = req.body;

        if (!name || !email || !username || !password) {
            return res.status(400).json({
                ok: false,
                msg: 'Verifica la información'
            })
        }


        const existUsername = await User.findOne({ username });
        const existEmail = await User.findOne({ email });

        if (existEmail || existUsername) {
            console.log('Ya existe un usuario con esas credenciales');
            return res.status(400).json({
                ok: false,
                msg: 'Ya existe un usuario con esas credenciales',
            })
        }

        const encryptedPassword = await encrypt(password)
        const newUser = await User.create({ name, email, username, password: encryptedPassword, rol })
        const { password: _, ...userSafe } = newUser._doc

        return res.status(201).json({
            ok: true,
            msg: 'Usuario registrado correctamente',
            user: userSafe
        })

    } catch (error) {
        console.error('Error en el sistema', error);
        res.status(500).json({
            ok: false,
            msg: 'Error en el sistema, comunicate con un desarrollador'
        })
    }

};

const login = async (req, res) => {

    try {

        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                ok: false,
                msg: 'Verifica la información'
            })
        }

        const existUser = await User.findOne({ username });

        if (!existUser) {
            return res.status(404).json({
                ok: false,
                msg: 'No se encontro el usuario'
            })
        }

        const verifiedPassword = await decrypt(password, existUser.password)

        if (!verifiedPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Contraseña incorrecta'
            })
        }

        const { password: _, ...userSafe } = existUser._doc;

        const token = await generateToken(userSafe);
        console.log('token', token);
        
        return res.status(200).json({
            ok: true,
            msg: 'Inicio de sesión exitoso',
            user: userSafe,
            token: token
        })

    } catch (error) {
        console.error('Error en el sistema', error);
        res.status(500).json({
            ok: false,
            msg: 'Error en el sistema, comunicate con un desarrollador'
        })
    }

}

module.exports = {
    registerNewUser,
    login
}   