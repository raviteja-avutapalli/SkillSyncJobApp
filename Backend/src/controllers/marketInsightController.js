// controllers/marketInsightController.js
const MarketInsight = require('../models/MarketInsight');

exports.createInsight = (req, res) => {
  const data = req.body;
  MarketInsight.create(data, (err) => {
    if (err) return res.status(500).json({ error: 'Failed to publish insight' });
    res.json({ message: 'Insight added' });
  });
};

exports.getInsights = (req, res) => {
  MarketInsight.getAll((err, results) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch insights' });
    res.json(results);
  });
};

exports.getInsight = (req, res) => {
  MarketInsight.getById(req.params.id, (err, result) => {
    if (err || result.length === 0) return res.status(404).json({ error: 'Insight not found' });
    res.json(result[0]);
  });
};

exports.getInsights = (req, res) => {
  const { type } = req.query;
  if (type) {
    MarketInsight.getByType(type, (err, results) => {
      if (err) return res.status(500).json({ error: 'Failed to fetch insights' });
      res.json(results);
    });
  } else {
    MarketInsight.getAll((err, results) => {
      if (err) return res.status(500).json({ error: 'Failed to fetch insights' });
      res.json(results);
    });
  }
};

exports.getHotLocations = (req, res) => {
  MarketInsight.getHotJobLocations((err, results) => {
    if (err) {
      console.error("DB Error:", err); // 👈 ADD THIS
      return res.status(500).json({ error: 'Failed to fetch job hotspots' });
    }
    res.json(results);
  });
};


