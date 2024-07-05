const express = require('express');
const router = express.Router();
const authInstructorController = require('../controllers/authInstructorController')


router.post('/signup', authInstructorController.signup);
router.post('/login', authInstructorController.login);

router.post('/forget-password', authInstructorController.forgotPassword);
router.patch('/reset-password/:token', authInstructorController.resetPassword);

router.patch('/update-password', authInstructorController.protect, authInstructorController.resetPassword);

module.exports = router;