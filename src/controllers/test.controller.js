const prisma = require('../config/prisma');

const getTests = async (req, res) => {
    try{
        const tests = await prisma.test.findMany();
        res.json(tests);
    }catch(error){
        res.status(500).json({error:'Error al obtener los datos de test'});
    }
};

module.exports = {getTests};