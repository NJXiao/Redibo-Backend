  const fs = require('fs/promises');
  const path = require('path');
  const { PrismaClient } = require('@prisma/client');
  const { uploadCarImage } = require('../../src/Sprinteros/Par_3/services/imageService.js');

  const prisma = new PrismaClient();

  async function main() {
    const carrosHost1 = [
      { id: 1, placa: '1234ABC' },
      { id: 5, placa: '1234ABC1' },
      { id: 6, placa: '5678DEF2' },
      { id: 7, placa: '3456GHI3' },
      { id: 8, placa: '6399JKL4' },
    ];
    const imagenesPorCarro = 3;
    const imagenesBasePath = path.join(__dirname, '..', 'sends', 'imagen');

    for (const carro of carrosHost1) {
      try {
        const imagenesExistentes = await prisma.imagen.findMany({
          where: { id_carro: carro.id },
        });

        if (imagenesExistentes.length >= imagenesPorCarro) {
          console.log(`El carro ${carro.placa} ya tiene ${imagenesExistentes.length} imágenes.`);
          continue;
        }

        const imagenesNecesarias = imagenesPorCarro - imagenesExistentes.length;

        for (let i = 1; i <= imagenesNecesarias; i++) {
          const imagePath = path.join(imagenesBasePath, 'idhost_1', `idcard_${carro.id}`, `imagen${i}.jpg`);

          try {
            const imageBuffer = await fs.readFile(imagePath);

            const result = await uploadCarImage(imageBuffer, carro.id);

            if (result.success) {
              console.log(`Imagen ${i} añadida para carro ${carro.placa}: ${result.data.data}`);
            } else {
              console.warn(`No se pudo subir la imagen ${i} para el carro ${carro.placa}`);
            }
          } catch (error) {
            console.warn(`Error al procesar la imagen ${imagePath}: ${error.message}`);
          }
        }
      } catch (error) {
        console.error(`Error procesando el carro ${carro.placa}: ${error.message}`);
      }
    }
  }

  main()
    .then(() => {
      console.log('Proceso completado.');
      prisma.$disconnect();
    })
    .catch((error) => {
      console.error('Error al procesar las imágenes:', error.message);
      prisma.$disconnect();
    });