const { getCiudades } = require('../modelo/filtroCiudad');

// Controlador para obtener las ciudades
const obtenerCiudades = async (req, res) => {
  try {
    const ciudades = await getCiudades(); // Llama a la función del modelo
    res.status(200).json(ciudades); // Envía las ciudades como respuesta en formato JSON
  } catch (error) {
    console.error('Error en el controlador:', error);
    res.status(500).json({ error: 'Error al obtener las ciudades' });
  }
};

module.exports = { obtenerCiudades };