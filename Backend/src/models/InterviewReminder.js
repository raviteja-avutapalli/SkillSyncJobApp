const db = require("../config/db");

const Reminder = {
  create: (application_id, interview_date, reminder_time, platform, meeting_link, callback) => {
    const sql = `
      INSERT INTO interviewreminders (application_id, interview_date, reminder_time, platform, meeting_link, sent)
      VALUES (?, ?, ?, ?, ?, 0)
    `;
    db.query(sql, [application_id, interview_date, reminder_time, platform, meeting_link], callback);
  },

  getByUser: (userId, callback) => {
    const sql = `
      SELECT ir.*
      FROM interviewreminders ir
      JOIN applications a ON ir.application_id = a.id
      WHERE a.user_id = ?
    `;
    db.query(sql, [userId], callback);
  },
  
};

module.exports = Reminder;
