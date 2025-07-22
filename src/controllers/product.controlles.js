const { Presentation } = require('../models/Product/presentation.model');
const { Product } = require('../models/Product/product.model');
const mongoose = require('mongoose');

const getAllProducts = async (req, res) => {

    try {

        const products = await Product.find()
            .populate('presentations', 'type equivalence price')
            .lean();

        if (!products) {
            return res.status(404).json({
                ok: false,
                msg: 'Productos no encontrados.'
            });
        };

        return res.status(200).json({
            ok: true,
            msg: 'Productos encontrados.',
            products
        });

    } catch (error) {

        console.error(error.message);

        return res.status(500).json({
            ok: false,
            msg: 'Error al obtener los productos.'
        });

    };

};

const getOneProduct = async (req, res) => {

    try {

        const productId = req.params.productId

        const product = await Product.findById(productId)
            .populate('presentations', 'type equivalence price')
            .lean();

        if (!product) {
            return res.status(404).json({
                ok: false,
                msg: 'Producto no encontrado.'
            });
        };

        return res.status(200).json({
            ok: true,
            msg: 'Producto encontrado.',
            product
        });

    } catch (error) {
        console.error('Error en getOneProduct:', error.message);
        
        return res.status(500).json({
            ok: false,
            msg: 'Error interno al obtener el  producto.'
        });

    };

};

const createNewProduct = async (req, res) => {

    const session = await mongoose.startSession();

    try {

        session.startTransaction();

        const { code, name, description, stock, presentations } = req.body;

        const [newProduct] = await Product.create([{
            code,
            name,
            description,
            stock
        }], { session });

        //If array is empty, abort the session
        if (!Array.isArray(presentations) || presentations.length === 0) {
            await session.abortTransaction();
            return res.status(400).json({
                ok: false,
                msg: 'Revisa la información.'
            })
        };

        for (const presentation of presentations) {

            const [newPresentation] = await Presentation.create([{
                product: newProduct._id,
                type: presentation.type,
                equivalence: presentation.equivalence,
                price: presentation.price
            }], { session });

            newProduct.presentations.push(newPresentation._id);

        };

        const product = await newProduct.save({ session });

        await session.commitTransaction();

        return res.status(201).json({
            ok: true,
            msg: 'Producto creado correctamente.',
            product
        })

    } catch (error) {

        await session.abortTransaction();

        return res.status(500).json({
            ok: false,
            msg: error.message
        })

    } finally {
        session.endSession();
    }

}

module.exports = {
    getAllProducts,
    createNewProduct,
    getOneProduct
}