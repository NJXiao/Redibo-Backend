import { Router } from "express";
import { ReservationController } from "../controllers/reservation.js";

export const reservationRouter = Router()

reservationRouter.post('/', ReservationController.createReservation)
reservationRouter.patch('/:id/state', ReservationController.updateReservationState)
reservationRouter.delete('/:id', ReservationController.deleteReservation)