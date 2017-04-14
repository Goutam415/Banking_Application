var logger = require('winston'),
  path = require('path'),
  mongoose = require('mongoose'),
  Roles = mongoose.model('Roles'),
  Groups = mongoose.model('Groups'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  Joi = require('joi'),
  _ = require('lodash');

/**
 *  get permissions form array of Roles and Groups models.
 */
const getPermissionsFromGroups = function(groups) {
  return _.uniq(_.flattenDeep(_.map(groups, function(item) {
    return item.toObject().permissions;
  })));
};

/**
 * get permissions by roles
 * @param roles - Array or String.
 * @parma cb    - callback after fetching roles.
 */
exports.getPermessionsByRoles = function(roles, cb) {
  var rolesArr = [];

  if (!roles) {
    return cb('no roles');
  }

  if (!_.isArray(roles)) {
    rolesArr.push(roles);
  } else {
    rolesArr = roles;
  }

  logger.info('fetching roles for' + roles);

  Roles.find({ name: { $in: rolesArr } }, function(err, result) {
    if (err) {
      logger.info('error while fetching' + roles);
      cb(err);
    } else {
      logger.info('roles fetch successful');
        // get all groups from roles models
      var groups = _.uniq(_.flattenDeep(_.map(result, function(item) {
        return item.toObject().groups;
      })));
      logger.info('all groups' + groups);
      // get permissions from result
      var permissions = getPermissionsFromGroups(result);
      if (groups.length > 0) {
        logger.info('fetching permissions from all groups');
        // find permissions in groups
        Groups.find({ name: { $in: groups } }, function(err, groupPermissions) {
          if (err) {
            logger.info('fetching permissions failed');
            cb(err);
          } else {
            permissions = _.union(permissions, getPermissionsFromGroups(groupPermissions));
            logger.info('fetching permissions sucess' + permissions);
            cb(null, permissions);
          }
        });
      } else {
        cb(null, permissions);
      }

    }

  });

};
