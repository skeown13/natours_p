const fs = require("fs")

const users = JSON.parse(
  fs.readFileSync(
    `${__dirname}/../dev-data/data/users.json`
  )
)

exports.getAllUsers = (req, res) => {
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
