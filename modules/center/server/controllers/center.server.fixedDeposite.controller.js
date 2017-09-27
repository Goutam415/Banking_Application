// use strict
var logger = require('winston'),
  path = require('path'),
  mongoose = require('mongoose'),
  Center = mongoose.model('Center'),
  AccountCreate = mongoose.model('AccountCreate'),
  TransactionIds = mongoose.model('TransactionId');
  Staff = mongoose.model('Staff'),
  Joi = require('joi'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  passport = require('passport'),
  util = require('../utils/utils'),
  rolesController = require('./center.server.roles.controller');
const globalConfig = require('../../../../config/config.js');
const request = require('request');

/** validate login params */
exports.validteLoginParams = {
  body: {
    'email': Joi.string().email().required(),
    'password': Joi.string().required()
  }
};

/**
 * login to center portal
 */
exports.login = function(req, res, next) {
  passport.authenticate('local-center', function(err, user, info) {
    if (err || !user) {
      res.status(400).send(info);
    } else {

      // Remove sensitive data before login
      user.password = undefined;
      user.salt = undefined;
      var a = user.email;
      // fetch permissions data for the user
      // rolesController.getPermessionsByRoles(user.role.toObject(), function(err, data) {
      //   if (err && !data) {
      //     logger.info('unable to get permissions');
      //     user.permissions = 'error while loading permissions try again';
      //   } else {
      //     user.permissions = data;
      //   }

      req.session.userDetails = user;
      // req.session.userDetails.defaultCenter = user.centerIds[0]._id;

      req.login(user, function(err) {
        if (err) {
          res.status(400).send(err);
        } else {
          res.json({ status: 'success' });
        }
        // });
      });
    }
  })(req, res, next);
};


/**
 * create Doctor
 */
exports.createDoctor = function(req, res, next) {
  logger.debug('doctor : entered create doctor', req);
  var doctor = new Staff(req.body);
  doctor.isDoctor = true;
  doctor.role = 'doctor';
  doctor.save(function(err, doctor) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      doctor._doc.origianlPassword = doctor.origianlPassword;
      // send doctor email with password
      request.post({
        url: globalConfig.baseUrls.media.url + '/api/sendemail',
        form: getStaffEmailParams(doctor)
      }, function(err, response) {
        if (err) {
          logger.debug('customer mail trigger failed');
        } else {
          logger.debug('email trigger successfull');
        }

      });

      res.status(200).send(doctor);
    }
  });
};


/**

 * create  staff
 */
exports.createStaff = function(req, res, next) {
  logger.debug('doctor : entered create doctor', req);
  var staffDetails = req.body;
  var staff = new Staff(staffDetails);
  staff.isDoctor = false;
  staff.save(function(err, staff) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {

      staff._doc.origianlPassword = staff.origianlPassword;
      // send doctor email with password
      request.post({
        url: globalConfig.baseUrls.media.url + '/api/sendemail',
        form: getStaffEmailParams(staff)
      }, function(err, response) {
        if (err) {
          logger.debug('customer mail trigger failed');
        } else {
          logger.debug('email trigger successfull');
        }

      });
      res.status(200).send(staff);
    }
  });
};


//  Create account query is here
exports.createFdAccount = function(req, res, next) {
  logger.debug('Creating your acccount pls wait....!!!', req);
  var createAccountDetails = new AccountCreate(req.body);
  var date = new Date();


// transaction ID generation function starts here
  var number = Math.random();
  number.toString(36);
  var id = number.toString(36).substr(2, 9);
  id = id.toLocaleUpperCase();
  id.length >= 9;
// transaction ID generation function ends here

  var accountNum = createAccountDetails.accountNumber;

  var fdAccountNumber1 = Date.now();
  var accountCreatorEmployeeId1 = createAccountDetails.fdAccount[0].accountCreatorEmployeeId;
  var transactionId1 = id;
  var transactionType1 = createAccountDetails.fdAccount[0].transactionType;
  var fdAmount1 = createAccountDetails.fdAccount[0].fdAmount;
  var rateOfInterest1 = createAccountDetails.fdAccount[0].rateOfInterest;
  var accountOpenDate1 = date;
  var accountCloseDate1 = createAccountDetails.fdAccount[0].accountCloseDate;
  var accountStatus1 = 'Active';
  // var durationOfAccount1 = 0;

  var FDAccounts = { fdAccountNumber: fdAccountNumber1, accountCreatorEmployeeId: accountCreatorEmployeeId1,
      transactionId: transactionId1, transactionType: transactionType1, fdAmount: fdAmount1, rateOfInterest: rateOfInterest1,
      accountOpenDate: accountOpenDate1, accountCloseDate: accountCloseDate1, accountStatus: accountStatus1
      // durationOfAccount: durationOfAccount1
 };



  AccountCreate.update({ accountNumber: accountNum }, { fdAmount: fdAmount1,
    isFDAccount: accountStatus1,
    $push: { fdAccount: FDAccounts } }).exec(function(err, data) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.status(200).send({ data: fdAmount1, msg: 'Fixed Deposit created Successfully' });
      }
    });
};


exports.closeFdAccount = function(req, res, next) {
  logger.debug('Preparing to close your acccount pls wait....!!!', req);

  var createAccountDetails = new AccountCreate(req.body);
  var date = new Date();

  // Calculation of total number of days for which account is maintained starts here.
  function date_checker(closeDate, actuallyCloseDate) {
    if(actuallyCloseDate.getFullYear() > closeDate.getFullYear()) {
      return true;
    }
    
    if(((actuallyCloseDate.getMonth() +1) >= (closeDate.getMonth() + 1)) && (actuallyCloseDate.getDate() >= closeDate.getDate())) {
      return true;
    }

    return false;
  }
  // Calculation of total number of days for which account is maintained ends here.

  // transaction ID generation function starts here
  function generateTransactionIds() {
    var number = Math.random();
    number.toString(36);
    var id = number.toString(36).substr(2, 9);
    id = id.toLocaleUpperCase();
    id.length >= 9;
    return id;
  }
  // transaction ID generation function ends here

  // function to calculate duration of account maintained starts here
  function days_between(date1, date2) {
        // The number of milliseconds in one day
        var ONE_DAY = 1000 * 60 * 60 * 24
        // Convert both dates to milliseconds
        var date1_ms = date1.getTime()
        var date2_ms = date2.getTime()
        // Calculate the difference in milliseconds
        var difference_ms = Math.abs(date1_ms - date2_ms)
        // Convert back to days and return
        return Math.round(difference_ms/ONE_DAY)
  }
  // function to calculate duration of account maintained ends here

  // function to calculate_total_amount to be returned starts here
  function calculate_interest(rateOfInterest, fdAmount) {
    var interestAmount = (rateOfInterest*fdAmount)/100;
    return interestAmount;
  }
  // function to calculate_total_amount to be returned ends here

 AccountCreate.findOne({ 'fdAccount.fdAccountNumber': req.body.accountNumber }, { 'fdAccount.fdAccountNumber.$': true }).exec(function(err, data) {
   if(err) {
    logger.info('Cannot find the account');
    return res.status(400).send({ message: errorHandler.getErrorMessage(err), msg: 'Cannot find the account' });
   } else {
     if(data.fdAccount[0].accountStatus == 'Closed') {
        logger.info('Account is already closed on : ' + data.fdAccount[0].actuallyAccountClosedDate);
        return res.status(400).send({ msg: 'Account is already closed on : ' + data.fdAccount[0].actuallyAccountClosedDate });
     } else {       
        var commissionAmountToBeDeducted = 0;
        var amountToBeReturned;
        var dateCheckResult = date_checker(data.fdAccount[0].accountCloseDate, date);

        if(!dateCheckResult) {
            commissionAmountToBeDeducted = calculate_interest(data.fdAccount[0].commissionPercentage, data.fdAccount[0].fdAmount);
            amountToBeReturned = data.fdAccount[0].fdAmount - commissionAmountToBeDeducted;
        } else {
            interestAmount = calculate_interest(data.fdAccount[0].rateOfInterest, data.fdAccount[0].fdAmount);
            amountToBeReturned = interestAmount + data.fdAccount[0].fdAmount;
        }
    
        AccountCreate.update({ 'fdAccount.fdAccountNumber': req.body.accountNumber }, { $set: { 
            'fdAccount.$.closingTransactionId' : generateTransactionIds(),
            'fdAccount.$.closingTransactionType' : createAccountDetails.fdAccount[0].transactionType,
            'fdAccount.$.accountStatus' : 'Closed',
            'fdAccount.$.commissionDeducted' : commissionAmountToBeDeducted,
            'fdAccount.$.actuallyAccountClosedDate' : date,
            'fdAccount.$.accountClosingEmployeeId' : createAccountDetails.fdAccount[0].accountClosingEmployeeId,
            'fdAccount.$.durationOfAccount': days_between(date, data.fdAccount[0].accountOpenDate),
            'fdAccount.$.totalAmountReturned': amountToBeReturned 
          }
        })
        .exec(function(err, data) {          
          if (err) {
            logger.info('Cannot find the account');
            return res.status(400).send({ message: errorHandler.getErrorMessage(err) });
          } else {
            logger.info(data);
            return res.status(200).send({ data: data, msg: 'Account Closed Successfully..!!' });
          }
        });  
      }
    }
  });
};










/** validate get doctor params */
exports.getDoctorsParams = {
  query: {
    'center': Joi.string().required()
  }
};

/**

 * get doctor list
 */
exports.getDoctor = function(req, res, next) {
  logger.debug('doctor list');
  Staff.find({ isDoctor: true, centerIds: req.query.center }).exec(function(err, staff) {
    if (!err) {
      logger.info('get doctor :  success');
      res.status(200).send({ status: 'success', doctor: staff });
    } else {
      logger.info('get doctor :  error');
      res.status(403).send({ status: 'failure', msg: staff });
    }
  });
};

exports.getStaff = function(req, res, next) {
  logger.debug('staff list');
  Staff.find({ isDoctor: false, centerIds: req.query.center }).exec(function(err, data) {
    if (!err) {
      logger.info('get staff :  success');
      res.status(200).send({ status: 'success', staff: data });
    } else {
      logger.info('get staff :  error');
      res.status(403).send({ status: 'failure', msg: data });
    }
  });
};

/**
 * update center with latest changes
 */
exports.updateCenter = function(req, res, next) {
  logger.debug('center : entered updated center', req);
  var dataToUpdate = req.body;
  var id = dataToUpdate.id;
  delete dataToUpdate.id;
  Center.update({ _id: id }, dataToUpdate, function(status, data) {
    if (!status) {
      logger.info('center : update center :  success');
      res.status(200).send({ status: 'success', data: data });
    } else {
      logger.info('center : update center :  error');
      res.status(403).send({ status: 'failure', msg: data });
    }
  });
};

/**
 * get center with by id
 */
exports.getCenter = function(req, res, next) {
  logger.debug('center : entered get center', req);
  // Center.findById(req.query._id, function(status, data) {
  Center.find({ _id: req.query.centerId }).exec(function(err, data) {
    if (!err) {
      logger.info('center : get center :  success');
      res.status(200).send({ status: 'success', data: data });
    } else {
      logger.info('center : get center :  error');
      res.status(403).send({ status: 'failure', msg: data });
    }
  });
};
/**
 * create center
 */
exports.createCenter = function(req, res, next) {
  logger.debug('center : entered create center', req);
  var center = new Center(req.body);
  center.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.status(200).send(center);
    }
  });
};
/**
 * update profile image of center
 */
exports.updateProfileImage = function(req, res, next) {
  var matches = req.body.img.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  var imageBuffer = {};

  if (matches.length !== 3) {
    return new Error('Invalid input string');
  }

  imageBuffer.type = matches[1];
  imageBuffer.data = new Buffer(matches[2], 'base64');
  // Regular expression for image type:
  // This regular image extracts the "jpeg" from "image/jpeg"
  var imageTypeRegularExpression = /\/(.*?)$/;
  // Generate random string
  // This variable is actually an array which has 5 values,
  // The [1] value is the real image extension
  var imageTypeDetected = imageBuffer.type.match(imageTypeRegularExpression);

  // Save decoded binary image to disk
  require('fs').writeFile(path.join(__dirname, '../../../../public/uploads/' + req.body.id + '.jpg'), imageBuffer.data,
    function(err) {
      if (err) {
        res.status(400).send({
          status: 'error',
          msg: 'something went wrong while uploading image'
        });
      } else {
        Staff.update({ _id: req.body.id }, { pic: req.body.id + '.jpg' }, function(err, doc) {
          console.log(err);
        });
        res.status(200).send({
          status: 'success',
          msg: 'image uploaded'
        });

      }
    });
};
/**
 * validation for updaate center timings
 */
exports.updateCenterTimeValidations = {
  body: {
    'sunday': {
      'startTime': Joi.string(),
      'endTime': Joi.string()
    },
    'monday': {
      'startTime': Joi.string(),
      'endTime': Joi.string()
    },
    'tuesday': {
      'startTime': Joi.string(),
      'endTime': Joi.string()
    },
    'wednesday': {
      'startTime': Joi.string(),
      'endTime': Joi.string()
    },
    'thursday': {
      'startTime': Joi.string(),
      'endTime': Joi.string()
    },
    'friday': {
      'startTime': Joi.string(),
      'endTime': Joi.string()
    },
    'saturday': {
      'startTime': Joi.string(),
      'endTime': Joi.string()
    }
  }
};
/**
 * update center timings based on centerId
 */
exports.updateCenterTime = function(req, res, next) {
  logger.debug('center : settings: entered update emr', req);
  Center.updateCenterTimings(req.body, function(err, data) {
    if (err) {
      logger.info('center: settings : update EMR: failure', err);
      res.status(403).send({ status: 'failure', message: err });
    } else {
      logger.info('center: settings : update EMR: success');
      // delete data._doc._id;
      // delete data._doc.__v;
      res.status(200).send({ status: 'success', data: data });
    }
  });
};

/**
 * get customer email template
 */
function getStaffEmailParams(staff) {
  var password = staff.origianlPassword;
  var content = '<b>Congrats, Your Registration is successfull on trueapps !!!!</b><br/>password: ' + password;
  var subject = 'Congrats ' + staff.name + ' , Your Registration is successfull';
  var email = staff.email;

  return {
    recipint: email,
    content: content,
    subject: subject
  };
}


exports.updateCenterTimeValidations = {
  body: {
    'sunday': {
      'startTime': Joi.string()
    },
    'monday': {
      'startTime': Joi.string()
    },
    'tuesday': {
      'startTime': Joi.string()
    },
    'wednesday': {
      'name': Joi.string()
    },
    'thursday': {
      'name': Joi.string()
    },
    'friday': {
      'name': Joi.string()
    },
    'saturday': {
      'default_temperature_unit': Joi.date().format('YYYY/MM/DD')
    }
  }
};
