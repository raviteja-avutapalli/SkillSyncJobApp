// controllers/recommendationController.js
const Recommendation = require('../models/Recommendation');

exports.recommendJob = (req, res) => {
  const { user_id, job_id, reason } = req.body;
  Recommendation.recommendJob(user_id, job_id, reason, (err) => {
    if (err) return res.status(500).json({ error: 'Job recommendation failed' });
    res.json({ message: 'Job recommended' });
  });
};

exports.getJobRecommendations = (req, res) => {
  Recommendation.getJobRecommendations( (err, results) => {
    if (err) return res.status(500).json({ error: 'Fetch failed' });
    res.json(results);
  });
};

exports.recommendCourse = (req, res) => {
  const {  course_id, recommended_by } = req.body;
  Recommendation.recommendCourse( course_id, recommended_by, (err) => {
    if (err) return res.status(500).json({ error: 'Course recommendation failed' });
    res.json({ message: 'Course recommended' });
  });
};

exports.getCourseRecommendations = (req, res) => {
  Recommendation.getCourseRecommendations((err, results) => {
    if (err) return res.status(500).json({ error: 'Fetch failed' });
    res.json(results);
  });
};
