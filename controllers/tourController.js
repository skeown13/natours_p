const Tour = require("../models/tourModel")
const APIFeatures = require("../utils/apiFeatures")
const catchAsync = require("../utils/catchAsync")
const AppError = require("../utils/appError")

exports.getTopTours = (req, res, next) => {
  // limit=5&sort=-ratingsAverage,price
  req.query.limit = "5"
  req.query.sort = "-ratingsAverage,price"
  req.query.fields = "name,price,ratingsAverage,summary,diffculty"
  next()
}

exports.getAllTours = catchAsync(async (req, res, next) => {
  // EXECUTE QUERY
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate()
  const tours = await features.query

  // SEND RESPONSE
  res.status(200).json({
    status: "success",
    results: tours.length,
    data: {
      // can state just tours with es6 since the key is the same as the value.
      tours: tours,
    },
  })
})

exports.getTour = catchAsync(async (req, res, next) => {
  // behind the scenes, populate creates a new query which may affect performance
  const tour = await Tour.findById(req.params.id).populate({
    path: "guides",
    select: "-__v -passwordChangedAt -passwordResetExpires -passwordResetToken",
  })
  // Tour.findOne({ _id: req.params.id })

  if (!tour) {
    return next(new AppError("No tour found with that ID", 404))
  }

  res.status(200).json({
    status: "success",
    data: {
      tour,
    },
  })
})

exports.createTour = catchAsync(async (req, res, next) => {
  // newTour is a Document that is part of the prototype of the Tour class which is why we have access to the .save() method

  const newTour = await Tour.create(req.body)

  res.status(201).json({
    status: "success",
    data: {
      tour: newTour,
    },
  })
})

exports.updateTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })

  if (!tour) {
    return next(new AppError("No tour found with that ID", 404))
  }

  res.status(200).json({
    status: "success",
    data: {
      tour,
    },
  })
})

exports.deleteTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndDelete(req.params.id)

  if (!tour) {
    return next(new AppError("No tour found with that ID", 404))
  }

  // status code 204 is "no content"
  res.status(204).json({
    status: "success",
    data: null,
  })
})

exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: "$difficulty" },
        // _id: "$ratingsAverage",
        numTours: { $sum: 1 },
        numRatings: { $sum: "$ratingsQuantity" },
        avgRating: { $avg: "$ratingsAverage" },
        avgPrice: { $avg: "$price" },
        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
    // {
    //   $match: { _id: { $ne: "EASY" } },
    // },
  ])

  res.status(200).json({
    status: "success",
    data: {
      stats,
    },
  })
})

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1

  const plan = await Tour.aggregate([
    {
      $unwind: "$startDates",
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: "$startDates" },
        numTourStarts: { $sum: 1 },
        tours: { $push: "$name" },
      },
    },
    {
      $addFields: { month: "$_id" },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: { numTourStarts: -1, month: 1 },
    },
    {
      $limit: 12,
    },
  ])

  res.status(200).json({
    status: "success",
    data: {
      plan,
    },
  })
})
