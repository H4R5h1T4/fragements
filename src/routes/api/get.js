// src/routes/api/get.js
const express = require('express');

const router = express.Router();

/**
 * Simple API root (GET /v1)
 * Keep it small: it should NOT respond to /v1/fragments or POST requests.
 */
router.get('/', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

module.exports = router;
