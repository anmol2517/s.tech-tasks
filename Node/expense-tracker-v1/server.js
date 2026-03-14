import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10
});

const SECRET = process.env.SECRET_KEY;

const auth = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    req.user = jwt.verify(token, SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
};

app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'All fields required' });
    const conn = await pool.getConnection();
    const [existing] = await conn.query('SELECT id FROM users WHERE email=?', [email]);
    if (existing.length) { conn.release(); return res.status(400).json({ error: 'Email already exists' }); }
    const hash = await bcrypt.hash(password, 10);
    await conn.query('INSERT INTO users (name,email,password) VALUES (?,?,?)', [name, email, hash]);
    conn.release();
    res.json({ message: 'Registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'All fields required' });
    const conn = await pool.getConnection();
    const [users] = await conn.query('SELECT * FROM users WHERE email=?', [email]);
    conn.release();
    if (!users.length) return res.status(400).json({ error: 'Invalid credentials' });
    const user = users[0];
    if (!await bcrypt.compare(password, user.password)) return res.status(400).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, SECRET, { expiresIn: '24h' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed' });
  }
});

app.get('/api/expenses', auth, async (req, res) => {
  try {
    const conn = await pool.getConnection();
    const [rows] = await conn.query('SELECT * FROM expenses WHERE user_id=? ORDER BY date DESC', [req.user.id]);
    conn.release();
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch' });
  }
});

app.post('/api/expenses', auth, async (req, res) => {
  try {
    const { description, amount, category, date } = req.body;
    if (!description || !amount || !category || !date) return res.status(400).json({ error: 'All fields required' });
    const conn = await pool.getConnection();
    const [result] = await conn.query('INSERT INTO expenses (user_id,description,amount,category,date) VALUES (?,?,?,?,?)', [req.user.id, description, amount, category, date]);
    conn.release();
    res.json({ id: result.insertId, message: 'Added' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add' });
  }
});

app.put('/api/expenses/:id', auth, async (req, res) => {
  try {
    const { description, amount, category, date } = req.body;
    if (!description || !amount || !category || !date) return res.status(400).json({ error: 'All fields required' });
    const conn = await pool.getConnection();
    await conn.query('UPDATE expenses SET description=?,amount=?,category=?,date=? WHERE id=? AND user_id=?', [description, amount, category, date, req.params.id, req.user.id]);
    conn.release();
    res.json({ message: 'Updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update' });
  }
});

app.delete('/api/expenses/:id', auth, async (req, res) => {
  try {
    const conn = await pool.getConnection();
    await conn.query('DELETE FROM expenses WHERE id=? AND user_id=?', [req.params.id, req.user.id]);
    conn.release();
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete' });
  }
});

app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

app.listen(process.env.PORT || 5000, () => console.log(`Server running on http://localhost:${process.env.PORT || 5000}`));