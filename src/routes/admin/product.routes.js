const express = require('express');
const productController = require('../../controllers/admin/product.controller');

const router = express.Router();

// Admin Product Routes
router.get('/', productController.getAllProducts);
router.post('/', productController.createProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

// Admin Category Routes
router.get('/categories', productController.getCategories);
router.post('/categories', productController.createCategory);

module.exports = router; 