const express =require('express');
const buscarServicioCarro = require('./insurance.service');

const buscarServ= express.Router();

buscarServ.get('',async(req,res) => {
    try {
        const buscarJson = await buscarServicioCarro.findAll();
        res.json(buscarJson);
        console.log(buscarJson);
    }catch(error){
        console.log('Autos no encontrados')
        res.status(500).json({error : 'Autos no encontrados'})
    }
})

module.exports = buscarServ;