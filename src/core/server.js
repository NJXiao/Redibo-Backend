const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const testModule = require('../modules/prueba/prueba.module');
const detailCarModule = require('../modules/detailCar/detailCar.module');

const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

//RUTAS DEFINIDAS   
app.use('/test', testModule.controller);

app.use('/detailCar', detailCarModule.controller);

module.exports = app;