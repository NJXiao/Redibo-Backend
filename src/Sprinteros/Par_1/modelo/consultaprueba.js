const { PrismaClient } = require('@prisma/client');

// Inicializa el cliente de Prisma
const prisma = new PrismaClient();

const getCarroName = async () => {
  try {
    // Consulta para obtener solo la marca y el modelo del carro
    const carros = await prisma.carro.findMany({
      select: {
        marca: true,
        modelo: true,
      },
    });

    console.log('Nombres de los carros:', carros);
  } catch (error) {
    console.error('Error al obtener los nombres de los carros:', error);
  } finally {
    await prisma.$disconnect();
  }
};

// Llama a la función para obtener los nombres de los carros
getCarroName();