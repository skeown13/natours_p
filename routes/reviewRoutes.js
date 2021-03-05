// get all reviews and create new review

const express = require("express")
const reviewController = require("../controllers/reviewController")
const authController = require("../controllers/authController")

// Option of mergeParams: true allows for params such as the :tourId param in tourRoutes.js to be merged (accessed) here in the reviewRoutes.js
const router = express.Router({ mergeParams: true })

router.use(authController.protect)

router
  .route("/")
  .get(reviewController.getAllReviews)
  .post(
    authController.restrictTo("user"),
    reviewController.setTourUserIds,
    reviewController.createReview
  )

// admin can edit/delete reviews
// guides cannot add/edit/delete reviews

router
  .route("/:id")
  .get(reviewController.getReview)
  .patch(
    authController.restrictTo("user", "admin"),
    reviewController.updateReview
  )
  .delete(
    authController.restrictTo("user", "admin"),
    reviewController.deleteReview
  )

module.exports = router
