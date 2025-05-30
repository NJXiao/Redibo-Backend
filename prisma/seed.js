const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const carro = await prisma.carro.findFirst();
  const usuario = await prisma.usuario.findFirst();

  if (!carro || !usuario) {
    throw new Error(
      "Debes tener al menos un carro y un usuario en la base de datos."
    );
  }

  const comentarios = [
    "Excelente carro, muy cómodo.",
    "Me encantó la experiencia de manejo.",
    "Buen rendimiento de combustible.",
    "El aire acondicionado funciona perfecto.",
    "Ideal para viajes largos.",
    "Muy espacioso y silencioso.",
    "Tiene buenos frenos y estabilidad.",
    "Buen diseño exterior.",
    "El sistema de sonido es increíble.",
    "Volvería a alquilar este carro sin duda.",
  ];

  for (let i = 0; i < comentarios.length; i++) {
    await prisma.comentarioCarro.create({
      data: {
        id_carro: carro.id,
        id_usuario: usuario.id,
        comentario: comentarios[i],
        calificacion: Math.floor(Math.random() * 5) + 1, // calificación aleatoria entre 1 y 5
      },
    });
  }

  console.log("10 comentarios creados con éxito.");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
