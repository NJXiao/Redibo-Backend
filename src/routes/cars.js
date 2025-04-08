import { Router } from "express";
import { CarController } from "../controllers/cars.js";

export const carRouter = Router()

carRouter.get('/', CarController.getAll)
carRouter.get('/most-rented', CarController.getMostRented)
