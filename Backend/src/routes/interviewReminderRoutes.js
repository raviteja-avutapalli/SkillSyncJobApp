// routes/interviewReminderRoutes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/interviewReminderController');

router.post('/', controller.createReminder);
router.get('/user/:userId', controller.getUserReminders);


module.exports = router;
