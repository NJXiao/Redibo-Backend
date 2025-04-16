const express = require('express');
const router = express.Router();
const carRoutes = require('./carRoutes');
const direcRoutes = require('./direcRoutes');
const imageRoutes = require('./imageRoutes');

router.use('/cars', carRoutes);
router.use('/direc', direcRoutes);
router.use('/images', imageRoutes);

module.exports = router;