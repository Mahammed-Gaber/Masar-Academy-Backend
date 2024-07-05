const express = require('express');
const router = express.Router();

const authInstructorController = require('../controllers/authInstructorController');
const courseController = require('../controllers/courseController');


router.get('/all-courses', courseController.getAllCourses);
router.post('/instructor-courses/:id', courseController.getAllCoursesForInstructor);

router.get('top-rated-courses', courseController.getTopRatedCourses);
router.get('all-courses-by-category/:id', courseController.getAllCoursesByCategory);

router.use(authInstructorController.protect)

router.post('/' , courseController.createCourse);
router.patch('/update-course/:id' , courseController.updateCourse);
router.delete('/delete-course/:id' , courseController.removeCourse);

module.exports = router;