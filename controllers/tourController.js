const Tour = require("../models/tourModel")
const catchAsync = require("../utils/catchAsync")
const factory = require("./handlerFactory")
const AppError = require("../utils/appError")

exports.getTopTours = (req, res, next) => {
  // limit=5&sort=-ratingsAverage,price
  req.query.limit = "5"
  req.query.sort = "-ratingsAverage,price"
  req.query.fields = "name,price,ratingsAverage,summary,diffculty"
  next()
}

exports.getAllTours = factory.getAll(Tour)
exports.getTour = factory.getOne(Tour, { path: "reviews" })
exports.createTour = factory.createOne(Tour)
exports.updateTour = factory.updateOne(Tour)
exports.deleteTour = factory.deleteOne(Tour)

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

// /tours-within/:distance/center/:latlng/unit/:unit
// /tours-within/233/center/34.111745,-118.113491/unit/mi
exports.getToursWithin = (req, res, next) => {
  const { distance, latlng, unit } = req.params
  const [lat, lng] = latlng.split(",")

  if (!lat || !lng) {
    next(
      new AppError(
        "Please provide latitutde and longitude in the format lat,lng.",
        400
      )
    )
  }

  console.log(distance, lat, lng, unit)

  res.status(200).json({
    status: "success",
  })
}
