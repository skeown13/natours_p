// Starting file where everything starts
const dotenv = require("dotenv")
// must run the config file before requiring the app file so that the app file has access to the config info
dotenv.config({ path: "./config.env" })

const app = require("./app")

const port = process.env.PORT || 8000
app.listen(port, () => {
  console.log(`App running on localhost:${port}`)
})
