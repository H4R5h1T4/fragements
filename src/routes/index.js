const express = require('express');
const authenticate = require('../auth');

const router = express.Router();

// Protect API routes
router.use('/v1', authenticate(), require('./api'));

// Health check route
router.get('/', (req, res) => {
  res.setHeader('Cache-Control', 'no-cache');
  res.status(200).json({
    status: 'ok',
    author: require('../../package.json').author,
    githubUrl: 'https://github.com/YOUR_GITHUB_USERNAME/fragments',
    version: require('../../package.json').version,
  });
});

module.exports = router;
