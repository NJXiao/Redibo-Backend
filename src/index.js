import express, { json } from 'express';
import morgan from "morgan";
import cors from "cors";
import { carRouter } from './routes/cars.js';

const app = express();

app.use(cors())
app.use(json())
app.use(morgan("dev"))
app.disable("x-powered-by")

app.use('/api/cars', carRouter)

const PORT = process.env.PORT || 4000

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})