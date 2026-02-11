import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mysql from 'mysql2/promise';

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_change_in_production';
const SALT_ROUNDS = 12;

// MySQL connection
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'auth_db'
};

let db;

try {
  db = await mysql.createConnection(dbConfig);
  console.log('Connected to MySQL database');
  
  // Create users table if it doesn't exist
  await db.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log('Users table ready');
} catch (error) {
  console.error('Database connection failed:', error);
  process.exit(1);
}

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Backend is running!' });
});

// Register
app.post('/api/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    // Check if user already exists
    const [existingUsers] = await db.execute('SELECT id FROM users WHERE email = ?', [email]);
    if (existingUsers.length > 0) {
      return res.status(409).json({ error: 'Email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Insert user
    await db.execute('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashedPassword]);
    
    res.json({ message: 'Registration successful' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    // Find user in database
    const [users] = await db.execute('SELECT id, email, password FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = users[0];

    // Compare password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Profile (protected)
app.get('/api/profile', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Get user info from database
    const [users] = await db.execute('SELECT id, email, created_at FROM users WHERE id = ?', [decoded.userId]);
    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = users[0];
    res.json({ 
      id: user.id, 
      email: user.email, 
      createdAt: user.created_at 
    });
  } catch (err) {
    console.error('Profile error:', err);
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// /me endpoint (protected)
app.get('/api/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Get user info from database
    const [users] = await db.execute('SELECT id, email, created_at FROM users WHERE id = ?', [decoded.userId]);
    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = users[0];
    res.json({ 
      id: user.id, 
      email: user.email, 
      createdAt: user.created_at 
    });
  } catch (err) {
    console.error('/me error:', err);
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    res.status(500).json({ error: 'Failed to fetch user info' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
