// src/routes/index.js
const express = require('express');
const { version, author } = require('../../package.json');
const { authenticate } = require('../auth');

const router = express.Router();

// Protect /v1/* routes
router.use('/v1', authenticate(), require('./api'));

// Health check route
router.get('/', (req, res) => {
  res.setHeader('Cache-Control', 'no-cache');
  res.status(200).json({
    status: 'ok',
    description: 'fragments service running normally',
    author,
    githubUrl: 'https://github.com/H4R5h1T4/fragments',
    version,
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
