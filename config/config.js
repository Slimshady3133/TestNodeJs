require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const compression = require('compression');
const hpp = require('hpp');
const helmet = require('helmet');

const { createLogger, transports } = require('winston');
const authMiddleware = require('../middleware/auth');

const logger = createLogger({
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
  ],
});

if (!process.env.CLIENT_URL) {
  throw new Error('CLIENT_URL environment variable is missing.');
}

const corsOptions = {
  origin: process.env.CLIENT_URL,
  credential: true,
};

const serverConfig = (app) => {
  app.use(morgan('dev'));
  app.use(cors(corsOptions));
  app.use(helmet());
  app.use(helmet.xssFilter());
  app.use(helmet.frameguard({ action: 'deny' }));
  app.use(helmet.ieNoOpen());
  app.use(helmet.hidePoweredBy({ setTo: 'PHP 7.4.3' }));
  app.use(hpp());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static('public'));
  app.use(compression());
  app.disable('x-powered-by');
  app.use(authMiddleware);

  app.use((err, req, res, next) => {
    logger.error(err.stack);
    res.status(500).send('Something broke!');
    next();
  });

  app.use((req, res, next) => {
    res.status(404).send('Sorry cant find that!');
    next();
  });
};

module.exports = serverConfig;
