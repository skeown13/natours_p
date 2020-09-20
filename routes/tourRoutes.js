const express = require("express")
const tourController = require("../controllers/tourController")
const authController = require("../controllers/authController")
const reviewRouter = require("./reviewRoutes")

const router = express.Router()

// router.param("id", tourController.checkID)

// POST /tour/3a53da523/reviews
// GET /tour/3a53da523/reviews

// Mounting a Router - similar to app.js
router.use("/:tourId/reviews", reviewRouter)

router
  .route("/top-5-cheap")
  .get(tourController.getTopTours, tourController.getAllTours)

router.route("/tour-stats").get(tourController.getTourStats)

router.route("/monthly-plan/:year").get(tourController.getMonthlyPlan)

router
  .route("/")
  .get(authController.protect, tourController.getAllTours)
  .post(tourController.createTour)

router
  .route("/:id")
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(
    authController.protect,
    authController.restrictTo("admin", "lead-guide"),
    tourController.deleteTour
  )

module.exports = router
