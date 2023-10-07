const jwt = require('jsonwebtoken');
const authorization = require('../authorization');
const { verifyToken } = authorization;
const pool = require('../query');

const protectRouteForUsers = async (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'Authorization token is missing' });
  }
  // verify the token
  try {
    const decodedToken = verifyToken(token);
    const userId = decodedToken.id;
    // check if the user exists in the database
    const client = await pool.connect();

    const query = 'SELECT * FROM users WHERE id = $1';
    const result = await client.query(query, [userId]);

    client.release();

    if (result.rows.length === 0) {
      return res.status(403).json({ message: 'Access denied. User does not exist' });
    }
    next(); 
  } catch (error) {
    console.log('Received Token:', req.headers.authorization);
    return res.status(401).json({ message: error });
  }
};

module.exports = { protectRouteForUsers };

