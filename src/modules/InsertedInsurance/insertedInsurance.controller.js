const express =require('express');
const insertedInsurance = require('./buscarAuto.service');

const inserted= express.Router();

inserted.post('/',async(req,res) => {
    try {
        const insertJson = await insertedInsurance.findAll();
        res.status(201).json(insertJson);
    }catch(error){
        console.log('Cobertura no insertada ')
        res.status(500).json({error : 'Cobertura no Insertada'})
    }
})

module.exports = inserted;