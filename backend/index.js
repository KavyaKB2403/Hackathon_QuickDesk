require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { sequelize, User, Token } = require('./models');

const app = express();
const PORT = process.env.PORT || 5000;
const ROLE_SECRET = process.env.ROLE_SECRET;
const JWT_SECRET = process.env.JWT_SECRET;

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Helper middleware to authenticate JWT token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.sendStatus(401);
  const token = authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'QuickDesk Backend API is running!' });
});

// Register
app.post('/auth/register', async (req, res) => {
  try {
    const { username, email, password, role, secret } = req.body;

    if (!username || !email || !password || !role) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if ((role === 'admin' || role === 'agent') && secret !== ROLE_SECRET) {
      return res.status(403).json({ error: 'Invalid secret code for role assignment' });
    }

    const assignedRole = ['user', 'agent', 'admin'].includes(role) ? role : 'user';

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      role: assignedRole
    });

    return res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Login
app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Missing email or password' });

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Mock tickets endpoint for dashboard
app.get('/tickets', authenticateToken, async (req, res) => {
  // Mock data - replace with real ticket logic later
  const tickets = [
    {
      id: 1,
      subject: "How to win odoo Hackathon",
      description: "I want to win odoo hackathon tell me what are the skills i needed for it...",
      status: "open",
      userId: req.user.id,
      createdAt: new Date()
    }
  ];
  res.json({ tickets });
});

// Password Reset routes (same as your original)
app.post('/auth/request-reset-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email required' });

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ error: 'User with this email does not exist' });

    await Token.destroy({ where: { userId: user.id } });

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = await bcrypt.hash(resetToken, 10);

    await Token.create({
      userId: user.id,
      token: hashedToken,
      createdAt: new Date()
    });

    const link = `http://localhost:3000/reset-password?token=${resetToken}&id=${user.id}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Reset your QuickDesk password',
      html: `<p>Please click this link to reset your password:</p><p><a href="${link}">${link}</a></p>`
    });

    res.json({ message: 'Password reset email sent' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/auth/reset-password', async (req, res) => {
  try {
    const { userId, token, password } = req.body;
    if (!userId || !token || !password) {
      return res.status(400).json({ error: 'Missing required information' });
    }

    const tokenRecord = await Token.findOne({ where: { userId } });
    if (!tokenRecord) return res.status(400).json({ error: 'Invalid or expired token' });

    const isValid = await bcrypt.compare(token, tokenRecord.token);
    if (!isValid) return res.status(400).json({ error: 'Invalid or expired token' });

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.update({ password: hashedPassword }, { where: { id: userId } });
    await Token.destroy({ where: { userId } });

    res.json({ message: 'Password reset successful' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Initialize DB and start server
sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
