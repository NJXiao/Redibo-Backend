
const app = require('./core/server');
/*
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


app.get('/departamento', async (req, res) => {
  try {
    const departamento = await prisma.departamento.findMany();
    res.json(departamento);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch departamento' });
  }
});*/

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});