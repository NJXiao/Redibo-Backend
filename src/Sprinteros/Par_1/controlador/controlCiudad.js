const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const obtenerCiudadesPorPais = async (req, res) => {
  try {
    const { idPais } = req.params;
    const ciudades = await prisma.ciudad.findMany({ where: { id_pais: parseInt(idPais) } });
    res.status(200).json(ciudades);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las ciudades' });
  }
};

const obtenerProvinciasPorCiudad = async (req, res) => {
  try {
    const { idCiudad } = req.params;
    const provincias = await prisma.provincia.findMany({ where: { id_ciudad: parseInt(idCiudad) } });
    res.status(200).json(provincias);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las provincias' });
  }
};

const obtenerPaises = async (req, res) => {
  try {
    const paises = await prisma.pais.findMany();
    res.status(200).json(paises);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los países' });
  }
};

// Nueva función: Obtener dirección completa por ID del auto
const obtenerDireccionPorAuto = async (req, res) => {
  try {
    const { idAuto } = req.params;

    if (!idAuto || isNaN(idAuto)) {
      return res.status(400).json({ error: 'El ID del auto es inválido o no fue proporcionado' });
    }

    const direccion = await prisma.carro.findUnique({
      where: {
        id: parseInt(idAuto), // Filtra por el ID del auto
      },
      select: {
        direccion: {
          select: {
            id: true, // ID de la dirección
            calle: true, // Calle asociada a la dirección
            num_casa: true, // Número de casa asociado a la dirección
          },
        },
      },
    });

    if (!direccion || !direccion.direccion) {
      return res.status(404).json({ error: `No se encontró una dirección asociada al auto con ID ${idAuto}` });
    }

    res.status(200).json(direccion.direccion); // Devuelve la dirección completa
  } catch (error) {
    console.error('Error al obtener la dirección por ID del auto:', error);
    res.status(500).json({ error: 'Error al obtener la dirección por ID del auto' });
  }
};

module.exports = { 
  obtenerCiudadesPorPais, 
  obtenerProvinciasPorCiudad, 
  obtenerPaises, 
  obtenerDireccionPorAuto 
};