import { searchModel } from "../models/search.js";
import {validateSearch } from "../validations/search.js";

export class searchController {
  static async createSearch(req, res) {
    try {
      const parseResult = validateSearch(req.body)

      if (!parseResult.success) {
        return res.status(400).json({ error: JSON.parse(parseResult.error.message) })
      }

      const { userId, criterio } = parseResult.data

      const newSearch = await searchModel.createSearch({ userId, criterio })
      res.status(201).json(newSearch)
    } catch (error) {
      console.error("Error al guardar la busqueda: ", error)

      if (error instanceof Error) {
        res.status(400).json({ error: error.message})
      } else {
        res.status(500).json({ error: "Error interno del servidor" })
      }

    }
  }
}