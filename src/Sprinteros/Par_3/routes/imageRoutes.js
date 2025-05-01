// backend/routes/imageRoutes.js

const express = require('express');
const imageController = require('../controllers/imageController');
const validateImage = require('../middlewares/validateImage');

const router = express.Router();

// Listar todas las imágenes de un carro
router.get('/:carId', imageController.getImagesByCarId);

// Subir una nueva imagen para un carro
router.post('/:carId', validateImage, imageController.createImage);

// Reemplazar una imagen existente
router.put('/:imageId', validateImage, imageController.updateImage);

// Eliminar una imagen
router.delete('/:imageId', imageController.deleteImage);

module.exports = router;
