const e = require('cors');
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

const updateProduct = async (req, res) => {

    const session = await mongoose.startSession();

    try {

        const { productId, code, name, description, owner_id, stock, min_stock = 0, presentations } = req.body;

        if (!Array.isArray(presentations) || presentations.length === 0) {
            return res.status(400).json({
                ok: false,
                msg: 'Revisa la información.'
            })
        };
        
        session.startTransaction();
        const newProduct = {
            code,
            name,
            description,
            owner: owner_id,
            stock,
            minStock: min_stock
        };
        
        const productExist = await Product.findById(productId).populate('presentations');
        const presentationsExist = await Presentation.find({ product: productId }).session(session);
        
        for (const pres of presentations) {

            const exist = presentationsExist.find(p => p.type === pres.type);

            if (!exist) {
                const [newPresentation] = await Presentation.create([{
                    product: productId,
                    type: pres.type,
                    equivalence: pres.equivalence,
                    price: pres.price
                }], { session });
                await Product.findByIdAndUpdate(
                    productId, 
                    { $push: { presentations: newPresentation._id } }, 
                    { session });
            } else {
                await Presentation.findByIdAndUpdate(exist._id, {
                    equivalence: pres.equivalence,
                    price: pres.price
                }, { session });
            }
        }

        const inconmingTypes = presentations.map(p => p.type);

        const toDelete = presentationsExist.filter(pres => !inconmingTypes.includes(pres.type));

        for (const pres of toDelete) {
            await Presentation.findByIdAndDelete(pres._id, { session });
            await Product.findByIdAndUpdate(pres.product, { $pull: { presentations: pres._id } }, { session });
        }
        
        if (!productExist) {
            await session.abortTransaction();
            return res.status(404).json({
                ok: false,
                msg: 'El producto no se ha encontrado.'
            });
        };

        const updateProduct = await Product.findByIdAndUpdate(productId, newProduct, { session, new: true }).populate('presentations');


        

        await session.commitTransaction();

        return res.status(200).json({
            ok: true,
            msg: 'El producto fue actualizado correctamente.'
        });


    } catch {
        await session.abortTransaction();
        return res.status(500).json({
            ok: false,
            msg: 'Error interno del servidor.'
        });
    } finally { 
        session.endSession();
    };
};


const createNewProduct = async (req, res) => {

    const session = await mongoose.startSession();

    try {

        const { code, name, description, owner_id, stock, min_stock = 0, presentations } = req.body;

        if (!Array.isArray(presentations) || presentations.length === 0) {
            return res.status(400).json({
                ok: false,
                msg: 'Revisa la información.'
            })
        };

        session.startTransaction();

        const productExists = await Product.findOne({ code }).session(session);

        if (productExists) {
            await session.abortTransaction();
            return res.status(400).json({
                ok: false,
                msg: 'El código del producto ya existe.'
            })
        }

        const [newProduct] = await Product.create([{
            code,
            name,
            description,
            owner: owner_id,
            stock,
            minStock: min_stock,
        }], { session });


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
    getOneProduct,
    updateProduct
}