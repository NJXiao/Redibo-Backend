const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const detailCarModule = require('../modules/detailCar/detailCar.module');
const filterCarModule = require('../modules/filterCar/filterCar.module');
const searchCarModule = require('../modules/searchCar/searchCar.module');
const filterU5Module = require('../modules/filterU5/filterU5.module');

const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

//RUTAS DEFINIDAS   

app.use('/detailCar', detailCarModule.controller);
app.use('/filterCar', filterCarModule.controller);
app.use('/searchCar', searchCarModule.controller);
app.use('/filterU5', filterU5Module.controller);

module.exports = app;