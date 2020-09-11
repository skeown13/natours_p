// const fs = require("fs")

const User = require("../models/userModel")
const catchAsync = require("../utils/catchAsync")

// const users = JSON.parse(
//   fs.readFileSync(
//     `${__dirname}/../dev-data/data/users.json`
//   )
// )

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find()

  // SEND RESPONSE
  res.status(200).json({
    status: "success",
    results: users.length,
    data: {
      // can state just users with es6 since the key is the same as the value.
      users,
    },
  })
})

exports.updateMe = (req, res, next) => {
  // 1) Create an error if the user POSTs password data
  // 2) Update user document
}

exports.getUser = (req, res) => {
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

exports.createUser = (req, res) => {
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

exports.updateUser = (req, res) => {
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

exports.deleteUser = (req, res) => {
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
