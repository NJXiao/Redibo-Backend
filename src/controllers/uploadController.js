const cloudinary = require("../config/cloudinary");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const uploadImage = async (req, res) => {
  try {
    const file = req.file;
    const userId = req.user?.id;

    if (!file) return res.status(400).json({ error: "No file uploaded" });
    if (!userId)
      return res.status(401).json({ error: "User not authenticated" });

    const stream = cloudinary.uploader.upload_stream(
      { folder: "redibo" },
      async (error, result) => {
        if (error)
          return res.status(500).json({ error: "Cloudinary upload failed" });

        // Guardar la URL en el usuario autenticado
        await prisma.usuario.update({
          where: { id: userId },
          data: { foto: result.secure_url },
        });

        return res.json({ message: "Imagen subida", url: result.secure_url });
      }
    );

    stream.end(file.buffer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Upload failed" });
  }
};

module.exports = { uploadImage };
