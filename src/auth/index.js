if (process.env.NODE_ENV === 'test') {
  module.exports = function () {
    return (req, res, next) => {
      req.user = { id: 'test-user' }; // fake user
      next();
    };
  };

  module.exports.strategy = () => null;
} else {
  module.exports = require('./cognito');
}
