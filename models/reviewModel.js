const mongoose = require("mongoose")
const Tour = require("./tourModel")

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, "A review must have a review!"],
    },
    rating: {
      type: Number,
      min: [1, "Rating must be above 1.0"],
      max: [5, "Rating must be below 5.0"],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: "Tour",
      required: [true, "Review must belong to a tour!"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Review must belong to a user!"],
    },
  },
  // virtuals: when we have a virtual property - a field that is not stored in the database, but calculated using some other value we want this to show up when there is an output
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

reviewSchema.index({ tour: 1, user: 1 }, { unique: true })

reviewSchema.pre(/^find/, function (next) {
  // this.populate({
  //   path: "tour",
  //   select: "name",
  // }).populate({
  //   path: "user",
  //   select: "name photo",
  // })

  this.populate({
    path: "user",
    select: "name photo",
  })
  next()
})

//Static Method can be called on Model Directly
reviewSchema.statics.calcAverageRatings = async function (tourId) {
  //aggregation pipeline (must be called on model)
  // In static method this keyword points to the model
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: "$tour",
        nRating: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
  ])
  // console.log(stats)

  // not storing the result value of the promise anywhere bc it is not needed elsewhere. We just want to update it.
  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    })
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    })
  }
}

// post does not have access to next
reviewSchema.post("save", function () {
  // this points to current review
  // can't use 'Review' because the model has not yet been created. Can't place this post after Review created becasue then it would not be a part of the model.
  this.constructor.calcAverageRatings(this.tour)
})

// We do NOT have document access to these two but only query middleware.
// findByIdAndUpdate
// findByIdAndDelete

// here cannot change .pre to .post as we did before because we would then no longer have access to the query because it would have already been executed
reviewSchema.pre(/^findOneAnd/, async function (next) {
  // retrieve current doc from database and store on current query variable which gives us access to it in the post middleware
  this.r = await this.findOne()
  // console.log(this.r)
  next()
})

reviewSchema.post(/^findOneAnd/, async function () {
  // await this.findOne(); does NOT work here, query has already executed
  await this.r.constructor.calcAverageRatings(this.r.tour)
})

const Review = mongoose.model("Review", reviewSchema)

module.exports = Review

// Nested route - make sense when there is a clear parent/child relationship
// POST /tour/3a53da523/reviews
// GET /tour/3a53da523/reviews
// GET /tour/3a53da523/reviews/243kkl2344j
