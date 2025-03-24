const express = require('express');
const productController = require('../../controllers/customer/product.controller');

const router = express.Router();

// Customer Product Routes
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);

// Product FAQ Routes
router.get('/:id/faqs', productController.getProductFaqs);
router.post('/:id/faqs', productController.addProductFaq);
router.put('/:id/faqs/:faqId', productController.updateProductFaq);
router.delete('/:id/faqs/:faqId', productController.deleteProductFaq);

module.exports = router; 