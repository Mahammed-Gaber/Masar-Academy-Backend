const express = require("express");
const router = express.Router();
const authAdminController = require("../controllers/authAdminController");

/**
 * @swagger
 * tags:
 *   name: Admins
 *   description: Routes related to admin authentication and management
 */

/**
 * @swagger
 * definitions:
 *   AdminSignup:
 *     type: object
 *     required:
 *       - name
 *       - email
 *       - password
 *       - passwordConfirm
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
 */

/**
 * @swagger
 * /admin/signup:
 *   post:
 *     summary: Sign up a new admin
 *     tags: [Admins]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/AdminSignup'
 *     responses:
 *       201:
 *         description: Admin signed up successfully
 *       400:
 *         description: Bad request
 */
router.post('/signup', authAdminController.signup);

/**
 * @swagger
 * /admin/login:
 *   post:
 *     summary: Log in an admin
 *     tags: [Admins]
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
 *         description: Admin logged in successfully
 *       401:
 *         description: Unauthorized
 */
router.post('/login', authAdminController.login);

/**
 * @swagger
 * /admin/forget-password:
 *   post:
 *     summary: Request a password reset for an admin
 *     tags: [Admins]
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
router.post('/forget-password', authAdminController.forgotPassword);

/**
 * @swagger
 * /admin/reset-password/{token}:
 *   patch:
 *     summary: Reset the password using a token for an admin
 *     tags: [Admins]
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

router.patch('/reset-password/:token', authAdminController.resetPassword);

/**
 * @swagger
 * /admin/update-password:
 *   patch:
 *     summary: Update the password for the logged-in admin
 *     tags: [Admins]
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

router.patch('/update-password', authAdminController.protect, authAdminController.updatePassword);

module.exports = router;