const express = require('express');
const router = express.Router();
const { generateToken } = require('../authorization.js'); 
const pool = require('../query.js');

// get user with pagination limit 10 per page
router.get('/', async (req, res) => {
  try {
      const page = parseInt(req.query.page) || 1; 
      const pageSize = 10; 
      const offset = (page - 1) * pageSize; 
      
      // use the LIMIT and OFFSET 
      const query = {
          text: 'SELECT * FROM users ORDER BY id LIMIT $1 OFFSET $2',
          values: [pageSize, offset],
      };

      const users = await pool.query(query);
      res.json({ users: users.rows });
  } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'An error occurred while fetching users.' });
  }
});

router.post('/register', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    
    // Check if the user with the same email already exists
    const checkUserQuery = 'SELECT * FROM users WHERE email = $1';
    const existingUser = await pool.query(checkUserQuery, [email]);
    
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }
    const insertUserQuery = 'INSERT INTO users (email, password, role) VALUES ($1, $2, $3) RETURNING id';
    const result = await pool.query(insertUserQuery, [email, password, role]);
    const { id } = result.rows[0];
    const token = generateToken({ id, email, role });

    res.status(201).json({ token });
  } catch (error) {
    console.error('Error during user registration:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const query = 'SELECT id, email, password, role FROM users WHERE email = $1 AND password = $2';
    const result = await pool.query(query, [email, password]);
    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Authentication failed' });
    }
    const user = result.rows[0];
    const { id, role } = user;
    const token = generateToken({ id, email, role }); 

    res.json({ token });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;