const express = require('express');
const paymentOrderController = require('../controllers/paymentOrderController');

const router = express.Router();

// Ruta para obtener todas las ciudades
router.post('/paymentOrder', paymentOrderController.createPaymentOrder);

// Ruta comprobante de pago
router.post('/paymentOrder/ReceiptPayment', paymentOrderController.ReceiptPayment);

router.get('/list-paymentOrder', paymentOrderController.getListPaymentOrders);

router.get('/paymentOrderbyCode', paymentOrderController.getInfoPaymentOrderbyCode);
module.exports = router;