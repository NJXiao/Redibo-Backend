const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Obtener todos los países
const getPaises = async () => {
  return await prisma.pais.findMany({
    select: { id: true, nombre: true },
  });
};

// Obtener ciudades por ID de país
const getCiudades = async (idPais) => {
  return await prisma.ciudad.findMany({
    where: { id_pais: idPais },
    select: { id: true, nombre: true },
  });
};

// Obtener provincias por ID de ciudad
const getProvincias = async (idCiudad) => {
  return await prisma.provincia.findMany({
    where: { id_ciudad: idCiudad },
    select: { id: true, nombre: true },
  });
};

// Obtener todos los datos del carro con respecto a la dirección (para preseleccionar)
const getCarroConDireccion = async (idCarro) => {
  try {
    if (!idCarro) {
      throw new Error('ID del carro no proporcionado');
    }

    const carro = await prisma.carro.findUnique({
      where: {
        id: parseInt(idCarro)
      },
      select: {
        id: true,
        Direccion: {
          select: {
            id: true,
            calle: true,
            num_casa: true,
            zona: true,
            Provincia: {
              select: {
                id: true,
                nombre: true,
                Ciudad: {
                  select: {
                    id: true,
                    nombre: true,
                    Pais: {
                      select: {
                        id: true,
                        nombre: true
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!carro) {
      throw new Error('Carro no encontrado');
    }

    if (!carro.Direccion) {
      throw new Error('El carro no tiene dirección asociada');
    }

    return carro;
  } catch (error) {
    console.error('Error en getCarroConDireccion:', error);
    throw error;
  }
};

module.exports = {
  getPaises,
  getCiudades,
  getProvincias,
  getCarroConDireccion,
};
