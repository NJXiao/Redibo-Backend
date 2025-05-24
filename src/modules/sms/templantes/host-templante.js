
function createHostTemplate(data) {
  return `
    <h1 style="color: black;">Solicitud de Reserva</h1>
    <p style="color: black;"><strong>Fecha:</strong> ${data.fecha}</p>
    <p style="color: black;"><strong>Host:</strong> ${data.hostNombre}</p>
    <p style="color: black;">El renter <strong>${data.renterNombre}</strong> solicita la renta del auto <strong>${data.modelo} (${data.marca})</strong>.</p>
    <!-- Resto del template... -->
  `;
}

module.exports = { createHostTemplate };