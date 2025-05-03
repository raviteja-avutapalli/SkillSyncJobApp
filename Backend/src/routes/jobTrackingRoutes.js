// routes/jobTrackingRoutes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/jobTrackingController');

router.post('/', controller.addTracking);
router.get('/user/:userId', controller.getUserTracking);
router.get('/job/:jobId', controller.getJobTracking);

module.exports = router;
