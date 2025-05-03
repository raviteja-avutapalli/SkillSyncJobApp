// controllers/profileController.js
const Profile = require('../models/Profile');

exports.getProfile = (req, res) => {
  const userId = req.params.userId;
  Profile.getByUserId(userId, (err, results) => {
    if (err) return res.status(500).json({ error: 'Failed to retrieve profile' });
    if (results.length === 0) return res.status(404).json({ message: 'Profile not found' });
    res.json(results[0]);
  });
};

exports.saveProfile = (req, res) => {
  const userId = req.params.userId;
  Profile.createOrUpdate(userId, req.body, (err, result) => {
    if (err) return res.status(500).json({ error: 'Failed to save profile' });
    res.json({ message: 'Profile saved successfully' });
  });
};
