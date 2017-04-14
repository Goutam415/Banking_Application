
var logger = require('winston');
var request = require('request');
var mongoose = require('mongoose');
var Center = mongoose.model('Center');
var Joi = require('joi');
/**
 * fetch all sms templates
 */
exports.getSMS = function(req, res, next) {
  logger.debug('center : settings: entered get sms templates', req);
  request.get('http://localhost:3011/media/api/template/listsms?centerId=' + req.query.centerId, function (err, response, body) {
    if (err) {
      res.send(err);
    } else {
      res.send(JSON.parse(body));
    }
  });
};
/**
 * fetch all email templates
 */
exports.getEmail = function(req, res, next) {
  logger.debug('center : settings: entered get email templates', req);
  request.get('http://localhost:3011/media/api/template/listemail?centerId=' + req.query.centerId, function (err, response, body) {
    if (err) {
      res.send(err);
    } else {
      res.send(JSON.parse(body));
    }
  });
};
/**
 * update all sms templates for a particular center
 */
exports.updateSMS = function (req, res, next) {
  logger.debug('center : settings: entered update sms templates', req);
  var callback = function (error, response, body) {
    if (error) {
      res.send({ status: 'failure', reason: error });
    } else {
      res.send({ status: 'success' });
    }
  };
  request({
    method: 'PUT',
    url: 'http://localhost:3011/media/api/templates/updatesms',
    json: req.body,
    callback
  });
};
/**
 * update all email templates for a particular center
 */
exports.updateEmail = function (req, res, next) {
  logger.debug('center : settings: entered update email templates', req);
  var callback = function (error, response, body) {
    if (error) {
      res.send({ status: 'failure', reason: error });
    } else {
      res.send({ status: 'success' });
    }
  };
  request({
    method: 'PUT',
    url: 'http://localhost:3011/media/api/templates/updateemail',
    json: req.body,
    callback
  });
};

/**
 * update all settings for  center
 */
// exports.updateSettings = function (req, res, next) {
//   logger.debug('center : settings: entered update setttings', req);
//   var callback = function (error, response, body) {
//     if (error) {
//       res.send({ status: 'failure', reason: error });
//     } else {
//       res.send({ status: 'success' });
//     }
//   };
//   request({
//     method: 'PUT',
//     url: 'http://localhost:3011/center/api/communication/updatesettings',
//     json: req.body,
//     callback
//   });
// };

// exports.updateSettingsValidations = {
//   body: {

//     'remainder_sms': {
//      // 'before_sms_flag': Joi.boolean().required(),
//       'before_sms': Joi.date().iso(),
//      // 'on_sms_flag': Joi.boolean().required,
//       'on_sms': Joi.date().iso()
//     },
//     'remainder_email': {
//      // 'before_email_flag': Joi.boolean().required(),
//       'before_email': Joi.date().iso(),
//       //'on_email_flag': Joi.boolean().required(),
//       'on_email': Joi.date().iso()
//     }
//   }
// };
exports.settingsValidations = {
  body: {
    'centerId': Joi.string().required(),
    'sms': Joi.object(),
    'email': Joi.object()
  }
};

exports.updateSettingsBox = function(req, res, next) {
  logger.debug('center : settings: entered update communicationsettings media rules', req);
  Center.updateSettings(req.body, function(err, data) {
    if (err) {
      logger.info('center: settings : communicationsettings media rules: failure', err);
      res.status(403).send({ status: 'failure', message: err });
    } else {
      logger.info('center: settings : update center settings checkbox: success');
        // delete data._doc._id;
        // delete data._doc.__v;
      res.status(200).send({ status: 'success', data: data });
    }
  });
};
