// routes/admin.js
const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.get("/stats", async (req, res) => {
    try {
      const [rows] = await db.promise().execute(`
        SELECT
          COUNT(*) AS totalUsers,
          SUM(CASE WHEN role = 'Employer' THEN 1 ELSE 0 END) AS employers,
          SUM(CASE WHEN role = 'Jobseeker' THEN 1 ELSE 0 END) AS jobseekers
        FROM users
      `);
  
      res.json({ ...rows[0], reports: 0 });
    } catch (err) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  router.get("/jobseekers", async (req, res) => {
    const [rows] = await db.promise().execute(`SELECT u.id AS user_id, u.name, COUNT(a.id) AS applications_count
FROM users u
LEFT JOIN applications a ON u.id = a.user_id
WHERE u.role = 'Jobseeker'
GROUP BY u.id, u.name;`);
    res.json(rows);
  });
  
  router.get("/employers", async (req, res) => {
    const [rows] = await db.promise().execute(`SELECT u.id AS employer_id, u.name, COUNT(j.id) AS jobs_posted
FROM users u
LEFT JOIN jobs j ON u.id = j.employer_id
WHERE u.role = 'Employer'
GROUP BY u.id, u.name;`);
    res.json(rows);
  });

  // DELETE /api/admin/users/:id
router.delete("/users/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await db.promise().execute("DELETE FROM users WHERE id = ?", [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete user" });
  }
});

// Top Employers
router.get("/top-employers", async (req, res) => {
  const [rows] = await db.promise().query(`
    SELECT u.name, COUNT(j.id) AS total_jobs
    FROM users u
    JOIN jobs j ON u.id = j.employer_id
    GROUP BY u.id ORDER BY total_jobs DESC LIMIT 5
  `);
  res.json(rows);
});

// Top Jobseekers
router.get("/top-jobseekers", async (req, res) => {
  const [rows] = await db.promise().query(`
    SELECT u.name, COUNT(a.id) AS total_applications
    FROM users u
    JOIN applications a ON u.id = a.user_id
    GROUP BY u.id ORDER BY total_applications DESC LIMIT 5
  `);
  res.json(rows);
});

// Jobs per Month
router.get("/jobs-monthly", async (req, res) => {
  const [rows] = await db.promise().query(`
    SELECT DATE_FORMAT(posted_at, '%Y-%m') AS month, COUNT(*) AS total
    FROM jobs GROUP BY month ORDER BY month DESC LIMIT 6
  `);
  res.json(rows.reverse());
});

// User Distribution
router.get("/user-distribution", async (req, res) => {
  const [rows] = await db.promise().query(`
    SELECT
      SUM(role = 'Employer') AS employers,
      SUM(role = 'Jobseeker') AS jobseekers
    FROM users
  `);
  res.json(rows[0]);
});


  
  
module.exports = router;
