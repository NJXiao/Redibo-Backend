/** const { PrismaClient } = require('@prisma/client');

// Inicializa el cliente de Prisma
const prisma = new PrismaClient();

const getCiudades = async () => {
  try {
    // Consulta para obtener todas las ciudades
    const ciudades = await prisma.ciudad.findMany({
      select: {
        id: true,
        nombre: true, // Selecciona el campo "nombre"
      },
    });

    // Formatea las ciudades en un array de objetos
    const listaCiudad = ciudades.map(ciudad => ({
      id: ciudad.id,
      nombre: ciudad.nombre,
    }));

    console.log('Ciudades disponibles en array:', ciudadesArray);
  } catch (error) {
    console.error('Error al obtener las ciudades:', error);
  } finally {
    await prisma.$disconnect();
  }
};

// Llama a la función para obtener las ciudades
getCiudades(); **/

const { PrismaClient } = require('@prisma/client');

// Inicializa el cliente de Prisma
const prisma = new PrismaClient();

const getCiudades = async () => {
  try {
    // Consulta para obtener todas las ciudades
    const ciudades = await prisma.ciudad.findMany({
      select: {
        id: true,
        nombre: true, // Selecciona el campo "nombre"
      },
    });

    // Formatea las ciudades en un array de objetos
    return ciudades.map(ciudad => ({
      id: ciudad.id,
      nombre: ciudad.nombre,
    }));
  } catch (error) {
    console.error('Error al obtener las ciudades:', error);
    return [];
  } finally {
    await prisma.$disconnect();
  }
};

module.exports = { getCiudades };