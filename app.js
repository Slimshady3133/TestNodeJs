require('dotenv').config();

const express = require('express');
const winston = require('winston');
const { connect } = require('./databaseCheck');
const { sequelize } = require('./db/models');
const config = require('./config/config');

const app = express();

const PORT = process.env.PORT || 5000;

config(app);

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});
async function start() {
  try {
    await connect();
    await sequelize.sync();
    app.listen(PORT, () => {
      logger.info(`Server is listening on ${PORT}`);
    });
  } catch (err) {
    logger.error(`Error: ${err.message}`, { stack: err.stack });
  }
}

start();

// const express = require('express');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');

// const users = [];

// // Регистрация
// app.post('/register', async (req, res) => {
//   try {
//     // Хэширование пароля
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(req.body.password, salt);

//     const user = { id: users.length + 1, name: req.body.name, email: req.body.email,
// password: hashedPassword };
//     users.push(user);

//     // Создание и отправка JWT токена
//     const token = jwt.sign({ id: user.id }, 'jwtsecret');
//     res.header('auth-token', token).send(token);
//   } catch {
//     res.status(500).send();
//   }
// });

// // Авторизация
// app.post('/login', async (req, res) => {
//   const user = users.find(user => user.email === req.body.email);
//   if (!user) {
//     return res.status(400).send('Invalid email or password');
//   }

//   // Проверка пароля
//   const validPassword = await bcrypt.compare(req.body.password, user.password);
//   if (!validPassword) {
//     return res.status(400).send('Invalid email or password');
//   }

//   // Создание и отправка JWT токена
//   const token = jwt.sign({ id: user.id }, 'jwtsecret');
//   res.header('auth-token', token).send(token);
// });

// app.listen(3000, () => console.log('Server is running...'));
