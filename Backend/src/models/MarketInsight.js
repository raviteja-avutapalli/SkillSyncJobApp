// models/MarketInsight.js
const db = require('../config/db');

const MarketInsight = {
  create: (data, callback) => {
    const sql = `
      INSERT INTO MarketInsights (title, content, tags, source, image_url, published_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    db.query(sql, [
      data.title,
      data.content,
      data.tags,
      data.source,
      data.image_url,
      data.published_at
    ], callback);
  },

  getAll: (callback) => {
    db.query('SELECT * FROM MarketInsights ORDER BY published_at DESC', callback);
  },

  getById: (id, callback) => {
    db.query('SELECT * FROM MarketInsights WHERE id = ?', [id], callback);
  },

  getByType: (type, callback) => {
    db.query('SELECT * FROM MarketInsights WHERE type = ? ORDER BY published_at DESC', [type], callback);
  },

  getHotJobLocations: (callback) => {
    const sql = `
      SELECT title, location, COUNT(*) as count
      FROM jobs
      GROUP BY title, location
      ORDER BY count DESC
      LIMIT 5
    `;
    console.log("Running Hot Job Locations Query");
    db.query(sql, callback);
  }
  
  
  
};

module.exports = MarketInsight;
