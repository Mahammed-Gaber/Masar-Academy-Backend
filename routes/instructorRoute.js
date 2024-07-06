const express = require('express');
const router = express.Router();
const authInstructorController = require('../controllers/authInstructorController')

/**
 * @swagger
 * tags:
 *   name: Instructors
 *   description: Routes related to instructor authentication
 */

/**
 * @swagger
 * definitions:
 *   Instructor:
 *     type: object
 *     properties:
 *       name:
 *         type: string
 *       email:
 *         type: string
 *       password:
 *         type: string
 *       passwordConfirm:
 *         type: string
 *       specialties:
 *         type: array
 *         items:
 *           type: string
 *       age:
 *         type: integer
 *       country:
 *         type: string
 *       gender:
 *         type: string
 *         enum:
 *           - male
 *           - female
 *       phoneNumber:
 *         type: string
 */

/**
 * @swagger
 * /instructor/signup:
 *   post:
 *     summary: Sign up a new instructor
 *     tags: [Instructors]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/Instructor'
 *     responses:
 *       201:
 *         description: Instructor signed up successfully
 *       400:
 *         description: Bad request
 */

router.post('/signup', authInstructorController.signup);

/**
 * @swagger
 * /instructor/login:
 *   post:
 *     summary: Log in an instructor
 *     tags: [Instructors]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Instructor logged in successfully
 *       401:
 *         description: Unauthorized
 */
router.post('/login', authInstructorController.login);

/**
 * @swagger
 * /instructor/forget-password:
 *   post:
 *     summary: Request a password reset
 *     tags: [Instructors]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset email sent
 *       400:
 *         description: Bad request
 */
router.post('/forget-password', authInstructorController.forgotPassword);

/**
 * @swagger
 * /instructor/reset-password/{token}:
 *   patch:
 *     summary: Reset the password using a token
 *     tags: [Instructors]
 *     parameters:
 *       - in: path
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *         description: The password reset token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *               passwordConfirm:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Token is invalid or has expired
 */
router.patch('/reset-password/:token', authInstructorController.resetPassword);

/**
 * @swagger
 * /instructor/update-password:
 *   patch:
 *     summary: Update the password for the logged-in instructor
 *     tags: [Instructors]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *               newPasswordConfirm:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password updated successfully
 *       401:
 *         description: Unauthorized
 */
router.patch('/update-password', authInstructorController.protect, authInstructorController.resetPassword);

module.exports = router;