const express = require('express');
const router = express.Router();
const authStudentController = require('../controllers/authStudentController');

// Swagger documentation
/**
 * @swagger
 * tags:
 *   name: Students
 *   description: Routes related to student authentication
 */

/**
 * @swagger
 * definitions:
 *   Student:
 *     type: object
 *     required:
 *       - name
 *       - email
 *       - password
 *       - passwordConfirm
 *       - age
 *       - country
 *       - gender
 *       - phoneNumber
 *     properties:
 *       name:
 *         type: string
 *       email:
 *         type: string
 *       password:
 *         type: string
 *       passwordConfirm:
 *         type: string
 *       profilePicture:
 *         type: string
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
 *       address:
 *         type: object
 *         properties:
 *           street:
 *             type: string
 *           city:
 *             type: string
 *           state:
 *             type: string
 *           zip:
 *             type: string
 */

/**
 * @swagger
 * /student/signup:
 *   post:
 *     summary: Sign up a new student
 *     tags: [Students]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/Student'
 *     responses:
 *       201:
 *         description: Student signed up successfully
 *       400:
 *         description: Bad request
 */
router.post('/signup', authStudentController.signup);

/**
 * @swagger
 * /student/login:
 *   post:
 *     summary: Log in a student
 *     tags: [Students]
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
 *         description: Student logged in successfully
 *       401:
 *         description: Unauthorized
 */
router.post('/login', authStudentController.login);

/**
 * @swagger
 * /student/forget-password:
 *   post:
 *     summary: Request a password reset
 *     tags: [Students]
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
router.post('/forget-password', authStudentController.forgotPassword);

/**
 * @swagger
 * /student/reset-password/{token}:
 *   patch:
 *     summary: Reset the password using a token
 *     tags: [Students]
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
router.patch('/reset-password/:token', authStudentController.resetPassword);

/**
 * @swagger
 * /student/update-password:
 *   patch:
 *     summary: Update the password for the logged-in student
 *     tags: [Students]
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
router.patch('/update-password', authStudentController.protect, authStudentController.updatePassword);

module.exports = router;