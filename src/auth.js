// src/auth.js

const passport = require('passport');
const BearerStrategy = require('passport-http-bearer').Strategy;
const { CognitoJwtVerifier } = require('aws-jwt-verify');
const logger = require('./logger');

// Create a Cognito JWT Verifier
const jwtVerifier = CognitoJwtVerifier.create({
  userPoolId: process.env.AWS_COGNITO_POOL_ID, // from your .env
  clientId: process.env.AWS_COGNITO_CLIENT_ID, // from your .env
  tokenUse: 'id', // Identity Token
});

// Log that auth is configured
logger.info('Configured to use AWS Cognito for Authorization');

// Preload Cognito public keys (JWKS)
jwtVerifier
  .hydrate()
  .then(() => {
    logger.info('Cognito JWKS successfully cached');
  })
  .catch((err) => {
    logger.error({ err }, 'Unable to cache Cognito JWKS');
  });

// Passport strategy
module.exports.strategy = () =>
  new BearerStrategy(async (token, done) => {
    try {
      // Verify JWT with Cognito
      const user = await jwtVerifier.verify(token);
      logger.debug({ user }, 'verified user token');

      // Only return user email for now
      done(null, user.email);
    } catch (err) {
      logger.error({ err, token }, 'could not verify token');
      done(null, false);
    }
  });

// Middleware function to use in routes
module.exports.authenticate = () => passport.authenticate('bearer', { session: false });
