const { getCaracteristicasAdicionales } = require('../modelo/filtroAdicional');

const filtrarCaracteristicasAdicionales = async (req, res) => {
  try {
    const { ids, caracteristicasAdicionales } = req.body;

    // Validación de la lista de IDs
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: 'Lista de IDs inválida o vacía' });
    }

    // Validación de caracteristicasAdicionales
    if (!caracteristicasAdicionales || caracteristicasAdicionales.trim() === '') {
      return res.status(400).json({ error: 'La característica adicional debe ser no vacío' });
    }

    // Eliminar los espacios en blanco y asegurarse de que es un string
    const caracteristica = caracteristicasAdicionales.trim();

    // Llamar al modelo para obtener los carros filtrados
    const carrosFiltrados = await getCaracteristicasAdicionales(ids, caracteristica);

    if (carrosFiltrados.length === 0) {
      return res.status(404).json({ message: 'No se encontraron carros con la característica adicional especificada' });
    }
    
    return res.status(200).json(carrosFiltrados);
  } catch (error) {
    console.error('Error al filtrar los carros:', error);
    return res.status(500).json({ error: 'Error al filtrar los carros' });
  }
};

module.exports = { filtrarCaracteristicasAdicionales };


