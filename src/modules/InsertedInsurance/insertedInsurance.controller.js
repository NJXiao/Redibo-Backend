const express =require('express');
const insertedInsurance = require('./buscarAuto.service');

const inserted= express.Router();

inserted.get('/autos',async(req,res) => {
    try {
        const insertJson = await insertedInsurance.findAll();
        res.json(insertJson);
    }catch(error){
        console.log('Autos no agregado')
        res.status(500).json({error : 'Autos no agregado'})
    }
})

module.exports = buscarAuto;