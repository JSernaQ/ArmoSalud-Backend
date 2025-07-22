const { Router } = require('express');
const router = Router();

const { 
    getAllProducts,
    createNewProduct,
    getOneProduct
} = require('../controllers/product.controlles');

router.get('/', getAllProducts);

router.get('/:productId', getOneProduct);

router.post(
    '/create', createNewProduct
);

module.exports = router;