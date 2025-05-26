const Router = require("express");
const { CarController } = require("../controllers/cars");

const carRouter = Router()

carRouter.get('/most-rented', CarController.getMostRented)
carRouter.get('/:id/host',CarController.getHostOfCarro)
carRouter.get('/:id/renter',CarController.getRenterOfCarro)

module.exports = { carRouter }