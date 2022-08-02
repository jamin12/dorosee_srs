const httpStatus = require('http-status');
const cutomError = require('../util/Error/customError');
const { roleRights } = require('../config/roles');

const verifyCallback = (req, resolve, reject, requiredRights) => {
  if (!req.isAuthenticated()) {
    return reject(new cutomError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
  }
  // req.user = user;

  if (requiredRights.length) {
    const userRights = roleRights.get(req.user.role);
    let hasRequiredRights = false;
    requiredRights.forEach((requiredRight) => {
      if(userRights.includes(requiredRight)){
        hasRequiredRights = true;
      }});
    if (!hasRequiredRights) {
      return reject(new cutomError(httpStatus.FORBIDDEN, 'Forbidden'));
    }
  }

  resolve();
};

const auth =
  (...requiredRights) =>
  async (req, res, next) => {
    return new Promise((resolve, reject) => {
      verifyCallback(req,resolve,reject,requiredRights)(req, res, next);
    })
      .then(() => next())
      .catch((err) => next(err));
  };

module.exports = auth;
