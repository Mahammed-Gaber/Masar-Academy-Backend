const express = require('express');
const router = express.Router();

const authInstructorController = require('../controllers/authInstructorController');
const courseController = require('../controllers/courseController');

/**
 * @swagger
 * tags:
 *   name: Courses
 *   description: Routes related to course management
 */

/**
 * @swagger
 * definitions:
 *   Course:
 *     type: object
 *     properties:
 *       title:
 *         type: string
 *       description:
 *         type: string
 *       instructor:
 *         type: string
 *       category:
 *         type: string
 *       price:
 *         type: number
 */

/**
 * @swagger
 * /course/all-courses:
 *   get:
 *     summary: Get all courses
 *     tags: [Courses]
 *     responses:
 *       200:
 *         description: List of all courses
 *       500:
 *         description: Server error
 */
router.get('/all-courses', courseController.getAllCourses);

/**
 * @swagger
 * /course/instructor-courses/{id}:
 *   post:
 *     summary: Get all courses for a specific instructor
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The instructor ID
 *     responses:
 *       200:
 *         description: List of courses for the instructor
 *       404:
 *         description: Instructor not found
 *       500:
 *         description: Server error
 */
router.post('/instructor-courses/:id', courseController.getAllCoursesForInstructor);

/**
 * @swagger
 * /course/top-rated-courses:
 *   get:
 *     summary: Get top-rated courses
 *     tags: [Courses]
 *     responses:
 *       200:
 *         description: List of top-rated courses
 *       500:
 *         description: Server error
 */
router.get('/top-rated-courses', courseController.getTopRatedCourses);

/**
 * @swagger
 * /course/all-courses-by-category/{id}:
 *   get:
 *     summary: Get all courses by category
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The category ID
 *     responses:
 *       200:
 *         description: List of courses in the specified category
 *       404:
 *         description: Category not found
 *       500:
 *         description: Server error
 */
router.get('/all-courses-by-category/:id', courseController.getAllCoursesByCategory);

// Apply auth middleware for the following routes
router.use(authInstructorController.protect);

/**
 * @swagger
 * /course/:
 *   post:
 *     summary: Create a new course
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/Course'
 *     responses:
 *       201:
 *         description: Course created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/', courseController.createCourse);

/**
 * @swagger
 * /course/update-course/{id}:
 *   patch:
 *     summary: Update a course by ID
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The course ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/Course'
 *     responses:
 *       200:
 *         description: Course updated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Course not found
 *       500:
 *         description: Server error
 */
router.patch('/update-course/:id', courseController.updateCourse);

/**
 * @swagger
 * /course/delete-course/{id}:
 *   delete:
 *     summary: Delete a course by ID
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The course ID
 *     responses:
 *       200:
 *         description: Course deleted successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Course not found
 *       500:
 *         description: Server error
 */
router.delete('/delete-course/:id', courseController.removeCourse);

module.exports = router;