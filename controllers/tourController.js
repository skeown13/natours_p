const Tour = require("../models/tourModel")

// // // // // // // // // // // // // // // // //

// NO LONGER NEEDED NOW THAT WE HAVE OUR MONGODB SET UP. IT WAS JUST USED FOR TESTING PURPOSES!
// const tours = JSON.parse(
//   fs.readFileSync(
//     `${__dirname}/../dev-data/data/tours-simple.json`
//   )
// )

// This middleware checks if a valid id is present in the url path. It gets exported from here and called in tourRoutes.js in the param middleware. If a valid ID is NOT found it returns the code within the if statement. If a valid ID IS found it skips the if statement and calls next() to go onto the next middleware.
// exports.checkID = (req, res, next, val) => {
//   console.log(`Tour id is: ${val}`)

//   // * 1 against a string auto converts string to number
//   if (req.params.id * 1 > tours.length) {
//     return res.status(404).json({
//       status: "fail",
//       message: "Invalid ID",
//     })
//   }
//   next()
// }

// // // // // // // // // // // // // // // // //

exports.getAllTours = async (req, res) => {
  try {
    const tours = await Tour.find()

    res.status(200).json({
      status: "success",
      results: tours.length,
      data: {
        // can state just tours with es6 since the key is the same as the value.
        tours: tours,
      },
    })
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    })
  }
}

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id)
    // Tour.findOne({ _id: req.params.id })

    res.status(200).json({
      status: "success",
      data: {
        tour,
      },
    })
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    })
  }
}

exports.createTour = async (req, res) => {
  try {
    // const newTour = new Tour({})
    // newTour.save()

    const newTour = await Tour.create(req.body)

    res.status(201).json({
      status: "success",
      data: {
        tour: newTour,
      },
    })
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: "Invalid Data Sent!",
    })
  }
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
