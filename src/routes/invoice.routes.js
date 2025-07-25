const { Router } = require('express');
const router = Router();

const { isAdmin } = require('../middlewares/isAdmin')
const { verifyToken } = require('../middlewares/verifyJWT')

const {
    getInvoices,
    createNewInvoice,
    getOneInvoice,
    getOneDayInvoices,
    putCancelInvoice
} = require('../controllers/invoice.controller')

router.post('/create', verifyToken, createNewInvoice);
router.get('/consecutive/:consecutiveNumber', getOneInvoice);
router.put('/cancel', putCancelInvoice);
router.get('/date', verifyToken, getOneDayInvoices);
router.get('/', verifyToken, getInvoices);

module.exports = router;