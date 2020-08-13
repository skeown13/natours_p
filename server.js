// Starting file where everything starts
const dotenv = require("dotenv")
// must run the config file before requiring the app file so that the app file has access to the config info
// only have to do this once and oce it is done all of the config info is added to the process.env which is inately accessible by the entire application
dotenv.config({ path: "./config.env" })

const app = require("./app")

const port = process.env.PORT || 8000
app.listen(port, () => {
  console.log(`App running on localhost:${port}`)
})
