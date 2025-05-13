const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

// Importa los módulos
const detailCarModule = require('./modules/detailCar/detailCar.module');
const filterCarModule = require('./modules/filterCar/filterCar.module');
const searchCarModule = require('./modules/searchCar/searchCar.module');
const filterU5Module = require('./modules/filterU5/filterU5.module');
const filterDisModule = require('./modules/filterDis/filterDis.module');

const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

// Rutas principales
app.use('/filterDis', filterDisModule.controller);
app.use('/detailCar', detailCarModule.controller);
app.use('/filterCar', filterCarModule.controller);
app.use('/searchCar', searchCarModule.controller);
app.use('/filterU5', filterU5Module.controller);

// Ruta raíz
app.get('/', (req, res) => {
  res.send('server is running');
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});