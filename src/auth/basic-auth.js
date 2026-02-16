const passport = require('passport');
const { BasicStrategy } = require('passport-http');

const authorize = require('./auth-middleware');

passport.use(
  new BasicStrategy((email, password, done) => {
    if (email === 'test-user1@fragments-testing.com' && password === 'test-password1') {
      return done(null, email);
    }
    return done(null, false);
  })
);

module.exports = () => authorize('http');
