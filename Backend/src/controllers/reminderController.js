const db = require("../config/db");

exports.getByEmployer = (req, res) => {
  const employerId = req.params.id;
  const query = `
    SELECT 
  ir.id,
  ir.interview_date,
  ir.platform,
  ir.meeting_link,
  u.name AS applicant_name,
  j.title AS job_title
FROM interviewreminders ir
JOIN applications a ON ir.application_id = a.id
JOIN users u ON a.user_id = u.id
JOIN jobs j ON a.job_id = j.id
WHERE j.employer_id = ?
ORDER BY ir.interview_date DESC;
  `;
  db.query(query, [employerId], (err, results) => {
    if (err) return res.status(500).json({ error: "DB error" });
    res.json(results);
  });
};

exports.getByJobseeker = (req, res) => {
    const userId = req.params.id;
    const query = `
      SELECT 
  ir.interview_date, 
  ir.platform, 
  ir.meeting_link, 
  j.title,
  u.name AS company_name
FROM 
  interviewreminders ir
JOIN applications a ON ir.application_id = a.id
JOIN jobs j ON a.job_id = j.id
JOIN users u ON j.employer_id = u.id
WHERE 
  a.user_id = ?
ORDER BY 
  ir.interview_date DESC;

    `;
    db.query(query, [userId], (err, results) => {
      if (err) return res.status(500).json({ error: "DB error" });
      res.json(results);
    });
  };
  