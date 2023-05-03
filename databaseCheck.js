require('dotenv').config();

const { createLogger, transports } = require('winston');
const { sequelize } = require('./db/models');

const logger = createLogger({
  transports: [new transports.Console()],
});

async function connect() {
  try {
    await sequelize.authenticate();
    logger.info('Connection has been established successfully.');
  } catch (err) {
    logger.error('Unable to connect to the database:', err);
  }
}

module.exports = { sequelize, connect };
