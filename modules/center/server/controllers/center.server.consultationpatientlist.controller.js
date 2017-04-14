var logger = require('winston');
var request = require('request');
var path = require('path');
var globalConfig = require(path.resolve('./config/config.js'));
var Joi = require('joi');


/**
 * validate Patinet List
 */
exports.validatePatientList = {
  query: {
    'ownerID': Joi.string().required()
  }
};


/**
 * fetch Patients List
 */
exports.getPatientList = function(req, res, next) {
  logger.debug('consulation : patientlist: entered get patientlist', req);
  request.get(globalConfig.baseUrls.patient.url + '/api/get?ownerID=' + req.query.ownerID, function (err, response, body) {
    if (err) {
      res.send(err);
    } else {
      res.send(JSON.parse(body));
    }
  });
};
