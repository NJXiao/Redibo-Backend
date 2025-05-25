const cloudinary = require("../config/cloudinary");
const prisma  = require("../config/prisma");

exports.crearSolicitud = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "No autorizado" });
    }

    const { license } = req.body;
    const licenseData = JSON.parse(license);

    const frontFile = req.files.front?.[0];
    const backFile = req.files.back?.[0];

    if (!frontFile || !backFile) {
      return res.status(400).json({ error: "Faltan imágenes de licencia" });
    }

    const uploadToCloudinary = (buffer, filename) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "licencias", public_id: filename },
          (err, result) => {
            if (err) reject(err);
            else resolve(result.secure_url);
          }
        );
        stream.end(buffer);
      });
    };

    const frontUrl = await uploadToCloudinary(
      frontFile.buffer,
      `front-${Date.now()}`
    );
    const backUrl = await uploadToCloudinary(
      backFile.buffer,
      `back-${Date.now()}`
    );

    await prisma.solicitudConductor.create({
      data: {
        usuarioId: userId,
        front: frontUrl,
        back: backUrl,
        categoria: licenseData.categoria,
        numeroLicencia: licenseData.numeroLicencia,
        fechaEmision: new Date(licenseData.fechaEmision),
        fechaVencimiento: new Date(licenseData.fechaVencimiento),
      },
    });

    // Actualizar estado del usuario
    const usuarioActualizado = await prisma.usuario.update({
      where: { id: userId },
      data: {
        estadoConductor: "PENDING",
      },
      select: {
        estadoConductor: true,
      },
    });

    res.status(201).json({
      message: "Solicitud creada correctamente",
      estadoConductor: usuarioActualizado.estadoConductor,
    });
  } catch (error) {
    console.error("Error al crear solicitud:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
