const express = require('express');

const router = express.Router();
const bcrypt = require('bcrypt');
const { User } = require('../db/models');
const {
  validateRegistration,
  validateLogin,
} = require('../middleware/validation');
const asyncHandler = require('../middleware/asyncHandler');
const { UnauthorizedError } = require('../middleware/error');
const { createToken } = require('../middleware/token');
const authMiddleware = require('../middleware/auth');

router.post(
  '/register',
  validateRegistration,
  asyncHandler(async (req, res) => {
    const { login, email, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await User.create({
      login,
      email,
      password: hashedPassword,
    });
    const token = createToken(user.id);
    res.status(201).json({ user, token });
  }),
);

router.post(
  '/login',
  validateLogin,
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const token = createToken(user.id);
    res.status(200).json({ user, token });
  }),
);

router.delete(
  '/logout',
  authMiddleware,
  asyncHandler(async (req, res) => {
    const token = req.header('auth-token');
    req.user.tokens = req.user.tokens.filter((t) => t.token !== token);
    await req.user.save();
    res.status(200).send('Logged out');
  }),
);
router.get('/protected', authMiddleware, (req, res) => {
  res.status(200).json({ message: 'Authorized' });
});
module.exports = router;
