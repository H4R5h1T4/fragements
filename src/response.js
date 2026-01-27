// Success response
module.exports.createSuccessResponse = function (data) {
  return {
    status: 'ok',
    ...data, // spreads the data into the response
  };
};

// Error response
module.exports.createErrorResponse = function (code, message) {
  return {
    status: 'error',
    error: {
      code: code,
      message: message,
    },
  };
};
