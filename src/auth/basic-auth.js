const passport = require('passport');
const { BasicStrategy } = require('passport-http');

const authorize = require('./auth-middleware');

passport.use(
  'http',
  new BasicStrategy((email, password, done) => {
    if (email === 'test-user1@fragments-testing.com' && password === 'password1') {
      return done(null, email);
    }

    if (email === 'test-user2@fragments-testing.com' && password === 'password2') {
      return done(null, email);
    }

    return done(null, false);
  })
);

module.exports = () => authorize('http');
