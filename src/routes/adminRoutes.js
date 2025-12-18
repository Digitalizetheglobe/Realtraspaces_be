const express = require("express");
const adminController = require("../controllers/adminController");
const authController = require("../controllers/adminController");

const router = express.Router();

// Public routes
router.post("/register", adminController.register);
router.post("/login", adminController.login);
router.post("/forgot-password/request-otp", adminController.requestPasswordResetOtp);
router.post("/verify-otp", adminController.verifyPasswordResetOtp);

// Password reset for admin via OTP (no auth required)
// Keep the old path for backward compatibility and add a simpler alias
router.post("/forgot-password/reset", adminController.resetPasswordWithOtp);
router.post("/reset-password", adminController.resetPasswordWithOtp);

// Protected routes (require authentication)
router.use(authController.protect);

// Routes accessible by all authenticated admins
router.get("/me", (req, res) => {
  res.status(200).json({
    status: "success",
    data: {
      admin: req.admin,
    },
  });
});

// Routes restricted to superadmin
router.use(authController.restrictTo("superadmin"));

router.route("/").get(adminController.getAllAdmins);

router
  .route("/:id")
  .get(adminController.getAdmin)
  .patch(adminController.updateAdmin)
  .delete(adminController.deleteAdmin);

module.exports = router;
