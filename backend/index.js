// index.js
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = 3000;
const SECRET_KEY = "supersecretkey";

// In-memory storage for users and bookings
const users = [
  {
    id: 1,
    username: "testuser",
    password: bcrypt.hashSync("password123", 10),
    name: "Test User"
  }
];

const bookings = []; // Each booking will have id, userId, car, dateTime

// ---------------- AUTH ----------------

// Login
app.post("/api/auth/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);
  if (!user) return res.status(401).json({ message: "User not found" });

  const isValid = bcrypt.compareSync(password, user.password);
  if (!isValid) return res.status(401).json({ message: "Invalid password" });

  const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: "1h" });
  res.json({ token, user: { id: user.id, username: user.username, name: user.name } });
});

// Register
app.post('/api/auth/register', (req, res) => {
  const { username, password, name } = req.body;

  if (!username || !password || !name) {
    return res.status(400).json({ message: 'All fields required' });
  }

  const existing = users.find(u => u.username === username);
  if (existing) {
    return res.status(409).json({ message: 'User already exists' });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  const newUser = { id: users.length + 1, username, password: hashedPassword, name };
  users.push(newUser);

  const token = jwt.sign({ id: newUser.id, username: newUser.username }, SECRET_KEY, { expiresIn: '1h' });
  res.json({ token, user: { id: newUser.id, username: newUser.username, name: newUser.name } });
});

// Get profile
app.get("/api/auth/me", (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    const user = users.find(u => u.id === decoded.id);
    res.json({ id: user.id, username: user.username, name: user.name });
  });
});

// ---------------- BOOKINGS ----------------

// Middleware to check JWT token
function authMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = users.find(u => u.id === decoded.id);
    next();
  });
}

// Create booking
app.post("/api/bookings", authMiddleware, (req, res) => {
  const { car, dateTime } = req.body;
  if (!car || !dateTime) return res.status(400).json({ message: "Car and dateTime are required" });

  const newBooking = {
    id: bookings.length + 1,
    userId: req.user.id,
    car,
    dateTime
  };
  bookings.push(newBooking);
  res.json({ message: "Booking created", booking: newBooking });
});

// Get bookings for current user
app.get("/api/bookings", authMiddleware, (req, res) => {
  const userBookings = bookings.filter(b => b.userId === req.user.id);
  res.json(userBookings);
});

// Start server
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
