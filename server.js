// Starting file where everything starts
const app = require("./app")

const PORT = 3000
app.listen(PORT, () => {
  console.log(`App running on localhost:${PORT}`)
})
