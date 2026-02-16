const passport = require('passport');
const { CognitoJwtVerifier } = require('aws-jwt-verify');
const BearerStrategy = require('passport-http-bearer').Strategy;

const logger = require('../logger');
const authorize = require('./auth-middleware');
const hash = require('../hash');

let strategy;

if (process.env.NODE_ENV !== 'test') {
  if (!(process.env.AWS_COGNITO_POOL_ID && process.env.AWS_COGNITO_CLIENT_ID)) {
    throw new Error('missing expected env vars: AWS_COGNITO_POOL_ID and AWS_COGNITO_CLIENT_ID');
  }

  const jwtVerifier = CognitoJwtVerifier.create({
    userPoolId: process.env.AWS_COGNITO_POOL_ID,
    clientId: process.env.AWS_COGNITO_CLIENT_ID,
    tokenUse: 'id',
  });

  jwtVerifier.hydrate().then(() => {
    logger.info('Cognito JWKS successfully cached');
  });

  strategy = new BearerStrategy(async (token, done) => {
    try {
      const payload = await jwtVerifier.verify(token);

      if (!payload || !payload.email) {
        logger.warn({ payload }, 'JWT verified but email claim missing');
        return done(null, false);
      }

      return done(null, payload.email);
    } catch (err) {
      logger.warn({ err }, 'JWT verification failed');
      return done(null, false);
    }
  });

  passport.use(strategy);

  module.exports = () => authorize('bearer');
} else {
  module.exports = () => {
    return (req, res, next) => {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Basic ')) {
        return res.status(401).end();
      }

      const base64 = authHeader.split(' ')[1];
      const decoded = Buffer.from(base64, 'base64').toString();
      const [email, password] = decoded.split(':');

      if (email === 'test-user1@fragments-testing.com' && password === 'test-password1') {
        req.user = hash(email);
        return next();
      }

      return res.status(401).end();
    };
  };
}
