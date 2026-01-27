const express = require('express');
const router = express.Router();

const authenticate = require('../../auth/cognito');
const get = require('./get');

/**
 * The main entry-point for the v1 version of the fragments API.
 */

// GET /v1/fragments
router.get('/fragments', authenticate(), get);

module.exports = router;
