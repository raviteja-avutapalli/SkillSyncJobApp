// controllers/interviewReminderController.js
const Reminder = require('../models/InterviewReminder');

exports.createReminder = (req, res) => {
  const { application_id, interview_date, reminder_time, platform, meeting_link } = req.body;
  console.log("Received reminder:", req.body); // Add this

  Reminder.create(application_id, interview_date, reminder_time, platform, meeting_link, (err) => {
    if (err) {
      console.error("Create failed:", err); // Add this
      return res.status(500).json({ error: 'Failed to create reminder' });
    }
    res.json({ message: 'Reminder set' });
  });
};


exports.getUserReminders = (req, res) => {
  const userId = req.params.userId;
  Reminder.getByUser(userId, (err, results) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch reminders' });
    res.json(results);
  });
};
