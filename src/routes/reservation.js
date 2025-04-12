import { Router } from "express";
import { ReservationController } from "../controllers/reservation.js";

export const reservationRouter = Router()

reservationRouter.post('/', ReservationController.createReservation)