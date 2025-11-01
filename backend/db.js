// db.js
const { Pool } = require('pg');

// Replace with your PostgreSQL credentials
const pool = new Pool({
  user: 'postgres',          // your PostgreSQL username
  host: 'localhost',
  database: 'carwash',       // the DB you just created
  password: 'kali',  // the password you set during installation
  port: 5432,
});

module.exports = pool;
