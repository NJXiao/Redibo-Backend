const express = require("express");
const { prisma } = require("../lib/prisma");
const { getUserId } = require("../lib/auth");

const router = express.Router();

// GET /api/comentarios-carro?propietarioId=...
router.get("/", async (req, res) => {
  try {
    const { carroId, usuarioId, hostId } = req.query;

    const where = {};
    if (carroId) where.id_carro = Number.parseInt(carroId);
    if (usuarioId) where.id_usuario = Number.parseInt(usuarioId);

    // Filtro por hostId
    if (hostId) {
      where.carro = { id_usuario_rol: Number.parseInt(hostId) };
    }

    const comentarios = await prisma.comentarioCarro.findMany({
      where,
      include: {
        usuario: {
          select: { id: true, nombre: true, foto: true },
        },
        carro: {
          select: {
            id: true,
            marca: true,
            modelo: true,
            id_usuario_rol: true,
            Imagen: {
              select: { data: true, public_id: true },
              take: 1,
            },
          },
        },
        respuestas: {
          include: {
            host: {
              select: { id: true, nombre: true, foto: true },
            },
          },
          orderBy: { fecha_respuesta: "asc" },
        },
      },
      orderBy: { fecha_creacion: "desc" },
    });

    return res.json(comentarios);
  } catch (error) {
    console.error("Error al obtener comentarios:", error);
    return res.status(500).json({ error: "Error al obtener comentarios" });
  }
});

// GET /api/comentarios-carro/:id
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const comentario = await prisma.comentarioCarro.findUnique({
      where: { id: Number.parseInt(id) },
      include: {
        usuario: {
          select: {
            id: true,
            nombre: true,
            foto: true,
          },
        },
        carro: {
          select: {
            id: true,
            marca: true,
            modelo: true,
            id_usuario_rol: true,
            Imagen: {
              select: {
                data: true,
                public_id: true,
              },
              take: 1,
            },
          },
        },
        respuestas: {
          include: {
            host: {
              select: { id: true, nombre: true, foto: true },
            },
          },
          orderBy: { fecha_respuesta: "asc" },
        },
      },
    });

    if (!comentario) {
      return res.status(404).json({ error: "Comentario no encontrado" });
    }

    return res.json(comentario);
  } catch (error) {
    console.error("Error al obtener comentario:", error);
    return res.status(500).json({ error: "Error al obtener comentario" });
  }
});

// POST /api/comentarios-carro
router.post("/", async (req, res) => {
  try {
    const { id_carro, comentario, calificacion } = req.body;

    if (!id_carro || !comentario) {
      return res.status(400).json({ error: "Faltan campos requeridos" });
    }

    // Verificar autenticación
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ error: "No autorizado" });
    }

    // Verificar que el carro existe
    const carro = await prisma.carro.findUnique({
      where: { id: Number.parseInt(id_carro) },
    });

    if (!carro) {
      return res.status(404).json({ error: "Carro no encontrado" });
    }

    // Crear comentario
    const nuevoComentario = await prisma.comentarioCarro.create({
      data: {
        id_carro: Number.parseInt(id_carro),
        id_usuario: Number.parseInt(userId),
        comentario,
        calificacion: calificacion || 0,
      },
      include: {
        usuario: {
          select: {
            id: true,
            nombre: true,
            foto: true,
          },
        },
        carro: {
          select: {
            id: true,
            marca: true,
            modelo: true,
          },
        },
      },
    });

    return res.status(201).json(nuevoComentario);
  } catch (error) {
    console.error("Error al crear comentario:", error);
    return res.status(500).json({ error: "Error al crear comentario" });
  }
});

// PUT /api/comentarios-carro/:id
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { comentario, calificacion } = req.body;

    // Verificar autenticación
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ error: "No autorizado" });
    }

    // Verificar que el comentario existe y pertenece al usuario
    const comentarioExistente = await prisma.comentarioCarro.findUnique({
      where: { id: Number.parseInt(id) },
    });

    if (!comentarioExistente) {
      return res.status(404).json({ error: "Comentario no encontrado" });
    }

    if (comentarioExistente.id_usuario !== Number.parseInt(userId)) {
      return res
        .status(403)
        .json({ error: "No autorizado para editar este comentario" });
    }

    // Actualizar comentario
    const comentarioActualizado = await prisma.comentarioCarro.update({
      where: { id: Number.parseInt(id) },
      data: {
        comentario: comentario || comentarioExistente.comentario,
        calificacion:
          calificacion !== undefined
            ? calificacion
            : comentarioExistente.calificacion,
      },
      include: {
        usuario: {
          select: {
            id: true,
            nombre: true,
            foto: true,
          },
        },
        carro: {
          select: {
            id: true,
            marca: true,
            modelo: true,
          },
        },
      },
    });

    return res.json(comentarioActualizado);
  } catch (error) {
    console.error("Error al actualizar comentario:", error);
    return res.status(500).json({ error: "Error al actualizar comentario" });
  }
});

// DELETE /api/comentarios-carro/:id
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar autenticación
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ error: "No autorizado" });
    }

    // Verificar que el comentario existe y pertenece al usuario
    const comentario = await prisma.comentarioCarro.findUnique({
      where: { id: Number.parseInt(id) },
    });

    if (!comentario) {
      return res.status(404).json({ error: "Comentario no encontrado" });
    }

    if (comentario.id_usuario !== Number.parseInt(userId)) {
      return res
        .status(403)
        .json({ error: "No autorizado para eliminar este comentario" });
    }

    // Eliminar comentario y sus respuestas asociadas
    await prisma.$transaction([
      prisma.respuestaComentarioCarro.deleteMany({
        where: { id_comentario: Number.parseInt(id) },
      }),
      prisma.comentarioCarro.delete({
        where: { id: Number.parseInt(id) },
      }),
    ]);

    return res.json({
      success: true,
      message: "Comentario y respuestas eliminados correctamente",
    });
  } catch (error) {
    console.error("Error al eliminar comentario:", error);
    return res.status(500).json({ error: "Error al eliminar comentario" });
  }
});

// POST /api/comentarios-carro/:id/responder
router.post("/:id/responder", async (req, res) => {
  try {
    const { id } = req.params; // ID del comentario al que se responde
    const { respuesta } = req.body;

    // Validación de entrada
    if (
      !respuesta ||
      typeof respuesta !== "string" ||
      respuesta.trim().length === 0
    ) {
      return res.status(400).json({
        error: "La respuesta es requerida y debe ser un texto válido",
      });
    }

    // Verificar autenticación del host
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ error: "No autorizado" });
    }

    // Verificar que el comentario existe y obtener información del carro
    const comentario = await prisma.comentarioCarro.findUnique({
      where: { id: Number.parseInt(id) },
      include: {
        carro: {
          select: {
            id_usuario_rol: true,
          },
        },
      },
    });

    if (!comentario) {
      return res.status(404).json({ error: "Comentario no encontrado" });
    }

    // Verificar que el usuario es el host del vehículo
    if (comentario.carro.id_usuario_rol !== Number.parseInt(userId)) {
      return res.status(403).json({
        error:
          "Solo el propietario del vehículo puede responder a este comentario",
      });
    }

    // Crear la respuesta
    const nuevaRespuesta = await prisma.respuestaComentarioCarro.create({
      data: {
        id_comentario: Number.parseInt(id),
        id_usuario_host: Number.parseInt(userId),
        respuesta: respuesta.trim(),
        fecha_respuesta: new Date(),
      },
      include: {
        host: {
          select: {
            id: true,
            nombre: true,
            foto: true,
          },
        },
        comentario: {
          include: {
            usuario: {
              select: {
                id: true,
                nombre: true,
              },
            },
          },
        },
      },
    });

    // Actualizar el comentario para marcar que tiene respuesta
    await prisma.comentarioCarro.update({
      where: { id: Number.parseInt(id) },
      data: { tiene_respuesta: true },
    });

    return res.status(201).json({
      success: true,
      respuesta: nuevaRespuesta,
      message: "Respuesta publicada correctamente",
    });
  } catch (error) {
    console.error("Error al crear respuesta:", error);

    // Manejo específico de errores de Prisma
    if (error.code === "P2003") {
      return res.status(400).json({
        error: "Relación inválida - Verifique el ID del comentario",
      });
    }

    return res.status(500).json({
      error: "Error interno del servidor al procesar la respuesta",
    });
  }
});

module.exports = router;
