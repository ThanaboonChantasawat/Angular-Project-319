// backend/routes/user.routes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

// Get all users
router.get('/', userController.getUsers);

// Register user
router.post('/register', userController.register);

// Login user
router.post('/login', userController.login);

// Update user
router.put('/:id', userController.updateUser);

// Update password
router.patch('/:id/password', userController.updatePassword);

// Delete user
router.delete('/:id', userController.deleteUser);

module.exports = router;