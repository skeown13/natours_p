const mongoose = require("mongoose")

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
  console.log(tourId)
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
  console.log(stats)
}

// post does not have access to next
reviewSchema.post("save", function () {
  // this points to current review

  this.constructor.calcAverageRatings(this.tour)
})

const Review = mongoose.model("Review", reviewSchema)

module.exports = Review

// Nested route - make sense when there is a clear parent/child relationship
// POST /tour/3a53da523/reviews
// GET /tour/3a53da523/reviews
// GET /tour/3a53da523/reviews/243kkl2344j
