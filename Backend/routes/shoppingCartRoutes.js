const express = require('express');
const router = express.Router();
const shoppingCartController = require('../controllers/shoppingCartController');

router.post('/', shoppingCartController.create);
router.get('/', shoppingCartController.getAll);
router.get('/customer/:customerId', shoppingCartController.getByCustomer);
router.get('/:id', shoppingCartController.getById);
router.put('/:id', shoppingCartController.update);
router.delete('/:id', shoppingCartController.delete);

module.exports = router;