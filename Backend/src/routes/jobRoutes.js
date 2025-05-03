// routes/jobRoutes.js
const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');

router.post('/', jobController.postJob);
router.get('/', jobController.getJobs);
router.get('/:jobId', jobController.getJob);
router.get('/employer/:employerId', jobController.getEmployerJobs);
router.delete('/:jobId', jobController.deleteJob);
router.put('/:jobId', jobController.updateJob);
router.get('/:jobId/applicants', jobController.getJobApplicants);


module.exports = router;
