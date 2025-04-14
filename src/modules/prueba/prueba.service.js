const prisma = require('../../config/prisma');

const findAll = async () => {
    return prisma.rol.findMany();
};

module.exports = {findAll};