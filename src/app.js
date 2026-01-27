// src/app.js

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const passport = require('passport'); // <-- import passport

// author and version from package.json
const { author, version } = require('../package.json');

const logger = require('./logger');
const pino = require('pino-http')({
  logger,
});

// Import our authentication strategy
const authenticate = require('./auth'); // <-- this is your src/auth.js

// Create Express app
const app = express();

// Use pino logging middleware
app.use(pino);

// Use helmet for security
app.use(helmet());

// Use CORS so front-end can talk to backend
app.use(cors());

// Use compression for faster responses
app.use(compression());

// Initialize Passport and attach JWT strategy
passport.use(authenticate.strategy());
app.use(passport.initialize());

// Now all routes will be in src/routes
// Root route (health check) is now moved to src/routes/index.js
app.use('/', require('./routes'));

// 404 middleware for unknown routes
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    error: {
      message: 'not found',
      code: 404,
    },
  });
});

// Error-handling middleware
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'unable to process request';

  if (status > 499) {
    logger.error({ err }, 'Error processing request');
  }

  res.status(status).json({
    status: 'error',
    error: {
      message,
      code: status,
    },
  });
});

module.exports = app;
