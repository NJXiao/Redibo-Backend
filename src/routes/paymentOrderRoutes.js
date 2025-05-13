const express = require('express');
const paymentOrderController = require('../controllers/paymentOrderController');
const { authenticateToken } = require('../middlewares/authMiddleware');


const router = express.Router();

// Ruta para obtener todas las ciudades
router.post('/paymentOrder', paymentOrderController.createPaymentOrder);

// Ruta comprobante de pago
router.post('/paymentOrder/ReceiptPayment', paymentOrderController.ReceiptPayment);

router.get('/list-paymentOrder',authenticateToken, paymentOrderController.getListPaymentOrders);

router.get('/paymentOrderbyCode', paymentOrderController.getInfoPaymentOrderbyCode);

router.get('/admin/getProcessingOrders', authenticateToken , paymentOrderController.getListProcessingOrders);

module.exports = router;