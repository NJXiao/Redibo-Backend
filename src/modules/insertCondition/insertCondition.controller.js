const { Router } = require('express');
const carroService = require('./insertCondition.service');

const router = Router();

router.post('/', async (req, res) => {
  try {
    const carro = await carroService.create(req.body);
    res.status(201).json(carro);
  } catch (error) {
    console.error('Error en el controlador:', error);
    res.status(500).json({ message: 'Error al crear el carro' });
  }
});

module.exports = router;
