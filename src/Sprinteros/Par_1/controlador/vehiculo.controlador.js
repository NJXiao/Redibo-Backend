const { obtenerPlacaPorId, obtenerVIMPorId, obtenerMarcaPorId, obtenerModeloPorId, obtenerAnioPorId, obtenerVehiculoCompletoPorId, obtenerCaracteristicasPorId, obtenerCaracteristicasAdicionalesPorId  } = require('../modelo/vehiculo.modelo');

const obtenerPlaca = async (req, res) => {
  try {
    const id = req.params.id;
    const placa = await obtenerPlacaPorId(id);

    if (!placa) {
      return res.status(404).json({ mensaje: 'Vehículo no encontrado' });
    }

    res.json(placa);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error del servidor', error: error.message });
  }
};
// Obtener el VIM por ID
const obtenerVIM = async (req, res) => {
  try {
    const id = req.params.id;
    const vim = await obtenerVIMPorId(id);

    if (!vim) {
      return res.status(404).json({ mensaje: 'Vehículo no encontrado' });
    }

    res.json(vim);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error del servidor', error: error.message });
  }
};
// Obtener la marca por ID
const obtenerMarca = async (req, res) => {
  try {
    const id = req.params.id;
    const marca = await obtenerMarcaPorId(id);

    if (!marca) {
      return res.status(404).json({ mensaje: 'Vehículo no encontrado' });
    }

    res.json(marca);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error del servidor', error: error.message });
  }
};

// Controlador para obtener el modelo
const obtenerModelo = async (req, res) => {
  try {
    const id = req.params.id;
    const modelo = await obtenerModeloPorId(id);

    if (!modelo) {
      return res.status(404).json({ mensaje: 'Vehículo no encontrado' });
    }

    res.json(modelo);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error del servidor', error: error.message });
  }
};

// Controlador para obtener el año
const obtenerAnio = async (req, res) => {
  try {
    const id = req.params.id;
    const ano = await obtenerAnioPorId(id);

    if (!ano) {
      return res.status(404).json({ mensaje: 'Vehículo no encontrado' });
    }

    res.json(ano);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error del servidor', error: error.message });
  }
};

const obtenerVehiculoCompleto = async (req, res) => {
  try {
    const id = req.params.id;
    const vehiculo = await obtenerVehiculoCompletoPorId(id);

    if (!vehiculo) {
      return res.status(404).json({ mensaje: 'Vehículo no encontrado' });
    }

    res.json(vehiculo);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error del servidor', error: error.message });
  }
};

const obtenerCaracteristicas = async (req, res) => {
  try {
    const id = req.params.id;
    const caracteristicas = await obtenerCaracteristicasPorId(id);

    if (!caracteristicas) {
      return res.status(404).json({ mensaje: 'Características no encontradas' });
    }

    res.json(caracteristicas);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error del servidor', error: error.message });
  }
};



const obtenerCaracteristicasAdicionales = async (req, res) => {
  try {
    const id = req.params.id;
    const adicionales = await obtenerCaracteristicasAdicionalesPorId(id);

    if (!adicionales || adicionales.length === 0) {
      return res.status(404).json({ mensaje: 'Características adicionales no encontradas' });
    }

    res.json({ caracteristicasAdicionales: adicionales });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error del servidor', error: error.message });
  }
};


module.exports = { obtenerPlaca, obtenerVIM, obtenerMarca, obtenerModelo,obtenerAnio, obtenerVehiculoCompleto, obtenerCaracteristicas, obtenerCaracteristicasAdicionales};
