// src/app.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const passport = require('passport');

const logger = require('./logger');
const pino = require('pino-http')({ logger });

const app = express();

// Core middleware
app.use(pino);
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());
app.use(passport.initialize());

// Routes
app.use('/', require('./routes'));

// ---- TEST ROUTES ----
if (process.env.NODE_ENV === 'test') {
  app.get('/error-test', (req, res, next) => {
    const err = new Error('test error');
    err.status = 500;
    next(err);
  });

  app.get('/success-test', (req, res) => {
    res.status(200).json({ status: 'success' });
  });
}

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    error: {
      code: 404,
      message: 'not found',
    },
  });
});


app.use((err, req, res, _next) => {
 
  void _next;

  const status = err.status || 500;
  const message = err.message || 'unable to process request';

  if (status >= 500) {
    logger.error({ err }, 'Error processing request');
  } else {
    logger.warn({ err }, 'Client error');
  }

  res.status(status).json({
    status: 'error',
    error: {
      code: status,
      message,
    },
  });
});

module.exports = app;
