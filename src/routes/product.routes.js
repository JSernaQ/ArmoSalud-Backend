const { Router } = require('express');
const router = Router();

const { verifyToken } = require('../middlewares/verifyJWT');
const { isAdmin } = require('../middlewares/isAdmin');

const {
    getAllProducts,
    createNewProduct,
    getOneProduct,
    updateProduct
} = require('../controllers/product.controlles');

router.get('/', verifyToken, getAllProducts);

router.get('/:productId', verifyToken, getOneProduct);

router.post('/create', verifyToken, isAdmin, createNewProduct);

router.put('/update', verifyToken, isAdmin, updateProduct);

module.exports = router;