const { Router } = require('express');
const filterDisService = require('./filterDis.service');

const router = Router();

router.post('/filtros', async (req, res) => {
  try {
    const { ciudad, fecha_inicio, fecha_fin } = req.body;

    if (!ciudad || !fecha_inicio || !fecha_fin) {
      return res.status(400).json({ mensaje: 'Faltan parámetros.' });
    }

    const resultado = await filterDisService.filtrarCoches({
      ciudad,
      fecha_inicio,
      fecha_fin,
    });

    res.json(resultado);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
});

module.exports = router;