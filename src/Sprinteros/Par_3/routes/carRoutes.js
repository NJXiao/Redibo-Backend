const express = require('express');
const router = express.Router();
const carController = require('../controllers/carController');
const { validateCreateCar } = require('../middlewares/validateCreateCar');
const { validateUpdateCar } = require('../middlewares/validateUpdateCar');
const validateID = require('../middlewares/validateID');

// En carRoutes.js, antes de definir las rutas
router.use((req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  next();
});

// Middleware para validar ID en todas las rutas que usen :id
router.param('id', validateID);

// Ruta base /api/v2/cars
router.route('/')
  .get(carController.getCars)
  .post(validateCreateCar, carController.createCar);

// Rutas con ID /api/v2/cars/:id
router.route('/:id')
  .get(carController.getCarById)
  .put(validateUpdateCar, carController.updateCar)
  .delete(carController.deleteCar); // DELETE /api/v2/cars/1

module.exports = router;