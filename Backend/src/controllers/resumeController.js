const Resume = require('../models/Resume');

const pdf = require('pdf-parse');
const fs = require('fs');

exports.uploadResume = async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  const userId = req.params.userId;
  const filePath = req.file.path;
  const originalName = req.file.originalname;

  Resume.upload(userId, filePath, originalName, async (err) => {
    if (err) return res.status(500).json({ error: 'Upload failed' });

    const buffer = fs.readFileSync(filePath);
    const data = await pdf(buffer);

    const insights = extractInsights(data.text);
    res.status(201).json({ message: 'Resume uploaded successfully', insights });
  });
};

exports.getLatestResume = (req, res) => {
  Resume.getByUserId(req.params.userId, (err, results) => {
    if (err || !results.length) return res.status(404).json({ error: 'Resume not found' });
    res.json(results[0]);
  });
};


function extractInsights(text) {
  return {
    name: (text.match(/[A-Z][a-z]+\s[A-Z][a-z]+/) || [])[0] || 'Not found',
    email: (text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/) || [])[0] || 'Not found',
    phone: (text.match(/\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/) || [])[0] || 'Not found',
    experience: extractExperience(text),
    skills: extractSkills(text),
    education: extractEducation(text),
    certifications: extractCertifications(text),
  };
}

function extractExperience(text) {
  const matches = text.match(/(Dec|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov)[a-z]*\s+\d{4}/gi);
  if (!matches || matches.length < 2) return 'Not mentioned';
  const fromYear = parseInt(matches[matches.length - 1].match(/\d{4}/)[0]);
  const toYear = parseInt(matches[0].match(/\d{4}/)[0]);
  return `${toYear - fromYear} years`;
}

function extractSkills(text) {
  const skillsList = [
    'Python', 'Node.js', 'Java', 'Kafka', 'MongoDB', 'PostgreSQL',
    'Docker', 'Kubernetes', 'AWS', 'GCP', 'CI/CD', 'Redis', 'RabbitMQ',
    'FastAPI', 'Flask', 'TensorFlow', 'React', 'GitHub Actions', 'Jenkins'
  ];
  return skillsList.filter(skill => text.toLowerCase().includes(skill.toLowerCase()));
}

function extractEducation(text) {
  const eduMatches = text.match(/(Bachelor|Master|PhD)[\w\s,.()-]*\d{4}/gi);
  return eduMatches || ['Not found'];
}

function extractCertifications(text) {
  const certBlock = text.match(/Certifications[\s\S]*?(Education|Projects|Skills)/i);
  if (!certBlock) return ['Not found'];
  return certBlock[0]
    .split('\n')
    .map(line => line.trim())
    .filter(line => line && !/Certifications|Education|Projects|Skills/i.test(line));
}


