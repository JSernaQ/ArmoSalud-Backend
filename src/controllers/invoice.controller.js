const mongoose = require('mongoose')

const { Invoice } = require('../models/invoice.model');
const { getNextSequence } = require('../helpers/getNextSequence');
const { Product } = require('../models/Product/product.model');
const { Presentation } = require('../models/Product/presentation.model');

const createNewInvoice = async (req, res) => {

    const session = await mongoose.startSession();

    try {

        //Start a MONGO session to abort in case of error
        session.startTransaction();

        const { items, seller, totalAmount } = req.body;

        console.log(req);


        if (!items || items.length === 0 || !totalAmount || !seller) {
            return res.status(400).json({
                ok: false,
                msg: 'Los datos de la factura están incompletos.'
            });
        }

        //Get the next consecutive number for the invoice
        const nextConsecutive = await getNextSequence('invoice', session);

        //Iterate over the items to reduce stock
        for (const item of items) {

            const product = await Product.findById(item.product).session(session);
            const presentation = await Presentation.findById(item.presentation);

            if (!product || !presentation) {
                await session.abortTransaction();
                return res.status(400).json({
                    ok: false,
                    msg: 'No se encontro un producto.'
                })
            }

            const productId = product._id;

            //The quantity of product sold is added to the type of presentation (Example: Und = 1und, Box = 10und)
            const stockSold = item.quantity * presentation.equivalence

            if (product.stock < stockSold) {
                await session.abortTransaction();
                return res.status(400).json({
                    ok: false,
                    msg: `Stock insuficiente para el producto ${product.name}.`
                });
            }

            await Product.findByIdAndUpdate(productId, { $inc: { stock: -stockSold } }).session(session)

        }

        const [newInvoice] = await Invoice.create([{ consecutive: nextConsecutive, items, seller, totalAmount: totalAmount }], { session });

        //Commit the changes
        await session.commitTransaction()

        return res.status(201).json({
            ok: true,
            msg: 'Factura generada correctamente.',
            invoice: newInvoice
        });

    } catch (error) {

        await session.abortTransaction();

        console.error('Error interno al crear una nueva factura.', error.message);

        return res.status(500).json({
            ok: false,
            msg: 'Error interno al crear una nueva factura.'
        });

    } finally {
        session.endSession();
    }

}

const getOneInvoice = async (req, res) => {

    try {

        const consecutive = req.params.consecutiveNumber;

        const invoice = await Invoice.findOne({ consecutive: consecutive })
            .populate('items.product', 'name')
            .populate('items.presentation', 'type equivalence price');

        if (!invoice) {
            return res.status(404).json({
                ok: false,
                msg: 'Factura no encontrada.'
            })
        };

        return res.status(200).json({
            ok: true,
            msg: 'Factura encontrada.',
            invoice
        });

    } catch (error) {
        console.error('Error interno al buscar factura.', error.message);

        return res.status(500).json({
            ok: false,
            msg: 'Error interno al buscar la factura.'
        });
    }

}

const getOneDayInvoices = async (req, res) => {

    try {

        const { date } = req.body;

        if (!date) {
            return res.status(400).json({
                ok: false,
                msg: "Fecha no proporcionada."
            });
        }

        const targetDate = new Date(date);

        const start = new Date(targetDate.setUTCHours(0, 0, 0, 0));
        const end = new Date(targetDate.setUTCHours(23, 59, 59, 999));

        const invoices = await Invoice.find({
            date: { $gte: start, $lte: end }
        })
            .sort({ date: -1 })
            .populate('items.product', 'name')
            .populate('items.presentation', 'type equivalence price');

        return res.status(200).json({
            ok: true,
            msg: "Facturas encontradas.",
            invoices
        })

    } catch (error) {
        console.error("Error al obtener facturas del día:", error.message);

        return res.status(500).json({
            ok: false,
            msg: "Error interno al buscar las facturas."
        });
    }

}

const getInvoices = async (req, res) => {

    try {

        const invoices = await Invoice.find()
            .sort({ date: -1 });

        return res.status(200).json({
            ok: true,
            msg: "Facturas encontradas.",
            invoices
        })

    } catch (error) {
        console.error("Error al obtener facturas:", error.message);

        return res.status(500).json({
            ok: false,
            msg: "Error interno al buscar las facturas."
        });
    }

};

const putCancelInvoice = async (req, res) => {

    try {

        const { consecutive } = req.body;

        if (!consecutive) {
            return res.status(400).json({
                ok: false,
                msg: "No se proporciono el consecutivo."
            });
        }

        const newinvoice = await Invoice.findOneAndUpdate({ consecutive: consecutive }, { status: "Cancelada" })
            .populate('items.product', 'name');

        if (newinvoice.status === "Cancelada") {
            return res.status(400).json({
                ok: false,
                msg: 'Esta factura ya ha sido cancelada.'
            })
        }

        for (let item of newinvoice.items) {
            await Product.findByIdAndUpdate(item.product._id, { $inc: { stock: item.quantity } })
        }


        if (!newinvoice) {
            return res.status(404).json({
                ok: false,
                msg: "No se encontro el consecutivo."
            });
        }

        return res.status(200).json({
            ok: true,
            msg: 'Factura cancelada correctamente.'
        })

    } catch (error) {
        console.error("Error al cancelar factura:", error.message);

        return res.status(500).json({
            ok: false,
            msg: "Error interno al cancelar la factura."
        });
    }

};

module.exports = {
    createNewInvoice,
    getOneInvoice,
    getOneDayInvoices,
    getInvoices,
    putCancelInvoice
}