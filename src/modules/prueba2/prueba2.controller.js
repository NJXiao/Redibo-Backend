const express = require('express');
const pruebaServicio = require('./prueba2.service');

const provincia = express.Router();

provincia.get('/mi',async(req,res)=>{
    try {
        const pro = await pruebaServicio.findAll();
        res.json(pro);
    }catch (error){
        console.log('valio chetos');
        res.status(500).json({error: 'en otra vida'});
    }
});

module.exports = provincia;