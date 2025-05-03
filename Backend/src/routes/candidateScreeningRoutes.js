const express = require('express');
const router = express.Router();
const screeningController = require('../controllers/candidateScreeningController');

// Remove all middleware for now to get the routes working
// NO router.use() calls here

// Get all screenings
router.get('/', screeningController.getAllScreenings);

// Get screenings by employer ID - Must be before the /:id route
router.get('/employer/:employerId', screeningController.getScreeningsByEmployer);

// Get screening by ID
router.get('/:id', screeningController.getScreeningById);

// Create new screening
router.post('/', screeningController.createScreening);

// Update screening feedback
router.post('/:id/feedback', screeningController.updateFeedback);

// Delete screening
router.delete('/:id', screeningController.deleteScreening);

module.exports = router;