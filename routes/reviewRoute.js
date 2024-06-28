const express = require('express');
const router = express.Router();

const authStudentController = require('../controllers/authStudentController');
const reviewController = require('../controllers/reviewController');

router.get('/', reviewController.getAllReview);
router.get('/reviews-course', reviewController.getReviewsForCourse);

router.use(authStudentController.protect);
router.post('/add-review', reviewController.createReview);
router.post('/update-review/:id', reviewController.updateReview);

module.exports = router;