const express = require('express');
const router = express.Router();
const authStudentController = require('../controllers/authStudentController')


router.post('/signup', authStudentController.signup);
router.post('/login', authStudentController.login);


module.exports = router;