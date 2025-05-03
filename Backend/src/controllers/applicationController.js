// controllers/applicationController.js
const Application = require('../models/Application');
const db = require('../config/db'); 

exports.applyJob = (req, res) => {
  const data = req.body;
  Application.apply(data, (err, result) => {
    if (err) return res.status(500).json({ error: 'Application failed' });
    res.status(201).json({ message: 'Application submitted' });
  });
};

exports.getUserApplications = (req, res) => {
  Application.getByUser(req.params.userId, (err, results) => {
    if (err) return res.status(500).json({ error: 'Fetch failed' });
    res.json(results);
  });
};

exports.getJobApplications = (req, res) => {
  Application.getByJob(req.params.jobId, (err, results) => {
    if (err) return res.status(500).json({ error: 'Fetch failed' });
    res.json(results);
  });
};

exports.updateApplicationStatus = (req, res) => {
  const { applicationId } = req.params;
  const { status } = req.body;
  Application.updateStatus(applicationId, status, (err) => {
    if (err) return res.status(500).json({ error: 'Status update failed' });
    res.json({ message: 'Status updated' });
  });
};

exports.getEmployerApplications = (req, res) => {
  const employerId = req.params.employerId;
  const sql = `
    SELECT a.id, a.job_id, a.user_id, a.status, a.cover_letter, u.name AS applicant_name, j.title AS job_title
    FROM applications a
    JOIN users u ON a.user_id = u.id
    JOIN jobs j ON a.job_id = j.id
    WHERE j.employer_id = ?
    ORDER BY a.applied_at DESC
  `;
  db.query(sql, [employerId], (err, results) => {
    if (err) return res.status(500).json({ error: 'Fetch failed' });
    res.json(results);
  });
};


exports.applyJob = (req, res) => {
  const { user_id, job_id, resume_id = null, cover_letter = "", status = "applied" } = req.body;

  if (!user_id || !job_id) {
    return res.status(400).json({ error: "Missing user_id or job_id." });
  }

  const checkSql = 'SELECT * FROM Applications WHERE user_id = ? AND job_id = ?';
  db.query(checkSql, [user_id, job_id], (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error.' });

    if (results.length > 0) {
      const existing = results[0];
      if (existing.status === 'saved' && status === 'applied') {
        // Upgrade saved to applied
        const updateSql = `
          UPDATE Applications 
          SET status = 'applied', applied_at = NOW(), resume_id = ?, cover_letter = ?
          WHERE user_id = ? AND job_id = ?
        `;
        db.query(updateSql, [resume_id, cover_letter, user_id, job_id], (updateErr) => {
          if (updateErr) return res.status(500).json({ error: "Update failed" });
          return res.json({ message: "Application status updated to applied." });
        });
      } else if (existing.status === 'applied' && status === 'applied') {
        return res.status(409).json({ message: "You have already applied to this job." });
      } else if (status === 'saved') {
        // If already saved, just say OK (idempotent)
        return res.json({ message: "Job already saved." });
      } else {
        return res.status(409).json({ message: `Application already exists with status '${existing.status}'.` });
      }
    } else {
      // No record, insert new
      Application.apply(
        {
          job_id,
          user_id,
          status,
          resume_id,
          cover_letter
        },
        (insertErr) => {
          if (insertErr) return res.status(500).json({ error: 'Application failed' });
          res.status(201).json({ message: status === 'applied' ? 'Application submitted' : 'Job saved!' });
        }
      );
    }
  });
};
