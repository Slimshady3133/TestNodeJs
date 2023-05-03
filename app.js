require('dotenv').config();

const express = require('express');
const winston = require('winston');
const { connect } = require('./databaseCheck');
const { sequelize } = require('./db/models');
const config = require('./config/config');

const app = express();

const PORT = process.env.PORT || 5000;

const authRoute = require('./routes/auth.routes');

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

app.use('/api/auth', authRoute);
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
