const prisma = require('../../config/prisma');

const findAll = async () => {
    return prisma.test.findMany();
};

module.exports = {findAll};