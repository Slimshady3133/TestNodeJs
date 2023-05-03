const jwt = require('jsonwebtoken');

const createToken = (userId) => {
  const payload = { userId };
  const secret = process.env.JWT_SECRET;
  const options = { expiresIn: '1h' };
  return jwt.sign(payload, secret, options);
};

module.exports = { createToken };
