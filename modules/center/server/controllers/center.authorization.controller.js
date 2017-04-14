var _ = require('lodash');

exports.isAuthorized = function(req, res, next) {
  if (_.get(req, 'session.userDetails._id')) {
    next();
  } else {
    res.status(401).send();
  }

};
