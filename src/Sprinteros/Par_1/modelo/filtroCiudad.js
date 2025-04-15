const { PrismaClient } = require('@prisma/client');

// Inicializa el cliente de Prisma
const prisma = new PrismaClient();

// Obtener ciudades por ID de país
const getCiudades = async (idPais) => {
  try {
    const ciudades = await prisma.ciudad.findMany({
      where: {
        id_pais: idPais, // Filtra por el ID del país
      },
      select: {
        id: true,
        nombre: true, // Selecciona el campo "nombre"
      },
    });

    return ciudades; // Devuelve las ciudades directamente
  } catch (error) {
    console.error('Error al obtener las ciudades:', error);
    throw error; // Lanza el error para que el controlador lo maneje
  } finally {
    await prisma.$disconnect();
  }
};

// Obtener provincias por ID de ciudad
const getProvincias = async (idCiudad) => {
  try {
    const provincias = await prisma.provincia.findMany({
      where: {
        id_ciudad: idCiudad, // Filtra por el ID de la ciudad
      },
      select: {
        id: true,
        nombre: true, // Selecciona el campo "nombre"
      },
    });

    return provincias; // Devuelve las provincias directamente
  } catch (error) {
    console.error('Error al obtener las provincias:', error);
    throw error; // Lanza el error para que el controlador lo maneje
  } finally {
    await prisma.$disconnect();
  }
};

// Obtener todos los países
const getPaises = async () => {
  try {
    const paises = await prisma.pais.findMany({
      select: {
        id: true,
        nombre: true, // Selecciona el campo "nombre"
      },
    });

    return paises; // Devuelve los países directamente
  } catch (error) {
    console.error('Error al obtener los países:', error);
    throw error; // Lanza el error para que el controlador lo maneje
  } finally {
    await prisma.$disconnect();
  }
};

// Obtener dirección completa (ID, calle, número de casa) por ID del carro
const getDireccionByCarroId = async (idCarro) => {
  try {
    const direccion = await prisma.carro.findUnique({
      where: {
        id: idCarro, // Filtra por el ID del carro
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
      throw new Error(`No se encontró una dirección asociada al carro con ID ${idCarro}`);
    }

    return direccion.direccion; // Devuelve la dirección completa
  } catch (error) {
    console.error('Error al obtener la dirección por ID del carro:', error);
    throw error; // Lanza el error para que el controlador lo maneje
  } finally {
    await prisma.$disconnect();
  }
};

module.exports = { getCiudades, getProvincias, getPaises, getDireccionByCarroId };

// en mi control ciudad que le pongo lo que quiero es esto que teniendo lel id del auto tendre la direccion del mismo y eso quiero que se muestre en mi apartado que es un texfield  direccion de calle   y su numero de casa