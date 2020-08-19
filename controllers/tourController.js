const Tour = require("../models/tourModel")

// NO LONGER NEEDED NOW THAT WE HAVE OUR MONGODB SET UP. IT WAS JUST USED FOR TESTING PURPOSES!
// const tours = JSON.parse(
//   fs.readFileSync(
//     `${__dirname}/../dev-data/data/tours-simple.json`
//   )
// )

// This middleware checks if a valid id is present in the url path. It gets exported from here and called in tourRoutes.js in the param middleware. If a valid ID is NOT found it returns the code within the if statement. If a valid ID IS found it skips the if statement and calls next() to go onto the next middleware.

exports.checkBody = (req, res, next) => {
  console.log("We are checking the body!")
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: "fail",
      message: "New Tour must include Name and Price",
    })
  }
  next()
}

exports.getAllTours = (req, res) => {
  console.log(req.requestTime)
  res.status(200).json({
    status: "success",
    requestedAt: req.requestTime,
    // results: tours.length,
    // data: {
    //   // can state just tours with es6 since the key is the same as the value.
    //   tours: tours,
    // },
  })
}

exports.getTour = (req, res) => {
  console.log(req.params)

  // const id = req.params.id * 1
  // const tour = tours.find((el) => el.id === id)

  // res.status(200).json({
  //   status: "success",
  //   data: {
  //     tour,
  //   },
  // })
}

exports.createTour = (req, res) => {
  // res.status(201).json({
  //   status: "success",
  //   data: {
  //     tour: newTour,
  //   },
  // })
}

exports.updateTour = (req, res) => {
  res.status(200).json({
    status: "success",
    data: {
      tour: "<Updated (placeholder) tour here...>",
    },
  })
}

exports.deleteTour = (req, res) => {
  // status code 204 is "no content"
  res.status(204).json({
    status: "success",
    data: null,
  })
}
