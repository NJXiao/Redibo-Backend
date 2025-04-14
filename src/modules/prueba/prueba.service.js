const prisma = require('../../config/prisma');

const findAll = async () => {
    return prisma.Garantia.findMany();
};

module.exports = {findAll};