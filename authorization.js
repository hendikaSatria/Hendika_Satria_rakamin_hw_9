const jwt = require('jsonwebtoken');
const dotenv = require('dotenv'); 

dotenv.config();
const secretKey = process.env.JWT_SECRET_KEY;

const generateToken = (data, expiresIn = '1h') => {
  try {
    const token = jwt.sign(data, secretKey, { expiresIn });
    return token;
  } catch (error) {
    throw error;
  }
};

const verifyToken = (token) => {
  try {
    console.log({token, secretKey});
    const data = jwt.verify(token.replace("Bearer ",""), secretKey);
    return data;
  } catch (error) {
    throw error;
  }
};

module.exports = { generateToken, verifyToken };