/*const express =require('express');
const seguroCarro = require('./insertedInsurance.service');


const inserted= express.Router();

inserted.post('/',async(req,res) => {
    try {
        const insertJson = await seguroCarro.agregarCredencial(req.body);
        res.status(201).json(insertJson);
        console.lof('insertado');
    }catch(error){
        console.log('no insertada ')
        res.status(500).json({error : 'no Insertada'})
        console.error('Error al insertar cobertura:', error);
    }
}
);
module.exports = inserted;*/
const express = require('express');
const seguroCarro = require('./insertedInsurance.service');

const inserted = express.Router();

inserted.post('/', async (req, res) => {
  try {
    const insertJson = await seguroCarro.agregarCredencial(req.body);
    console.log('Insertado correctamente');
    res.status(201).json(insertJson);
  } catch (error) {
    console.error('❌ Error al insertar cobertura:', error.message);
    res.status(500).json({ error: 'No insertada', detalle: error.message });
  }
});

module.exports = inserted;
