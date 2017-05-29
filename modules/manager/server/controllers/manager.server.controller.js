'use strict';

/**
 * Module dependencies
 */

var path = require('path'),
  async = require('async'),
  config = require('../config/config'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  logger = require('winston'),
  mongoose = require('mongoose'),
  manager = mongoose.model('manager'),
  Center = mongoose.model('Center'),
  SalesAdmin = mongoose.model('SalesAdmin'),
  CityMaster = mongoose.model('CityMaster'),
  Roles = mongoose.model('Roles'),
  passport = require('passport');
const globalConfig = require('../../../../config/config.js');
const request = require('request');

/**
 * create manager
 */
exports.createmanager = function(req, res, next) {
  logger.debug('manager : create manager', req);
  var managerModel = new manager(req.body.users);
  var center = req.body.center;
  var ownerDetails = req.body.ownerDetails;
  async.waterfall([
    // save cusotmer
    function(callback) {
      addmanager(managerModel, callback);
    },
    // create staff as owner
    function(manager, callback) {
      addStaff(manager, ownerDetails, callback);
    },
    // save ownner
    function(manager, owner, callback) {
      addCenter(manager, owner, center, callback);
    },
    // update center id in manager
    function(manager, owner, center, callback) {
      var cusotmerId = manager.id;
      var centerId = center._id;
      var ownerId = owner._id;

      manager.findByIdAndUpdate(cusotmerId, { $push: { centerIds: centerId }, idOwner: ownerId }, function(err, update) {
        if (err) {
          callback(err);
        } else {
          logger.info('update center success');
          callback(null, manager, owner, center);
        }
      });
    },
    function(manager, owner, center, callback) {
      var data = {
        id: owner._id,
        centerId: center._id
      };
      request.put({ url: globalConfig.baseUrls.manager.url + '/api/update/staff/center',
                form: data },
                function (err, response) {
                  if (err) {
                    callback(err);
                  } else {
                    logger.info('update staff success');
                    callback(null, manager, owner, center);
                  }
                });
    }],
    // update ownnerId in center
    function(err, manager, owner, center) {
      logger.debug('callback after creation of manager');
      if (err) {
        res.status(400).send(err);
      } else {
        // send manager email
        request.post({
          url: globalConfig.baseUrls.media.url + '/api/sendemail',
          form: getStaffEmailParams(owner)
        }, function(err, response) {
          if (err) {
            logger.debug('manager mail trigger failed');
          } else {
            logger.debug('email trigger successfull');
          }

        });

        // send center email
        request.post({
          url: globalConfig.baseUrls.media.url + '/api/sendemail',
          form: getCenterEmailParams(center)
        }, function(err, response) {
          if (err) {
            logger.debug('email trigger failed');
          } else {
            logger.debug('email trigger successfull');
          }

        });
        res.json({ status: 'success' });
      }
    });
};

/**
 *  create additional center
 */
exports.createAdditionalCenter = function(req, res, next) {
  logger.debug('manager : create additional center ', req);
  var center = req.body;
  async.waterfall([
  // save center
    function(next) {
      request.post({ url: globalConfig.baseUrls.center.url + '/api/create/center',
                    form: center },
                    function(err, res) {
                      if (err) {
                        next(err);
                      } else {
                        next(null, center.idmanager, JSON.parse(res.body));
                      }

                    });
    },
    // update manager with new center id
    function(manager, center, next) {
      var centerId = center._id;
      manager.findByIdAndUpdate(manager, { $push: { centerIds: centerId } }, function(err, update) {
        if (err) {
          next(err);
        } else {
          logger.info('update center success');
          next(null, center, manager);
        }
      });
    },
    // uodate in login with additionla center
    function(center, manager, callback) {
      var data = {
        id: center.idOwner,
        centerId: center._id
      };
      request.put({ url: globalConfig.baseUrls.center.url + '/api/update/staff/center',
                form: data },
                function (err, response) {
                  if (err) {
                    callback(err);
                  } else {
                    logger.info('update staff success');
                    callback(null, center, manager, response);
                  }
                });
    }
  ],
    function(err, center, manager) {
      logger.debug('center created now sending mail');
      if (err) {
        res.status(400).send(err);
      } else {
        // send center email
        request.post({
          url: globalConfig.baseUrls.media.url + '/api/sendemail',
          form: getCenterEmailParams(center)
        }, function(err, response) {
          if (err) {
            logger.debug('email trigger failed');
          } else {
            logger.debug('email trigger successfull');
          }

        });
        res.json({ status: 'success' });
      }
    }
  );
};

/**
 * get center email template
 */
function getCenterEmailParams(center) {
  var pin = center.pin;
  var url = globalConfig.baseUrls.center.url + '#center=' + center.id;
  var content = '<b>Congrats Center ' + center.centerName + ' registration is successfull on eManageHealth!!!!</b><br/>pin:' + pin +
     '<br/> portal url : <a href=' + url + '>' + url + '</a>';
  var subject = 'Congrats ' + center.centerName + 'registration is successfull';
  var email = center.centerEmail;

  return {
    recipint: email,
    content: content,
    subject: subject
  };
}

/**
 * get manager email template
 */
function getStaffEmailParams(staff) {
  var password = staff.origianlPassword;
 // var url = globalConfig.baseUrls.center.url + '#cusotmer=' + manager.id;
  var content = '<b>Congrats, Your Registration is successfull on eManageHealth!!!!</b><br/>password:' + password;
  var subject = 'Congrats ' + staff.name + ', Your Registration is successfull';
  var email = staff.email;

  return {
    recipint: email,
    content: content,
    subject: subject
  };
}

/**
 * add center
 */
function addCenter(manager, owner, center, callback) {
  center.idOwner = owner._id;
  center.idmanager = manager.id;
  request.post({ url: globalConfig.baseUrls.center.url + '/api/create/center',
                form: center },
                function (err, response) {
                  if (err) {
                    callback(err);
                  } else {
                    callback(null, manager, owner, JSON.parse(response.body));
                  }
                });
}

/**
 * add staff to cusotmer
 */
function addStaff(manager, onwerDetails, callback) {
  onwerDetails.idmanager = manager.id;
  request.post({ url: globalConfig.baseUrls.center.url + '/api/center/staff/create',
                 form: onwerDetails },
                function (err, response) {
                  if (err) {
                    callback(err);
                  } else {
                    callback(null, manager, JSON.parse(response.body));
                  }

                });
}
/*
* save manager details to Db.
*/
function addmanager(manager, callback) {
  logger.info('saving cusotmer ::', manager);
  manager.save(function(err, data) {
    if (err) {
      logger.debug('error while saving manager' + err);
      callback(err, null);
    } else {
      callback(null, data);
    }
  });
}


/**
 * List manager
 */
exports.listmanager = function (req, res, next) {
  logger.debug('manager: getting list of manager', req);
  manager.find({}, { _id: 0, __v: 0 })
  .populate('idsubscription', '-_id -__v')
  .populate('idaddress', '-_id -__v')
  .populate('centerIds', '-_id -__v')
  .lean()
  .exec(function (err, manager) {
    if (err) {
      res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(manager);
    }
  });
};


exports.createCenter = function (req, res, next) {
  var manager = new manager(req.body.manager);
  var center = new Center(req.body.center);
  var subscription_name = req.body.subscriptionname;
 // var address = new Address(req.body.address);
};

/**
 * get subscription details
 **/
exports.getSubscriptionDetails = function (req, res, next) {


};

/**
 * sales login
**/

exports.saleLogin = function saleLogin(req, res, next) {
  logger.debug('inside sale login ::', req);
  passport.authenticate('local-manager', function (err, user, info) {
    if (err || !user) {
      res.status(400).send(info);
    } else {
      // Remove sensitive data before login
      user.password = undefined;
      user.salt = undefined;
      req.session.userDetails = user;
      req.login(user, function (err) {
        if (err) {
          res.status(400).send(err);
        } else {
          res.json(user);
        }
      });
    }
  })(req, res, next);
};

/**
 *  get user details
 */
exports.getUser = function (req, res, next) {
  logger.info('get user details');
  if (req.session.userDetails) {
    res.json(req.session.userDetails);
  } else {
    res.status(400).send('error while fetching user details');
  }
};

/**
 *  get city list using state
 */
exports.getCity = function (req, res, next) {
  logger.debug('get city list using state');
  if (req.query.state) {
    CityMaster.find({ StateId: parseInt(req.query.state, 10) }).exec(function(err, city) {
      if (err) {
        res.status(400).send('error while fetching city');
      } else {
        res.json(city);
      }
    });

  } else {
    res.status(400).send('error while fetching city');
  }
};

/**
 *  get roles from roles collection
 */
// Prescriptions.find({ centerId: req.query.center }).distinct('drugType', function(err, data, numrow)
exports.getRoles = function (req, res, next) {
  logger.debug('get roles list using roles collection');

  Roles.find({}, { 'name': 1, '_id': 0 }, function(err, data) {
    if (err) {
      res.status(400).send('error while fetching roles');
    } else {
      res.json(data);
    }
  });
};
