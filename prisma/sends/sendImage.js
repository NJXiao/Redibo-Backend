const fs = require('fs/promises');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const { uploadCarImage } = require('../../src/Sprinteros/Par_3/services/imageService.js'); // Ruta correcta al servicio

const prisma = new PrismaClient();

async function main() {
  // Variables necesarias
  const carrosHost1 = [
    { id: 1, placa: '1234ABC' },
    { id: 5, placa: '1234ABC1' },
    { id: 6, placa: '5678DEF2' },
    { id: 7, placa: '3456GHI3' },
    { id: 8, placa: '6399JKL4' },
  ];
  const imagenesPorCarro = 3; // Número máximo de imágenes por carro

  // Definición de la ruta base de imágenes usando una ruta relativa dentro del repositorio
  const imagenesBasePath = path.join(__dirname, '..', 'sends', 'imagen');

  for (const [index, carro] of carrosHost1.entries()) {
    try {
      // Verificar imágenes existentes en la base de datos
      const imagenesExistentes = await prisma.imagen.findMany({
        where: { id_carro: carro.id },
      });

      if (imagenesExistentes.length >= imagenesPorCarro) {
        console.log(`El carro ${carro.placa} ya tiene ${imagenesExistentes.length} imágenes.`);
        continue;
      }

      // Calcular cuántas imágenes necesitamos añadir
      const imagenesNecesarias = imagenesPorCarro - imagenesExistentes.length;

      // Procesar imágenes para el carro
      for (let i = 1; i <= imagenesNecesarias; i++) {
        // Construir la ruta usando la estructura: idhost_1/idcard_<carro.id>/imagen<i>.jpg
        const imagePath = path.join(imagenesBasePath, 'idhost_1', `idcard_${carro.id}`, `imagen${i}.jpg`);

        try {
          // Leer el archivo de imagen
          const imageBuffer = await fs.readFile(imagePath);

          // Usar el nuevo servicio uploadCarImage para subir a Cloudinary
          const result = await uploadCarImage(imageBuffer, carro.id);

          if (result.success) {
            console.log(`Imagen ${i} añadida para carro ${carro.placa}: ${result.data.data}`);
          } else {
            console.warn(`No se pudo subir la imagen ${i} para el carro ${carro.placa}`);
          }
        } catch (error) {
          console.warn(`No se pudo cargar imagen ${imagePath}: ${error.message}`);
        }
      }
    } catch (error) {
      console.error(`Error procesando el carro ${carro.placa}: ${error.message}`);
    }
  }
}

// Ejecutar la función principal
main()
  .then(() => {
    console.log('Proceso completado.');
    prisma.$disconnect(); // Cerrar la conexión con Prisma
  })
  .catch((error) => {
    console.error('Error al procesar las imágenes:', error);
    prisma.$disconnect(); // Cerrar la conexión con Prisma en caso de error
  });