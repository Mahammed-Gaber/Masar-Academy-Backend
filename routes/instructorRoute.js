const express = require('express');
const router = express.Router();
const authInstructorController = require('../controllers/authInstructorController')


router.post('/signup', authInstructorController.signup);
router.post('/login', authInstructorController.login);


module.exports = router;