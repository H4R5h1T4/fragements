// src/app.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const passport = require('passport');

const { author, version } = require('../package.json');
const logger = require('./logger');
const pino = require('pino-http')({ logger });

// Import authentication middleware
const authenticate = require('./auth'); // assume this is a function

const app = express();

// Middlewares
app.use(pino);
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json()); // parse JSON body
app.use(passport.initialize());

// Routes
app.use('/', require('./routes'));

// ---- TEST ONLY ROUTES ----
if (process.env.NODE_ENV === 'test') {
  // Route that triggers an error
  app.get('/error-test', (req, res, next) => {
    const err = new Error('test error');
    err.status = 500;
    next(err);
  });

  // Route that succeeds
  app.get('/success-test', (req, res) => {
    res.json({ status: 'success' });
  });
}

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    error: { message: 'not found', code: 404 },
  });
});

// Error-handling middleware
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'unable to process request';

  if (status >= 500) {
    logger.error({ err }, 'Error processing request');
  }

  res.status(status).json({
    status: 'error',
    error: { message, code: status },
  });
});

module.exports = app;
