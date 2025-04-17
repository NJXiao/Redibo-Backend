import { Router } from "express";
import { searchController } from "../controllers/search.js";

export const searchRouter = Router()

searchRouter.post('/', searchController.createSearch)