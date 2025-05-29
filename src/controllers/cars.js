const { CarModel } = require("../models/cars");

class CarController {
  static async getByIdCar(req,res){
    const {id} = req.params
    try {
      const car = await CarModel.getByIdCar({id:Number(id)})
      res.status(200).json(car)
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message })
      } else {
        res.status(500).json({ error: "Error interno del servidor" })
      }
    }
  }

  static async getMostRented(req, res) {
    try {
      const cars = await CarModel.getMostRented()
      res.status(200).json(cars)
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener autos más alquilados' })
    }
  }
}

module.exports = { CarController }