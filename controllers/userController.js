const User = require("../models/userModel")
const catchAsync = require("../utils/catchAsync")
const AppError = require("../utils/appError")

const filterObj = (obj, ...allowedFields) => {
  const newObj = {}
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el]
  })
  return newObj
}

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

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create an error if the user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "This route is not for password updates. Please use /updatePassword",
        400
      )
    )
  }

  // 2) Filtered out unwanted field names that are not allowed to be updated
  const filteredBody = filterObj(req.body, "name", "email")

  // 3) Update user document
  // Can use findByIdAndUpdate because we are NOT dealing with passwords. Only non-sensitive data (name/email)
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  })

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  })
})

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false })

  res.status(204).json({
    status: "success",
    data: null,
  })
})

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
