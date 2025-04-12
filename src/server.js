const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const testRoutes = require('./routes/test.routes');

const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

//RUTAS DEFINIDAS   
app.use('/test', testRoutes);


module.exports = app;