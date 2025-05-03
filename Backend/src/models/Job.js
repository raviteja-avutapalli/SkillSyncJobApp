const db = require('../config/db');

const Job = {
  create: (data, cb) => {
    const { title, location, salary_max, type, description, employer_id } = data; 
    const sql = `
      INSERT INTO jobs (title, location, salary_max, type, description, employer_id, posted_at)
      VALUES (?, ?, ?, ?, ?, ?, NOW())
    `;
    db.query(sql, [title, location, salary_max, type, description, employer_id], cb);
  },
  

  getAll: (cb) => {
    db.query('SELECT * FROM jobs', cb);
  },

  getById: (id, cb) => {
    db.query('SELECT * FROM jobs WHERE id = ?', [id], cb);
  },

  delete: (id, cb) => {
    db.query('DELETE FROM jobs WHERE id = ?', [id], cb);
  },
  

  getByEmployer: (employerId, cb) => {
    const sql = `
      SELECT j.*, 
        (SELECT COUNT(*) FROM applications a WHERE a.job_id = j.id) AS applicants_count
      FROM jobs j
      WHERE j.employer_id = ?
      ORDER BY j.posted_at DESC
    `;
    db.query(sql, [employerId], cb);
  },

 update: (id, data, cb) => {
  
  const { title, location, salary_max, type, description } = data;
  const sql = `
    UPDATE jobs SET title = ?, location = ?, salary_max = ?, type = ?, description = ?
    WHERE id = ?
  `;
  db.query(sql, [title, location, salary_max, type, description, id], cb);
  console.log("Update payload:", data);

},
getApplicantsByJob: (jobId, cb) => {
  console.log("Querying applicants for job:", jobId); // 👈 add this
  const sql = `
    SELECT DISTINCT u.name, u.email, p.skills, p.linkedin
    FROM applications a
    JOIN users u ON a.user_id = u.id
    LEFT JOIN profiles p ON a.user_id = p.user_id
    WHERE a.job_id = ?;
  `;
  db.query(sql, [jobId], cb);
},

};


module.exports = Job;
