const express = require('express');
const pruebService = require('./prueba.service');

const router = express.Router();


router.get('/',async (req, res) => {
    try{
        const pruebas = await pruebService.findAll();
        res.json(pruebas);
    }catch(error){
        res.status(500).json({error: 'Error al obtener prueba'});
        console.log('Error al obtener prueba');
    }
});

module.exports = router;