
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const obtenerPlacaPorId = async (id) => {
  try {
    console.log('ID recibido:', id);
    const placa = await prisma.carro.findUnique({
      where: { id: parseInt(id) }, // Asegúrate de que el campo 'id' exista en el modelo
      select: { placa: true }, // Solo selecciona el campo "placa"
    });
    console.log('Placa encontrada:', placa);
    return placa;
  } catch (error) {
    console.error('Error al obtener la placa:', error);
    throw error;
  }
};


// Obtener solo el VIM del carro por ID
const obtenerVIMPorId = async (id) => {
    try {
      console.log('ID recibido para VIM:', id);
      const vim = await prisma.carro.findUnique({
        where: { id: parseInt(id) },
        select: { vim: true }, // Asegúrate de que el campo se llame exactamente "vim"
      });
      console.log('VIM encontrado:', vim);
      return vim;
    } catch (error) {
      console.error('Error al obtener el VIM:', error);
      throw error;
    }
  };


// Obtener solo la marca por ID
const obtenerMarcaPorId = async (id) => {
    try {
      const marca = await prisma.carro.findUnique({
        where: { id: parseInt(id) },
        select: { marca: true }
      });
      return marca;
    } catch (error) {
      console.error('Error al obtener la marca:', error);
      throw error;
    }
  };

// Obtener solo el modelo por ID
const obtenerModeloPorId = async (id) => {
    try {
      const modelo = await prisma.carro.findUnique({
        where: { id: parseInt(id) },
        select: { modelo: true } // Seleccionamos solo el campo "modelo"
      });
      return modelo;
    } catch (error) {
      console.error('Error al obtener el modelo:', error);
      throw error;
    }
  };

  // Obtener solo el año por ID
const obtenerAnioPorId = async (id) => {
    try {
      const anio = await prisma.carro.findUnique({
        where: { id: parseInt(id) },
        select: { año: true } // Seleccionamos solo el campo "ano"
      });
      return anio;
    } catch (error) {
      console.error('Error al obtener el año:', error);
      throw error;
    }
 };

 const obtenerVehiculoCompletoPorId = async (id) => {
  try {
    const vehiculo = await prisma.carro.findUnique({
      where: { id: parseInt(id) },
      select: {
        placa: true,
        vim: true,
        marca: true,
        modelo: true,
        año: true, // Asegúrate que en Prisma esté como "año"
      },
    });

    if (vehiculo) {
      // Reestructuramos el objeto para asegurarnos del orden deseado
      const vehiculoOrdenado = {
        vim: vehiculo.vim,
        año: vehiculo.año,
        marca: vehiculo.marca,
        modelo: vehiculo.modelo,
        placa: vehiculo.placa,
      };

      return vehiculoOrdenado;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error al obtener los datos completos del vehículo:', error);
    throw error;
  }
};


const obtenerCaracteristicasPorId = async (id) => {
  try {
    const caracteristicas = await prisma.carro.findUnique({
      where: { id: parseInt(id) },
      select: {
        asientos: true, // Agregar el campo "asientos"
        puertas: true,
        transmicion: true,
        soat: true,
        combustiblesporCarro: {
          select: {
            combustible: {
              select: {
                tipoDeCombustible: true,
              },
            },
          },
        },
      },
    });

    if (!caracteristicas) return null;

    // Extraer tipo(s) de combustible
    const tiposCombustible = caracteristicas.combustiblesporCarro.map(
      (c) => c.combustible.tipoDeCombustible
    );

    // Retornar datos en el orden solicitado
    return {
      tipoDeCombustible: tiposCombustible.join(', '),
      asientos: caracteristicas.asientos, // Incluir "asientos" en la respuesta
      puertas: caracteristicas.puertas,
      transmision: caracteristicas.transmicion,
      soat: caracteristicas.soat,
    };
  } catch (error) {
    console.error('Error al obtener características del vehículo:', error);
    throw error;
  }
};

const obtenerCaracteristicasAdicionalesPorId = async (id) => {
  try {
    const caracteristicasAdicionales = await prisma.carro.findUnique({
      where: { id: parseInt(id) },
      select: {
        caracteristicasAdicionalesCarro: {
          select: {
            carasteristicasAdicionales: {
              select: {
                nombre: true, // Selecciona el nombre de las características adicionales
              },
            },
          },
        },
      },
    });

    if (!caracteristicasAdicionales) return null;

    // Extraer y formatear las características adicionales
    const adicionales = caracteristicasAdicionales.caracteristicasAdicionalesCarro.map(
      (item) => item.carasteristicasAdicionales.nombre
    );

    return adicionales;
  } catch (error) {
    console.error('Error al obtener las características adicionales:', error);
    throw error;
  }
};

const actualizarVehiculoPorId = async (id, datosActualizados) => {
  try {
    const { vim, año, marca, modelo, placa } = datosActualizados;

    // Validaciones básicas
    if (!vim || !marca || !modelo || !año || !placa) {
      throw new Error("Todos los campos son requeridos");
    }

    // Validación del VIN (17 caracteres alfanuméricos excluyendo I, O, Q)
    const regexVin = /^[A-HJ-NPR-Z0-9]{17}$/; // Excluye I, O y Q
    if (!regexVin.test(vim)) {
      throw new Error("El VIN es inválido");
    }

    // Validación del formato de placa
    const regexPlaca = /^[A-Z]{3}-\d{4}$/; // Ejemplo: ABC-1234 o ABC-123A
    if (!regexPlaca.test(placa)) {
      throw new Error("La placa es inválida");
    }

    // Validación del año del vehículo
    if (typeof año !== "number" || año < 1900 || año > new Date().getFullYear()) {
      throw new Error("El año del vehículo es inválido");
    }

    // Validación de marca y modelo
    const validarMarcaYModelo = (texto) => {
      const regex = /^[A-Za-z0-9\s\-]+$/; // Permite letras, números, espacios y guiones
      return regex.test(texto);
    };

    if (!validarMarcaYModelo(marca)) {
      throw new Error("La marca es inválida");
    }

    if (!validarMarcaYModelo(modelo)) {
      throw new Error("El modelo es inválido");
    }

    // Verificar si el VIN ya existe en otro vehículo (excepto el vehículo actual)
    const vinExistente = await prisma.carro.findFirst({
      where: {
        vim: vim,
        NOT: { id: parseInt(id) }, // Excluir el vehículo actual
      },
    });

    if (vinExistente) {
      throw new Error("El VIN ya está registrado en otro vehículo");
    }

    // Verificar si la placa ya existe en otro vehículo (excepto el vehículo actual)
    const placaExistente = await prisma.carro.findFirst({
      where: {
        placa: placa,
        NOT: { id: parseInt(id) }, // Excluir el vehículo actual
      },
    });

    if (placaExistente) {
      throw new Error("La placa ya está registrada en otro vehículo");
    }

    // Actualizar el vehículo en la base de datos
    const carroActualizado = await prisma.carro.update({
      where: { id: parseInt(id) },
      data: {
        vim,
        año,
        marca,
        modelo,
        placa,
      },
    });

    return carroActualizado;

  } catch (error) {
    console.error('Error al actualizar el vehículo:', error);
    throw error;
  }
};

const actualizarCaracteristicasPorId = async (id, datosActualizados) => {
  try {
    const { tipoDeCombustible, asientos, puertas, transmicion, soat } = datosActualizados;

    // Validaciones básicas
    if (!Array.isArray(tipoDeCombustible) || tipoDeCombustible.length === 0) {
      throw new Error("Debe proporcionar al menos un tipo de combustible en un array");
    }

    if (typeof asientos !== "number" || asientos <= 0) {
      throw new Error("El número de asientos debe ser un número positivo");
    }

    if (typeof puertas !== "number" || puertas <= 0) {
      throw new Error("El número de puertas debe ser un número positivo");
    }

    if (typeof transmicion !== "string" || transmicion.trim() === "") {
      throw new Error("La transmisión es requerida y debe ser una cadena de texto");
    }

    if (typeof soat !== "boolean") {
      throw new Error("El campo SOAT debe ser un valor booleano (true o false)");
    }

    // Actualizar las características principales del vehículo
    const caracteristicasActualizadas = await prisma.carro.update({
      where: { id: parseInt(id) },
      data: {
        asientos,
        puertas,
        transmicion,
        soat,
      },
    });

    // Actualizar los tipos de combustible asociados al vehículo
    // Primero eliminamos los combustibles existentes
    await prisma.combustibleCarro.deleteMany({
      where: { id_carro: parseInt(id) },
    });

    // Luego agregamos los nuevos combustibles
    const nuevosCombustibles = tipoDeCombustible.map((idCombustible) => ({
      id_carro: parseInt(id),
      id_combustible: idCombustible, // Asegúrate de que `idCombustible` sea el ID del combustible
    }));

    await prisma.combustibleCarro.createMany({
      data: nuevosCombustibles,
    });

    return caracteristicasActualizadas;
  } catch (error) {
    console.error("Error al actualizar las características del vehículo:", error);
    throw error;
  }
};

module.exports = {
  obtenerPlacaPorId,
  obtenerVIMPorId,
  obtenerMarcaPorId,
  obtenerModeloPorId,
  obtenerAnioPorId,
  obtenerVehiculoCompletoPorId,
  obtenerCaracteristicasPorId,
  obtenerCaracteristicasAdicionalesPorId,
  actualizarVehiculoPorId,
  actualizarCaracteristicasPorId 
};