import express from 'express';
import searchController from '../controllers/searchController.js';

const router = express.Router();

//POST: Guardar
router.post('/search-history', searchController.saveSearch);

//GET: Obtener
router.get('/search-history/:userId', searchController.getUserSearches);

//DELETE: Eliminar
router.delete('/search-history/:id', searchController.deleteSearchById);

export default router;