const express = require('express');
const correoEService = require('./correoE.service');

const correoE = express.Router();

correoE.put('/:id', async(req , res) =>{
    const id = req.params.id;
    const {estado} = req.body;

    try {
        const updateNotificacion = await correoEService.updateEstado(id, estado);
        res.json(updateNotificacion)
    } catch (error) {
        console.log('Error al actualizar la notificación');
        res.status(500).json({ error: 'Error al actualizar la notificación' });
    }
})

module.exports = correoE;