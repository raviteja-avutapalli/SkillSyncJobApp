// routes/profileRoutes.js
const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');

router.get('/:userId', profileController.getProfile);
router.post('/:userId', profileController.saveProfile);

module.exports = router;
