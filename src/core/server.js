const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const testModule = require('../modules/prueba/prueba.module');
const detailCarModule = require('../modules/detailCar/detailCar.module');
const provincias = require('../modules/prueba2/prueba2.module');
const busquedaAuto= require('../modules/buscarAuto/buscarAuto.module');
const insertInsurance= require('../modules/InsertedInsurance/insertedInsurance.module');
const insurance=require('../modules/insurance/insurance.module');

const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

//RUTAS DEFINIDAS   
app.use('/test', testModule.controller);
app.use('/detailCar', detailCarModule.controller);
app.use('/prueba2',provincias.controller);
app.use('/busqueda',busquedaAuto.controller);
app.use('/insertedInsurance', insertInsurance.controller);

app.use('/insurance',insurance.controller);

module.exports = app;