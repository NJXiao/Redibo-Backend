
function createRenterTemplate(data) {
  return `
    <h1 style="color: black;">¡Solicitud enviada con éxito!</h1>
    <p style="color: black;">Hola <strong>${data.renterNombre}</strong>,</p>
    <p style="color: black;">
      Tu solicitud para el auto <strong>${data.modelo} (${data.marca})</strong> fue enviada correctamente.
    </p>
    <!-- Resto del template... -->
  `;
}

module.exports = { createRenterTemplate };