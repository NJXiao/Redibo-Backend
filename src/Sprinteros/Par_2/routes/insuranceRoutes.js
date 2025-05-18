// src/Par_Insurance/routes/insuranceRoutes.js
const express = require('express');
const router = express.Router();
const { getInsuranceTypesHandler } = require('../controllers/insuranceController');

router.route('/types').get(getInsuranceTypesHandler);


module.exports = router;