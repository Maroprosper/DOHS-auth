const jwt = require('jsonwebtoken');
const config = require('../config/auth.config.js');

const verifyToken = (req, res, next) => {
  const token = req.headers['x-access-token'];

  if (!token) return res.status(403).send({ message: 'No token provided!' });

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) return res.status(401).send({ message: 'Unauthorized!' });

    req.userId = decoded.id;
    next();
  });
};

const isAdmin = async (req, res, next) => {
  // Implement admin role check if needed
  next();
};

module.exports = { verifyToken, isAdmin };
