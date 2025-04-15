const prisma = require('../../config/prisma');

const findAll = async () => {
    return prisma.provincia.findMany({
        orderBy : {nombre:'desc'}
    });
};


module.exports = {findAll};