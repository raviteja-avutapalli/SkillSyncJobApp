// controllers/jobController.js
const Job = require('../models/Job');

exports.postJob = (req, res) => {
  const jobData = req.body;
  Job.create(jobData, (err, result) => {
    if (err) return res.status(500).json({ error: 'Job posting failed' });
    res.status(201).json({ message: 'Job posted', jobId: result.insertId });
  });
};

exports.getJobs = (req, res) => {
  Job.getAll((err, results) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch jobs' });
    res.json(results);
  });
};

exports.getJob = (req, res) => {
  const jobId = req.params.jobId;
  Job.getById(jobId, (err, result) => {
    if (err || result.length === 0) return res.status(404).json({ error: 'Job not found' });
    res.json(result[0]);
  });
};

exports.getEmployerJobs = (req, res) => {
  const employerId = req.params.employerId;
  Job.getByEmployer(employerId, (err, results) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch employer jobs' });
    res.json(results);
  });
  
};


exports.deleteJob = (req, res) => {
  const jobId = req.params.jobId;
  Job.delete(jobId, (err) => {
    if (err) return res.status(500).json({ error: 'Delete failed' });
    res.json({ message: 'Job deleted' });
  });
};

exports.updateJob = (req, res) => {
  const jobId = req.params.jobId;
  const updates = req.body;
  Job.update(jobId, updates, (err) => {
    if (err) return res.status(500).json({ error: 'Update failed' });
    console.error(err);
    console.log("Updating job:", jobId, updates);

    res.json({ message: 'Job updated' });
  });
};

exports.getJobApplicants = (req, res) => {
  const jobId = req.params.jobId;
  console.log("Fetching applicants for jobId:", jobId); // 👈 add this
  Job.getApplicantsByJob(jobId, (err, results) => {
    if (err) {
      console.error("DB Error:", err); // 👈 log the error
      return res.status(500).json({ error: 'Failed to fetch applicants' });
    }
    res.json(results);
  });
};




