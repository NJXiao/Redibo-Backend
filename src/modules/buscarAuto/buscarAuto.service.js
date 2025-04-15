const prisma = require('../../config/prisma');

const findAll = async() => {
    return prisma.carro.findMany();
}

module.exports ={ findAll };