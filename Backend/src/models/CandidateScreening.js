const db = require('../config/db');

class CandidateScreening {
  // Get all screenings
  static getAllScreenings() {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT * FROM candidatescreenings
        ORDER BY screened_at DESC
      `;
      
      db.query(query, (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results);
      });
    });
  }

  // Get screening by ID
  static getScreeningById(id) {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM candidatescreenings WHERE id = ?';
      
      db.query(query, [id], (err, results) => {
        if (err) {
          return reject(err);
        }
        if (results.length === 0) {
          return resolve(null);
        }
        resolve(results[0]);
      });
    });
  }

  // Get screenings by employer ID
  static getScreeningsByEmployer(employerId) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT cs.*, u.name AS applicant_name
        FROM candidatescreenings cs
        JOIN applications a ON cs.application_id = a.id
        JOIN users u ON a.user_id = u.id
        WHERE cs.screened_by = ?
        ORDER BY cs.screened_at DESC;
      `;
      
      db.query(query, [employerId], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  }
  

  // Create new screening
  static createScreening(screeningData) {
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO candidatescreenings
        (application_id, score, remarks, evaluation_criteria, screened_by)
        VALUES (?, ?, ?, ?, ?)
      `;
      
      const { application_id, score, remarks, evaluation_criteria, screened_by } = screeningData;
      
      db.query(
        query, 
        [application_id, score, remarks, evaluation_criteria, screened_by],
        (err, result) => {
          if (err) {
            return reject(err);
          }
          resolve({ id: result.insertId, ...screeningData });
        }
      );
    });
  }

  // Update screening feedback
  static updateFeedback(id, feedbackData) {
    return new Promise((resolve, reject) => {
      const query = `
        UPDATE candidatescreenings
        SET remarks = ?, score = ?
        WHERE id = ?
      `;
      
      const { remarks, score } = feedbackData;
      
      db.query(query, [remarks, score, id], (err, result) => {
        if (err) {
          return reject(err);
        }
        if (result.affectedRows === 0) {
          return resolve(null);
        }
        resolve({ id, ...feedbackData });
      });
    });
  }

  // Delete screening
  static deleteScreening(id) {
    return new Promise((resolve, reject) => {
      const query = 'DELETE FROM candidatescreenings WHERE id = ?';
      
      db.query(query, [id], (err, result) => {
        if (err) {
          return reject(err);
        }
        if (result.affectedRows === 0) {
          return resolve(false);
        }
        resolve(true);
      });
    });
  }
}

module.exports = CandidateScreening;