const { CarModel } = require("../models/cars");

class CarController {

  static async getMostRented(req, res) {
    try {
      const cars = await CarModel.getMostRented()
      res.status(200).json(cars)
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener autos más alquilados' })
    }
  }
  static async getRenterOfCarro(req,res){
    try {
      const { id } = req.params
      if (isNaN(Number(id))) {
        return res.status(400).json({ error: "El id del carro debe ser un numero" })
      }
      const renter = await CarModel.getRenderOfCarro({ id_carro: Number(id) });
      if (!renter) {
        return res.status(400).json({ error: "No existe el renter" })
      }
      res.status(200).json(renter)
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message })
      } else {
        res.status(500).json({ error: "Error interno del servidor" })
      }
    }
  }
  static async getHostOfCarro(req,res) {
    try {
      const { id } = req.params
      if (isNaN(Number(id))) {
        return res.status(400).json({ error: "El id del host debe ser un numero" })
      }
      const host = await CarModel.getHostOfCarro({ id_carro: Number(id) });
      if (!host) {
        return res.status(400).json({ error: "No existe el host" })
      }
      res.status(200).json(host)
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message })
      } else {
        res.status(500).json({ error: "Error interno del servidor" })
      }
    }
  }
}

module.exports = { CarController }