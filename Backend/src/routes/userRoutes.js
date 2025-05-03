// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken } = require('../middleware/auth');



router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/secure-data', verifyToken, userController.secureFunction);
router.post("/reset-password", userController.resetPassword);
router.post('/users/:id/name', userController.updateName);
router.get('/users/:id', userController.getUser);


module.exports = router;
