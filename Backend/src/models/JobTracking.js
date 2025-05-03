// models/JobTracking.js
const db = require('../config/db');

const JobTracking = {
  addStatus: (data, callback) => {
    const sql = `
      INSERT INTO JobTracking (user_id, job_id, status_update, notes, updated_at)
      VALUES (?, ?, ?, ?, NOW())
    `;
    db.query(sql, [
      data.user_id,
      data.job_id,
      data.status_update,
      data.notes
    ], callback);
  },

  getUserTracking: (user_id, callback) => {
    const sql = `
      SELECT jt.*, j.title, j.location
      FROM JobTracking jt
      JOIN Jobs j ON jt.job_id = j.id
      WHERE jt.user_id = ?
      ORDER BY updated_at DESC
    `;
    db.query(sql, [user_id], callback);
  },

  getJobTracking: (job_id, callback) => {
    const sql = `
      SELECT jt.*, u.name AS user_name
      FROM JobTracking jt
      JOIN Users u ON jt.user_id = u.id
      WHERE jt.job_id = ?
      ORDER BY updated_at DESC
    `;
    db.query(sql, [job_id], callback);
  }
};

module.exports = JobTracking;
