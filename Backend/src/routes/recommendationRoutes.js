// routes/recommendationRoutes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/recommendationController');

router.post('/jobs', controller.recommendJob);
router.get('/jobs', controller.getJobRecommendations);

router.post('/courses', controller.recommendCourse);
router.get('/courses', controller.getCourseRecommendations);

module.exports = router;
