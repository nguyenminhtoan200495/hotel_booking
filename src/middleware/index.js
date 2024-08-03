const authJwt = require('./authJwtMiddleware');
const verifySignUp = require('./verifySignUp');

module.exports = {
  authJwt,
  verifySignUp,
};
