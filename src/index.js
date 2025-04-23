const express = require('express');
const { PrismaClient } = require('@prisma/client');
const morgan = require("morgan");
const cors = require("cors");

const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use(morgan("dev"));
app.use(cors());


app.get('/', (req, res) => {
  res.send('server is running');
});


app.get('/usuario', async (req, res) => {
  try {
    const usuario = await prisma.usuario.findMany();
    console.log(usuario)
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch departamento' });
  }
});

app.get('/automovil', async (req,res)=>{
  try{
      const automovil = await prisma.automovil.findMany();
      res.json(automovil);
  }catch(error){
    console.log('Faile:', error)
  }
})

app.get('/notificacion' , async (req, res)=> {
  try{
    const notificacion = await prisma.notificacion.findMany();
    res.json(notificacion);
  }catch(error){
    console.log(error);
  }
})

app.get('/pago' , async (req, res) =>{
  try {
    const pago = await prisma.pago.findMany();
    res.json(pago)
  } catch (error) {
    console.log(error)
  }
})

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});