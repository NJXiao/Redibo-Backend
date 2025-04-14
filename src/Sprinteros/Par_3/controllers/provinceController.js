const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getProvincesByCityId = async (req, res) => {
  try {
    const { cityId } = req.params; // Obtener el ID de la ciudad de los parámetros de la ruta

    const provinces = await prisma.provincia.findMany({
      where: {
        id_ciudad: parseInt(cityId), // Filtrar las provincias por el ID de la ciudad
      },
    });

    if (!provinces || provinces.length === 0) {
      return res.status(404).json({ message: 'No se encontraron provincias para la ciudad especificada' });
    }

    res.json(provinces);
  } catch (error) {
    console.error('Error al obtener las provincias por ID de ciudad:', error);
    res.status(500).json({ error: 'Error al obtener las provincias' });
  }
};