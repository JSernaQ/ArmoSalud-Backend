const { getTopProducts } = require('../helpers/getTopProducts');
const { Invoice } = require('../models/invoice.model');
const { SalesReport } = require('../models/Reports/dailyReport.model');

const generateDailyReport = async (req, res) => {

    try {
        const { date } = req.body;

        const targetDay = new Date(date);

        const start = new Date(targetDay.setUTCHours(0, 0, 0, 0));
        const end = new Date(targetDay.setUTCHours(23, 59, 59, 999));

        const existReport = await SalesReport.find({ date: targetDay });

        if (existReport.length > 0) {
            return res.status(409).json({
                ok: false,
                msg: 'Ya existe un reporte para este dia.'
            })
        }

        const invoices = await Invoice.find({ date: { $gte: start, $lte: end } })
            .populate('items.product', '_id code name')
            .populate('items.presentation', '_id type');

        const totalInvoices = invoices.length
        let totalCancelInvoices = 0;
        let totalSales = 0;

        const validInvoices = invoices.filter(inv => inv.status === "Completa");
        const items = validInvoices.flatMap(inv => inv.items)
        const topProducts = Object.values(getTopProducts(items));


        for (let cancelInvoice of invoices) {
            if (cancelInvoice.status === "Completa") {
                totalSales += cancelInvoice.totalAmount
            }

            if (cancelInvoice.status === "Cancelada") {
                totalCancelInvoices += 1
            }
        }

        const newReport = await SalesReport.create({ date: targetDay, totalInvoices, totalCancelInvoices, totalSales, topProducts, invoices });

        return res.status(201).json({
            ok: true,
            msg: 'Reporte diario generado correctamente',
            newReport
        })


    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error al generar el reporte diario, comunicate con soporte.'
        });
    }

};

const getDailyReport = async (req, res) => {

    try {

        const { date } = req.body;

        const formattedDate = new Date(date);

        const end = new Date(formattedDate.setUTCHours(23,59,59,999));

        const dailyReport = await SalesReport.find({ date: {$gte: formattedDate, $lte: end} })
            .populate({
                path: 'invoices',
                populate: [
                    { path: 'seller', select: 'name' },
                    { path: 'items.product', select: 'code name' },
                    { path: 'items.presentation', select: 'type' },
                ]
            });

        if (!dailyReport) {
            return res.status(404).json({
                ok: false,
                msg: 'No se encontro un reporte para esa fecha'
            })
        }

        return res.status(200).json({
            ok: true,
            msg: 'Reporte encontrado.',
            dailyReport
        })

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            ok: false,
            msg: 'Error interno al obtener el reporte, comunicate con soporte.'
        })
        
    }

}

module.exports = {
    generateDailyReport,
    getDailyReport
};