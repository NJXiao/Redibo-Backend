const express = require('express');
const paymentOrderController = require('../controllers/paymentOrderController');

const router = express.Router();

// Ruta para obtener todas las ciudades
router.post('/paymentOrder', paymentOrderController.createPaymentOrder);

module.exports = router;