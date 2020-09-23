const catchAsync = require("../utils/catchAsync")
const AppError = require("../utils/appError")

// Create a function that returns a function

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