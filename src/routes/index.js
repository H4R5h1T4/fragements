const express = require('express');
const authenticate = require('../auth');

const router = express.Router();

// Pull from package.json once
const { author, version, repository } = require('../../package.json');

function normalizeRepoUrl(repo) {
  const url = typeof repo === 'string' ? repo : repo?.url;

  if (!url) return '';

  // Remove git+ prefix and trailing .git
  return url.replace(/^git\+/, '').replace(/\.git$/, '');
}

// Protect API routes
router.use('/v1', authenticate(), require('./api'));

// Health check route
router.get('/', (req, res) => {
  res.setHeader('Cache-Control', 'no-cache');
  res.status(200).json({
    status: 'ok',
    author,
    githubUrl: normalizeRepoUrl(repository),
    version,
  });
});

module.exports = router;
