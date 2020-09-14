// This app.js is used to configure everything that has to do with the Express Application

const express = require("express")
const morgan = require("morgan")
const rateLimit = require("express-rate-limit")
const helmet = require("helmet")

const AppError = require("./utils/appError")
const globalErrorHandler = require("./controllers/errorController")

const tourRouter = require("./routes/tourRoutes")
const userRouter = require("./routes/userRoutes")

const app = express()

// GLOBAL MIDDLEWARE (function that can modify the incoming request data)

// Set security HTTP headers - best to have this at beginning of middlewares
app.use(helmet())

// Development Logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"))
}

// Limit requests from same API
const limiter = rateLimit({
  // Allows 100 requests from the same IP within 1 hour
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
})
app.use("/api", limiter)

// Body parser, reading data from the body into req.body
app.use(express.json())
app.use(express.static(`${__dirname}/public`))

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString()
  // console.log(req.headers)
  next()
})

// ROUTES
app.use("/api/v1/tours", tourRouter)
app.use("/api/v1/users", userRouter)

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404))
})

app.use(globalErrorHandler)

module.exports = app
