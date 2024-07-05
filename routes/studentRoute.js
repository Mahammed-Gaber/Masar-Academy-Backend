const express = require('express');
const router = express.Router();
const authStudentController = require('../controllers/authStudentController')


router.post('/signup', authStudentController.signup);
router.post('/login', authStudentController.login);

router.post('/forget-password', authStudentController.forgotPassword);
router.patch('/reset-password/:token', authStudentController.resetPassword);

router.patch('/update-password', authStudentController.protect, authStudentController.resetPassword);

module.exports = router;