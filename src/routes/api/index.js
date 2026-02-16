const express = require('express');
const router = express.Router();

const authenticate = require('../../auth');

// Protect everything in /v1 with auth
router.use(authenticate());

// Routes
router.use('/', require('./get'));
router.use('/', require('./fragments'));

module.exports = router;
