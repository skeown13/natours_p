// get all reviews and create new review

const express = require("express")
const reviewController = require("../controllers/reviewController")
const authController = require("../controllers/authController")

// Option of mergeParams: true allows for params such as the :tourId param in tourRoutes.js to be merged (accessed) here in the reviewRoutes.js
const router = express.Router({ mergeParams: true })

router
  .route("/")
  .get(reviewController.getAllReviews)
  .post(
    authController.protect,
    authController.restrictTo("user"),
    reviewController.setTourUserIds,
    reviewController.createReview
  )

router
  .route("/:id")
  .patch(reviewController.updateReview)
  .delete(reviewController.deleteReview)

module.exports = router
