const express = require('express');
const buscarServicio = require('./searchCar.service');
const buscarAuto = express.Router();

buscarAuto.get('/autos', async (req, res) => {
    try {
        const buscarJson = await buscarServicio.findAll();
        
        if (!buscarJson) {
            return res.status(404).json({ 
                error: 'No se encontraron autos',
                message: 'La búsqueda no devolvió resultados'
            });
        }
        
        // Agregar información sobre las calificaciones en la respuesta
        const respuesta = {
            total_autos: buscarJson.length,
            autos: buscarJson,
            estadisticas: {
                promedio_general: buscarJson.reduce((acc, carro) => acc + (carro.calificacionpromedio || 0), 0) / buscarJson.length,
                autos_con_calificacion: buscarJson.filter(carro => carro.calificacionpromedio > 0).length
            }
        };
        
        res.json(respuesta);
    } catch (error) {
        console.error('Error en la búsqueda de autos:', error);
        res.status(500).json({ 
            error: 'Error interno del servidor al buscar autos',
            message: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

module.exports = buscarAuto;