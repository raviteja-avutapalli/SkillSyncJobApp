// routes/applicationRoutes.js
const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');

router.post('/', applicationController.applyJob);
router.get('/user/:userId', applicationController.getUserApplications);
router.get('/job/:jobId', applicationController.getJobApplications);
router.patch('/:applicationId/status', applicationController.updateApplicationStatus);
router.get('/employer/:employerId', applicationController.getEmployerApplications);


module.exports = router;
