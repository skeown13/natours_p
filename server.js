// Starting file where everything starts
const mongoose = require("mongoose")
const dotenv = require("dotenv")
// must run the config file before requiring the app file so that the app file has access to the config info
// only have to do this once and oce it is done all of the config info is added to the process.env which is inately accessible by the entire application
dotenv.config({ path: "./config.env" })

const app = require("./app")

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
)

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB connection successfull!"))

const port = process.env.PORT || 8000
const server = app.listen(port, () => {
  console.log(`App running on localhost:${port}`)
})

// Handle Unhandled Rejection
process.on("unhandledRejection", err => {
  console.log(err.name, err.message)
  console.log("UNHANDLED REJECTION! Shutting down...")
  server.close(() => {
    process.exit(1)
  })
})
