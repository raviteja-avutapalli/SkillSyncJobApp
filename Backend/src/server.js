// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => res.send('API Running'));

// Load routes
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const profileRoutes = require('./routes/profileRoutes');
app.use('/api/profiles', profileRoutes);

const resumeRoutes = require('./routes/resumeRoutes');
app.use('/api/resumes', resumeRoutes);
app.use('/uploads', express.static('uploads'));

const jobRoutes = require('./routes/jobRoutes');
app.use('/api/jobs', jobRoutes);

const applicationRoutes = require('./routes/applicationRoutes');
app.use('/api/applications', applicationRoutes);

const recommendationRoutes = require('./routes/recommendationRoutes');
app.use('/api/recommendations', recommendationRoutes);


const marketInsightRoutes = require('./routes/marketInsightRoutes');
app.use('/api/insights', marketInsightRoutes);

const candidateScreeningRoutes = require('./routes/candidateScreeningRoutes');
app.use('/api/screenings', candidateScreeningRoutes);

const jobTrackingRoutes = require('./routes/jobTrackingRoutes');
app.use('/api/tracking', jobTrackingRoutes);

const adminRoutes = require("./routes/admin");
app.use("/api/admin", adminRoutes);

const interviewReminderRoutes = require('./routes/interviewReminderRoutes');
app.use('/api/interviewreminders', interviewReminderRoutes);

const reminderRoutes = require("./routes/reminderRoutes");
app.use("/api/reminders", reminderRoutes);

const chatRoute = require('./routes/chatRoutes.js');
app.use('/api/chat', chatRoute);

app.use('/api', require('./routes/userRoutes')); // 🔴 Redundant, already defined earlier

const blogRoutes = require('./routes/blogRoutes');
app.use('/api/blogs', blogRoutes);
