const { getTransmicion } = require('../modelo/filtroTransmicion');

const filtrarCarroPorTransmision = async (req, res) => {
  try {
    const { ids, transmision } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: 'Lista de IDs inválida o vacía' });
    }

    if (!transmision) {
      return res.status(400).json({ error: 'Tipo de transmisión no especificado' });
    }

    const carrosFiltrados = await getTransmicion(ids, transmision);

    if (carrosFiltrados.length === 0) {
      return res.status(404).json({ message: 'No se encontraron carros con la transmisión especificada' });
    }

    return res.status(200).json(carrosFiltrados);
  } catch (error) {
    console.error('Error al filtrar los carros:', error);
    return res.status(500).json({ error: 'Error al filtrar los carros' });
  }
};

module.exports = { filtrarCarroPorTransmision };