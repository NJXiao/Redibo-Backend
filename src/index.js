

const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const { carRouter } = require("./routes/cars");
const { reservationRouter } = require("./routes/reservation");
const { searchRouter } = require("./routes/search");

const app = express()

app.use(cors())
app.use(express.json())
app.use(morgan("dev"))
app.disable("x-powered-by")

app.use('/api/cars', carRouter)
app.use('/api/reservations', reservationRouter)
app.use('/api/search', searchRouter)


const PORT = process.env.PORT || 4000

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})