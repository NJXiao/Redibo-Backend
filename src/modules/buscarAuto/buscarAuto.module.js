const traerControlarAuto = require('./buscarAuto.controller');
const traerServicioAuto = require('./buscarAuto.service');

module.exports = {
    controller: traerControlarAuto,
    service: traerServicioAuto,
}