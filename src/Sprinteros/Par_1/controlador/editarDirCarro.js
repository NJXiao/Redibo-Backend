const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Función que actúa como controlador Express
const editarDireccionCarro = async (req, res) => {
  try {
    const id_carro = req.params.idCarro;
    const { id_provincia, calle, num_casa } = req.body;

    if (!id_provincia || !calle || !num_casa) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    // Buscar carro y su dirección
    const carro = await prisma.carro.findUnique({
      where: { id: parseInt(id_carro) },
      select: { direccion: { select: { id: true } } }
    });

    if (!carro || !carro.direccion) {
      return res.status(404).json({ error: 'Carro o dirección no encontrada' });
    }

    const id_direccion = carro.direccion.id;

    // Actualizar la dirección
    const direccionActualizada = await prisma.direccion.update({
      where: { id: id_direccion },
      data: {
        id_provincia,
        calle,
        num_casa
      }
    });

    return res.status(200).json({
      message: 'Dirección actualizada con éxito',
      direccion: direccionActualizada
    });
  } catch (error) {
    console.error('Error al actualizar la dirección:', error);
    return res.status(500).json({ error: error.message });
  }
};

module.exports = { editarDireccionCarro };
