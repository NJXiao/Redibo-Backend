const express =require('express');
const { agregarCredencial } = require('./insertedInsurance.service');


const inserted= express.Router();

inserted.post('/',async(req,res) => {
    try {
        const insertJson = await agregarCredencial(req.body);
        res.status(201).json(insertJson);
        console.lof('insertado');
    }catch(error){
        console.log('no insertada ')
        res.status(500).json({error : 'no Insertada'})
        console.error('Error al insertar cobertura:', error);
    }
}
);
module.exports = inserted;