// all express configurations in app.js
const fs = require("fs")

const express = require("express")
const morgan = require("morgan")

const app = express()

// MIDDLEWARE (function that can modify the incoming request data)
app.use(morgan("dev"))

app.use(express.json())

app.use((req, res, next) => {
  console.log("Hello from the Middleware!!!")
  next()
})

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString()
  next()
})

const tours = JSON.parse(
  fs.readFileSync(
    `${__dirname}/dev-data/data/tours-simple.json`
  )
)
const users = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/users.json`)
)

// ROUTE HANDLERS

// ROUTES

// called mounting the router --must be called after we declare them
app.use("/api/v1/tours", tourRouter)
app.use("/api/v1/users", userRouter)

// START SERVER
const PORT = 3000
app.listen(PORT, () => {
  console.log(`App running on localhost:${PORT}`)
})
