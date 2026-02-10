const passport = require('passport');
const { CognitoJwtVerifier } = require('aws-jwt-verify');
const BearerStrategy = require('passport-http-bearer').Strategy;
const logger = require('../logger');

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
      done(null, payload);
    } catch (err) {
      logger.warn({ err }, 'JWT verification failed');
      done(null, false);
    }
  });

  passport.use(strategy);

  module.exports = () => passport.authenticate('bearer', { session: false });
} else {
  module.exports = () => {
    return (req, res, next) => {
      const auth = req.headers.authorization;

      if (!auth || !auth.startsWith('Basic ')) {
        return res.status(401).end();
      }

      const base64 = auth.split(' ')[1];
      const decoded = Buffer.from(base64, 'base64').toString();
      const [email, password] = decoded.split(':');

      if (email === 'test-user1@fragments-testing.com' && password === 'test-password1') {
        req.user = { email };
        return next();
      }

      return res.status(401).end();
    };
  };
}
