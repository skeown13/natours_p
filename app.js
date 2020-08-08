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
const getAllTours = (req, res) => {
  console.log(req.requestTime)
  res.status(200).json({
    status: "success",
    requestedAt: req.requestTime,
    results: tours.length,
    data: {
      // can state just tours with es6 since the key is the same as the value.
      tours: tours,
    },
  })
}

const getTour = (req, res) => {
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
}

const createTour = (req, res) => {
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
}

const updateTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: "fail",
      message: "Invalid ID",
    })
  }

  res.status(200).json({
    status: "success",
    data: {
      tour: "<Updated (placeholder) tour here...>",
    },
  })
}

const deleteTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: "fail",
      message: "Invalid ID",
    })
  }

  // status code 204 is "no content"
  res.status(204).json({
    status: "success",
    data: null,
  })
}

const getAllUsers = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined!",
  })
  // console.log(req.requestTime)
  // res.status(200).json({
  //   status: "success",
  //   requestedAt: req.requestTime,
  //   results: users.length,
  //   data: {
  //     users,
  //   },
  // })
}

const getUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined!",
  })
  // console.log(req.params)

  // // * 1 against a string auto converts string to number
  // const id = req.params.id * 1
  // const user = users.find((el) => el.id === id)

  // if (!user) {
  //   return res.status(404).json({
  //     status: "fail",
  //     message: "Invalid ID",
  //   })
  // }

  // res.status(200).json({
  //   status: "success",
  //   data: {
  //     user,
  //   },
  // })
}

const createUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined!",
  })
  // const newId = users[users.length - 1].id + 1
  // const newUser = Object.assign({ id: newId }, req.body)

  // users.push(newUser)
  // fs.writeFile(
  //   `${__dirname}/dev-data/data/users.json`,
  //   JSON.stringify(users),
  //   (err) => {
  //     res.status(201).json({
  //       status: "success",
  //       data: {
  //         user: newUser,
  //       },
  //     })
  //   }
  // )
}

const updateUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined!",
  })
  // if (req.params.id * 1 > users.length) {
  //   return res.status(404).json({
  //     status: "fail",
  //     message: "Invalid ID",
  //   })
  // }

  // res.status(200).json({
  //   status: "success",
  //   data: {
  //     user: "<Updated (placeholder) user here...>",
  //   },
  // })
}

const deleteUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined!",
  })
  // if (req.params.id * 1 > users.length) {
  //   return res.status(404).json({
  //     status: "fail",
  //     message: "Invalid ID",
  //   })
  // }

  // // status code 204 is "no content"
  // res.status(204).json({
  //   status: "success",
  //   data: null,
  // })
}

// ROUTES
app.use("/api/v1/tours", tourRouter)
const tourRouter = express.Router()

tourRouter.route("/").get(getAllTours).post(createTour)

tourRouter
  .route("/:id")
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour)

app.route("/api/v1/users").get(getAllUsers).post(createUser)

app
  .route("/api/v1/users/:id")
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser)

// START SERVER
const PORT = 3000
app.listen(PORT, () => {
  console.log(`App running on localhost:${PORT}`)
})
