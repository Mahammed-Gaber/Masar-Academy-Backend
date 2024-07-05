const express = require("express");
const router = express.Router();
const authAdminController = require("../controllers/authAdminController");

router.post('/signup', authAdminController.signup);
router.post('/login', authAdminController.login);

router.post('/forget-password', authAdminController.forgotPassword);
router.patch('/reset-password/:token', authAdminController.resetPassword);

router.patch('/update-password', authAdminController.protect, authAdminController.resetPassword);

module.exports = router;
