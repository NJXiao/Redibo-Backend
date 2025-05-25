const express = require('express');
const correoMService = require('./correoM.service');

const correoM = express.Router();

correoM.get('/', async(req, res) => {
    try {
        correoMJson = await correoMService.findAll();
        res.json(correoMJson);
    } catch (error) {
        console.log('Correo no encontrado');
        res.status(500).json({ error: 'Correo no encontrado' });
    }
})

module.exports = correoM;