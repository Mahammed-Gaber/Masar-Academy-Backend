const express = require('express');
const router = express.Router();

const authAdminController = require('../controllers/authAdminController');
const categoryController = require('../controllers/categoryController');


router.post('/all-category', categoryController.getAllCategory);

router.use(authAdminController.protect);

router.post('/', authAdminController.restrictTo('admin', 'super-admin'), categoryController.createCategory);
router.patch('/update-category/:id', authAdminController.restrictTo('admin', 'super-admin'), categoryController.updateCategory);
router.delete('/delete-category/:id', authAdminController.restrictTo('super-admin'), categoryController.removeCategory);