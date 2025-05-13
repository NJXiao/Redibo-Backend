const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { v4: uuidv4 } = require('uuid');

function generarCodigoOrdenPago() {
    return `ORD-${uuidv4().split('-')[0].toUpperCase()}-${Date.now()}`;
}

exports.createPaymentOrder = async (req, res) => {
  try {
    const { id_carro, id_usuario_host, id_usuario_renter, monto_a_pagar } = req.body;

    // Validar que se recibieron los datos necesarios
    if (!id_carro || !id_usuario_host || !id_usuario_renter || !monto_a_pagar) {
      return res.status(400).json({ error: 'Faltan datos necesarios' });
    }
    // si los numeros recibidos no son enteros convertirlos
    const idCarro = parseInt(id_carro);
    const idUsuarioHost = parseInt(id_usuario_host);
    const idUsuarioRenter = parseInt(id_usuario_renter);
    const montoAPagar = parseFloat(monto_a_pagar);
    if (isNaN(idCarro) || isNaN(idUsuarioHost) || isNaN(idUsuarioRenter) || isNaN(montoAPagar)) {
      return res.status(400).json({ error: 'Los datos deben ser números enteros' });
    }

    const codigo = generarCodigoOrdenPago();
    // Crear la orden de pago
    const ordenPago = await prisma.ordenPago.create({
      data: {
        codigo: codigo,
        id_usuario_host: idUsuarioHost,
        id_usuario_renter: idUsuarioRenter,
        id_carro: idCarro,
        monto_a_pagar: montoAPagar
      },
    });
    return res.status(201).json(ordenPago);
  } catch (error) {
    console.error('Error al crear la orden de pago:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.ReceiptPayment = async (req, res) => {
  try {
    const { id_orden_pago, numero_transaccion } = req.body;

    // Validar que se recibieron los datos necesarios
    if (!id_orden_pago || !numero_transaccion) {
      return res.status(400).json({ error: 'Faltan datos necesarios' });
    }
    // si los numeros recibidos no son enteros convertirlos
    const idOrdenPago = parseInt(id_orden_pago);
    if (isNaN(idOrdenPago)) {
      return res.status(400).json({ error: 'El id de la orden de pago debe ser un número entero' });
    }
    // verificar que el numero sea un string
    const numeroTransaccion = String(numero_transaccion);
    // Crear el comprobante de pago
    const comprobantePago = await prisma.ComprobanteDePago.create({
      data: {
        OrdenPago: {
          connect: {
            id: idOrdenPago
          }
        },
        numero_transaccion: numeroTransaccion
      },
    });
    return res.status(201).json(comprobantePago);
  } catch (error) {
    console.error('Error al crear el comprobante de pago:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}

exports.getListPaymentOrders = async (req, res) => {
  try {
    const id_usuario = req.user.id;
    // Validar que se recibieron los datos necesarios
    if (!id_usuario) {
      return res.status(400).json({ error: 'Faltan datos necesarios' });
    }
    // si los numeros recibidos no son enteros convertirlos
    const idUsuario = parseInt(id_usuario);
    if (isNaN(idUsuario)) {
      return res.status(400).json({ error: 'El id de la orden de pago debe ser un número entero' });
    }
    // Obtener la lista de órdenes de pago
    const ordenes = await prisma.ordenPago.findMany({
      where: { id_usuario_renter: idUsuario },
      include: {
        host:  { select: { nombre: true } },   // Usuario host
        carro: { select: { placa: true } },  // Carro
      }
    });


    const ordenesFormateadas = ordenes.map(({ 
        codigo, 
        monto_a_pagar, 
        estado, 
        host: { nombre }, 
        carro: { placa } 
      }) => ({
        codigo,
        monto_a_pagar,
        estado,
        nombre,
        placa
    }));
    return res.status(200).json(ordenesFormateadas);
  } catch (error) {
    console.error('Error al obtener la lista de órdenes de pago:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}


exports.getInfoPaymentOrderbyCode = async (req, res) => {
  try {
    const { codigo } = req.body;

    // Validar que se recibieron los datos necesarios
    if (!codigo) {
      return res.status(400).json({ error: 'Faltan datos necesarios' });
    }
    
    // Obtener la lista de órdenes de pago
    const orden = await prisma.ordenPago.findUnique({
      where: { codigo: codigo },
      include: {
        host:  { select: { nombre: true, telefono: true, correo: true } },   // Usuario host
        carro: { select: { placa: true, marca: true , modelo: true } },  // Carro
      }
    });

    // Destructuramos y formateamos
    const {
      codigo: codigoOrd,
      monto_a_pagar,
      estado,
      host:   { nombre, telefono, correo },
      carro:  { placa, marca, modelo }
    } = orden;

    return res.status(200).json({
      codigo:       codigoOrd,
      monto_a_pagar,
      estado,
      nombre,
      telefono,
      correo,
      placa,
      marca,
      modelo
    });
    return res.status(200).json(ordenesFormateadas);
  } catch (error) {
    console.error('Error al obtener la lista de órdenes de pago:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}

exports.getListProcessingOrders = async (req, res) => {
  try {
    const id_usuario = req.user.id;
    // Validar que se recibieron los datos necesarios
    if (!id_usuario) {
      return res.status(400).json({ error: 'Faltan datos necesarios' });
    }
    // si los numeros recibidos no son enteros convertirlos
    const idUsuario = parseInt(id_usuario);
    if (isNaN(idUsuario)) {
      return res.status(400).json({ error: 'El id de la orden de pago debe ser un número entero' });
    }
    
    // Obtener la lista de órdenes de pago
    const ordenes = await prisma.ordenPago.findMany({
      where: { estado: 'PROCESANDO' },
      include: {
        renter: { select: { nombre: true } },   
        host:   { select: { nombre: true } },
        ComprobanteDePago: {select: { numero_transaccion: true, fecha_emision: true } }
      }
    });

    const ordenesFormateadas = ordenes.map(({ 
      codigo, 
      monto_a_pagar, 
      estado, 
      renter: { nombre },
      host: { nombre: nombreHost },
      ComprobanteDePago: { numero_transaccion, fecha_emision }
    }) => ({
      codigo,
      monto_a_pagar,
      estado,
      renter: nombre,
      host: nombreHost,
      numero_transaccion,
      fecha_emision
    }));
    return res.status(200).json(ordenesFormateadas);
  } catch (error) {
    console.error('Error al obtener la lista de órdenes de pago:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}