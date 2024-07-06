const express = require('express');
const router = express.Router();

const authStudentController = require('../controllers/authStudentController');
const reviewController = require('../controllers/reviewController');

// Swagger tags
/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: Routes related to course reviews
 */

/**
 * @swagger
 * definitions:
 *   Review:
 *     type: object
 *     required:
 *       - course
 *       - student
 *       - rating
 *       - comment
 *     properties:
 *       rating:
 *         type: number
 *         minimum: 1
 *         maximum: 5
 *         description: Rating for the course
 *       comment:
 *         type: string
 *         description: Comment about the course
 */

// Get all reviews
/**
 * @swagger
 * /review:
 *   get:
 *     summary: Get all reviews
 *     tags: [Reviews]
 *     responses:
 *       200:
 *         description: List of all reviews
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/Review'
 *       500:
 *         description: Server error
 */
router.get('/', reviewController.getAllReview);

// Get reviews for a specific course
/**
 * @swagger
 * /review/reviews-course/{id}:
 *   get:
 *     summary: Get reviews for a specific course
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the course
 *     responses:
 *       200:
 *         description: List of reviews for the specified course
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/Review'
 *       404:
 *         description: Course not found
 *       500:
 *         description: Server error
 */
router.get('/reviews-course/:id', reviewController.getReviewsForCourse);

// Apply auth middleware for the following routes
router.use(authStudentController.protect);

// Add a new review
/**
 * @swagger
 * /review/add-review/{id}:
 *   post:
 *     summary: Add a new review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the course
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/Review'
 *     responses:
 *       201:
 *         description: Review added successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.post('/add-review/:id', reviewController.createReview);

// Update an existing review
/**
 * @swagger
 * /review/update-review/{id}:
 *   post:
 *     summary: Update an existing review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the review
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/Review'
 *     responses:
 *       200:
 *         description: Review updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Review not found
 */
router.post('/update-review/:id', reviewController.updateReview);

module.exports = router;