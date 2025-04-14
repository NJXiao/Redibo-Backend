import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// POST search-history
const saveSearch = async (req, res) => {
    const { content, userId } = req.body;

    if (!content || !userId) {
        return res.status(400).json({ error: 'Faltan datos: contenido o userId' });
    }

    try {
        const newSearch = await prisma.busqueda.create({
            data: {
                contenido: content,
                userId
            }
        });

        res.status(201).json(newSearch);
    } catch (error) {
        res.status(500).json({ error: 'Error al guardar búsqueda' })
    }
};

//GET /search-history/:userId
const getUserSearches = async (req, res) => {
    const { userId } = req.params;

    try {
        const searches = await prisma.busqueda.findMany({
            where: { userId: parseInt(userId) },
            orderBy: { createdAt: 'desc' }
        });

        res.json(searches);
    } catch (error) {
        res.status(500).json({ error: 'ERror al obtener búsquedas' });
    }
}

// DELETE /search-history/:id
const deleteSearchById = async (req, res) => {
    const { id } = req.params;

    try {
        await prisma.busqueda.delete({
            where: { id: parseInt(id) }
        });

        res.json({ message: 'Búsqueda eliminada' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar búsqueda' });
    }
};

export default {
    saveSearch,
    getUserSearches,
    deleteSearchById
};