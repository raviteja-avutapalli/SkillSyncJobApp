// controllers/jobTrackingController.js
const JobTracking = require('../models/JobTracking');

exports.addTracking = (req, res) => {
  const data = req.body;
  JobTracking.addStatus(data, (err) => {
    if (err) return res.status(500).json({ error: 'Tracking update failed' });
    res.json({ message: 'Tracking updated' });
  });
};

exports.getUserTracking = (req, res) => {
  const { userId } = req.params;
  JobTracking.getUserTracking(userId, (err, results) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch user tracking' });
    res.json(results);
  });
};

exports.getJobTracking = (req, res) => {
  const { jobId } = req.params;
  JobTracking.getJobTracking(jobId, (err, results) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch job tracking' });
    res.json(results);
  });
};
