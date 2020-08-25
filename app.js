// This app.js is used to configure everything that has to do with the Express Application

const express = require("express")
const morgan = require("morgan")

const AppError = require("./utils/appError")

const tourRouter = require("./routes/tourRoutes")
const userRouter = require("./routes/userRoutes")

const app = express()

// MIDDLEWARE (function that can modify the incoming request data)
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"))
}

app.use(express.json())

app.use(express.static(`${__dirname}/public`))

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString()
  next()
})

// ROUTES
app.use("/api/v1/tours", tourRouter)
app.use("/api/v1/users", userRouter)

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404))
})

app.use((err, req, res, next) => {
  console.log(err.stack)

  err.statusCode = err.statusCode || 500
  err.status = err.status || "error"

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  })
  next()
})

module.exports = app
