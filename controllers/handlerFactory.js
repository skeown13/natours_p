const catchAsync = require("../utils/catchAsync")
const AppError = require("../utils/appError")

// Create a function that returns a function - these will all be called in the other Controller files

exports.deleteOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id)

    if (!doc) {
      return next(new AppError("No document found with that ID", 404))
    }

    // status code 204 is "no content"
    res.status(204).json({
      status: "success",
      data: null,
    })
  })

exports.updateOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    if (!doc) {
      return next(new AppError("No document found with that ID", 404))
    }

    res.status(200).json({
      status: "success",
      data: {
        data: doc,
      },
    })
  })

exports.createOne = Model =>
  catchAsync(async (req, res, next) => {
    // doc is a Document that is part of the prototype of the Tour class which is why we have access to the .save() method
    const doc = await Model.create(req.body)

    res.status(201).json({
      status: "success",
      data: {
        data: doc,
      },
    })
  })

exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    // Instead of awaiting the query right away we are first saving the query to a variable so that we can manipulate the variable if necessary and then awaiting it
    let query = Model.findById(req.params.id)
    if (popOptions) query = query.populate(popOptions)
    const doc = await query

    if (!doc) {
      return next(new AppError("No document found with that ID", 404))
    }

    res.status(200).json({
      status: "success",
      data: {
        data: doc,
      },
    })
  })
