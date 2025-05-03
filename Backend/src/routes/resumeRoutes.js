// routes/resumeRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const resumeController = require('../controllers/resumeController');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});

const upload = multer({ storage });

router.post('/:userId', upload.single('resume'), resumeController.uploadResume);
router.get('/:userId', resumeController.getLatestResume);


module.exports = router;
