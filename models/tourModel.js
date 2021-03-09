const mongoose = require("mongoose")
const slugify = require("slugify")
// const User = require("./userModel")
// const validator = require("validator")

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A tour must have a name!"],
      unique: true,
      trim: true,
      maxlength: [40, "A tour name must have less or equal than 40 characters"],
      minlength: [10, "A tour name must have more or equal than 10 characters"],
      // validate: [
      //   validator.isAlpha,
      //   "Tour name must only contain alphabetical characters",
      // ], // We are not calling it here. Just specifying a function that is to be used.
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, "A tour must have a duration!"],
    },
    maxGroupSize: {
      type: Number,
      required: [true, "A tour must have a group size!"],
    },
    difficulty: {
      type: String,
      required: [true, "A tour must have a difficulty!"],
      enum: {
        values: ["easy", "medium", "difficult"],
        message: "Difficulty is either: easy, medium, or difficult",
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "Rating must be above 1.0"],
      max: [5, "Rating must be below 5.0"],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "A tour must have a price!"],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          // this will only point to the curretn doc on creating NEW documents. it will not work on updating documents
          return val < this.price
        },
        message: "Discount price ({VALUE}) should be below regular price!",
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, "A tour must have a summary!"],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, "A tour must have a cover image!"],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
    // An Embedded Object (Sort of.... not in an array...)
    startLocation: {
      // GeoJSON to specify geospatial json
      type: {
        type: String,
        default: "Point",
        enum: ["Point"],
      },
      // longitude first and latitude second
      coordinates: [Number],
      address: String,
      description: String,
    },
    // in order to create an Embeded Document it MUST be within an array
    locations: [
      {
        type: {
          type: String,
          default: "Point",
          enum: ["Point"],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        // establishing references between different datasets in mongoose. DO NOT need User to be imported in this document.
        ref: "User",
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

tourSchema.index({ price: 1, ratingsAverage: -1 })
tourSchema.index({ slug: 1 })

// cannot use virtual property in a query because it is not actually part of the database
tourSchema.virtual("durationWeeks").get(function () {
  return this.duration / 7
})

// VIRTUAL POPULATE
tourSchema.virtual("reviews", {
  ref: "Review",
  // where the id is actually stored here in this current tourModel
  localField: "_id",
  // name of field in other model (Review) where the reference to the current model is stored
  foreignField: "tour",
})

// Mongoose has 4 types of Middleware: Document, Query, Aggregate, and Model Middleware
// DOCUMENT MIDDLEWARE: runs before .save() and .create() **not on .insertMany()**
tourSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true })
  next()
})

//   // Embedding "guide" users into the tourModel -- when doing this in the Schema, use "guides: Array" -- need User to be imported into the document
// tourSchema.pre("save", async function (next) {
//   const guidesPromises = this.guides.map(async id => await User.findById(id))
//   // must use Promise.all because guidesPromises is an array of promises that we then run by awaiting Promise.all()
//   this.guides = await Promise.all(guidesPromises)
//   next()
// })

// tourSchema.pre("save", function (next) {
//   console.log("Will save document...")
//   next()
// })

// tourSchema.post("save", function (doc, next) {
//   console.log(doc)
//   next()
// })

// QUERY MIDDLEWARE
// this keyword will point at the current query
// tourSchema.pre("find", function (next) {
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } })
  this.start = Date.now()
  next()
})

tourSchema.pre(/^find/, function (next) {
  // behind the scenes, populate creates a new query which may affect performance (not a big deal for small applications but may notice with larger applications)
  this.populate({
    path: "guides",
    select: "-__v -passwordChangedAt -passwordResetExpires -passwordResetToken",
  })

  next()
})

tourSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds`)
  // console.log(docs)
  next()
})

// AGGREGATION MIDDLEWARE
tourSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } })
  console.log(this.pipeline())
  next()
})

const Tour = mongoose.model("Tour", tourSchema)

module.exports = Tour
