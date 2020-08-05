// all express configurations in app.js
const fs = require("fs")

const express = require("express")
const { RSA_NO_PADDING } = require("constants")

const app = express()

// Middleware (function that can modify the incoming request data)
app.use(express.json())

// app.get("/", (req, res) => {
//   res
//     .status(200)
//     .json({ message: "Hello from the server side!", app: "Natours" })
// })

// app.post("/", (req, res) => {
//   res.send("You can post to this endpoint...")
// })

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
)

app.get("/api/v1/tours", (req, res) => {
  res.status(200).json({
    status: "success",
    results: tours.length,
    data: {
      // can state just tours with es6 since the key is the same as the value.
      tours: tours,
    },
  })
})

app.get("/api/v1/tours/:id", (req, res) => {
  console.log(req.params)

  // * 1 against a string auto converts string to number
  const id = req.params.id * 1
  const tour = tours.find((el) => el.id === id)

  // if (id > tours.length) {
  if (!tour) {
    return res.status(404).json({
      status: "fail",
      message: "Invalid ID",
    })
  }

  res.status(200).json({
    status: "success",
    data: {
      tour,
    },
  })
})

app.post("/api/v1/tours", (req, res) => {
  // console.log(req.body)

  const newId = tours[tours.length - 1].id + 1
  const newTour = Object.assign({ id: newId }, req.body)

  tours.push(newTour)
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: "success",
        data: {
          tour: newTour,
        },
      })
    }
  )
})

const PORT = 3000
app.listen(PORT, () => {
  console.log(`App running on localhost:${PORT}`)
})
