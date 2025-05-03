// models/Profile.js
const db = require('../config/db');

const Profile = {
  createOrUpdate: (user_id, data, callback) => {
    const sql = `
      INSERT INTO Profiles 
        (user_id, phone, address, education, experience, skills, certifications, languages, linkedin, github, bio, profile_picture) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE 
        phone = VALUES(phone), address = VALUES(address), education = VALUES(education),
        experience = VALUES(experience), skills = VALUES(skills), certifications = VALUES(certifications),
        languages = VALUES(languages), linkedin = VALUES(linkedin), github = VALUES(github),
        bio = VALUES(bio), profile_picture = VALUES(profile_picture)
    `;
    const values = [
      user_id,
      data.phone, data.address, data.education, data.experience, data.skills,
      data.certifications, data.languages, data.linkedin, data.github,
      data.bio, data.profile_picture
    ];
    db.query(sql, values, callback);
  },

  getByUserId: (user_id, callback) => {
    db.query('SELECT * FROM Profiles WHERE user_id = ?', [user_id], callback);
  }
};

module.exports = Profile;
