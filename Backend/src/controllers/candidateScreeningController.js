const CandidateScreening = require('../models/candidatescreening');

// Get all candidate screenings
exports.getAllScreenings = async (req, res) => {
  try {
    const screenings = await CandidateScreening.getAllScreenings();
    res.status(200).json(screenings);
  } catch (error) {
    console.error('Error fetching screenings:', error);
    res.status(500).json({ message: 'Failed to fetch screenings', error: error.message });
  }
};

// Get screening by ID
exports.getScreeningById = async (req, res) => {
  try {
    const screening = await CandidateScreening.getScreeningById(req.params.id);
    
    if (!screening) {
      return res.status(404).json({ message: 'Screening not found' });
    }
    
    res.status(200).json(screening);
  } catch (error) {
    console.error('Error fetching screening:', error);
    res.status(500).json({ message: 'Failed to fetch screening', error: error.message });
  }
};

// Get screenings by employer ID
exports.getScreeningsByEmployer = async (req, res) => {
  try {
    const employerId = req.params.employerId;
    const screenings = await CandidateScreening.getScreeningsByEmployer(employerId);
        res.status(200).json(screenings);
  } catch (error) {
    console.error('Error fetching screenings by employer:', error);
    res.status(500).json({ message: 'Failed to fetch screenings', error: error.message });
  }
};

// Create a new screening
exports.createScreening = async (req, res) => {
  try {
    const { application_id, score, remarks, evaluation_criteria, screened_by } = req.body;
    
    // Validation
    if (!application_id || !screened_by) {
      return res.status(400).json({ 
        message: 'Missing required fields (application_id, screened_by)'
      });
    }
    
    const newScreening = await CandidateScreening.createScreening({
      application_id,
      score: score || null,
      remarks: remarks || null,
      evaluation_criteria,
      screened_by
    });
    
    res.status(201).json(newScreening);
  } catch (error) {
    console.error('Error creating screening:', error);
    res.status(500).json({ message: 'Failed to create screening', error: error.message });
  }
};

// Update screening feedback
exports.updateFeedback = async (req, res) => {
  try {
    const { remarks, score } = req.body;
    
    if (typeof score !== 'number' || score < 0 || score > 100) {
      return res.status(400).json({ message: 'Score must be a number between 0 and 100' });
    }
    
    const updatedScreening = await CandidateScreening.updateFeedback(req.params.id, { remarks, score });
    
    if (!updatedScreening) {
      return res.status(404).json({ message: 'Screening not found' });
    }
    
    res.status(200).json(updatedScreening);
  } catch (error) {
    console.error('Error updating screening feedback:', error);
    res.status(500).json({ message: 'Failed to update feedback', error: error.message });
  }
};

// Delete a screening
exports.deleteScreening = async (req, res) => {
  try {
    const deleted = await CandidateScreening.deleteScreening(req.params.id);
    
    if (!deleted) {
      return res.status(404).json({ message: 'Screening not found' });
    }
    
    res.status(200).json({ message: 'Screening deleted successfully' });
  } catch (error) {
    console.error('Error deleting screening:', error);
    res.status(500).json({ message: 'Failed to delete screening', error: error.message });
  }
};