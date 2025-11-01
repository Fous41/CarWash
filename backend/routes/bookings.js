const express = require('express');
const router = express.Router();
const pool = require('../db'); // make sure db.js exists
const jwt = require('jsonwebtoken');

// Middleware to check JWT
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, 'your_jwt_secret', (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user; // user info from token
    next();
  });
}

// POST /api/bookings - create a new booking
router.post('/', authenticateToken, async (req, res) => {
  const { service, date, time } = req.body;
  const userId = req.user.id;

  try {
    const result = await pool.query(
      'INSERT INTO bookings (user_id, service, date, time) VALUES ($1, $2, $3, $4) RETURNING *',
      [userId, service, date, time]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/bookings - get all bookings for logged-in user
router.get('/', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  try {
    const result = await pool.query(
      'SELECT * FROM bookings WHERE user_id = $1 ORDER BY date, time',
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
