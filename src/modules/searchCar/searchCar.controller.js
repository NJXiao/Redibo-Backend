const express = require('express');
const buscarServicio = require('./searchCar.service');
const buscarAuto = express.Router();

buscarAuto.get('/autos', async (req, res) => {
    try {
        const buscarJson = await buscarServicio.findAll();
        
        if (!buscarJson) {
            return res.status(404).json({ error: 'No se encontraron autos' });
        }
        
        res.json(buscarJson);
    } catch (error) {
        console.error('Error en la búsqueda de autos:', error);
        res.status(500).json({ error: 'Error interno del servidor al buscar autos' });
    }
});

module.exports = buscarAuto;