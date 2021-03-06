const express = require("express")
const userController = require("../controllers/userController")
const authController = require("../controllers/authController")

const router = express.Router()

router.post("/signup", authController.signup)
router.post("/login", authController.login)
router.post("/forgotPassword", authController.forgotPassword)
router.patch("/resetPassword/:token", authController.resetPassword)

// Protect all routes after this middleware
router.use(authController.protect)

router.patch("/updatePassword", authController.updatePassword)
router.get("/me", userController.getMe, userController.getUser)
router.patch("/updateMe", authController.protect, userController.updateMe)
// We are not actually deleting the user from the database, but since the user will no longer be accessible from anywhere it is still okay to use the http method of delete
router.delete("/deleteMe", authController.protect, userController.deleteMe)

// Only admins can access the routes below this
router.use(authController.restrictTo("admin"))

router
  .route("/")
  .get(userController.getAllUsers)
  .post(userController.createUser)

router
  .route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser)

module.exports = router
