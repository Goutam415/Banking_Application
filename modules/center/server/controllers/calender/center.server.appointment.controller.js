// use strict
var logger = require('winston');
var path = require('path');
var mongoose = require('mongoose');
var Appointment = mongoose.model('Appointment');
var Joi = require('joi');

/**
 *  validate appointment query param
 */
exports.validateSaveAppointment = {
  body: {
    'idPatient': Joi.string().required(),
    'idDoctor': Joi.string().required(),
    'title': Joi.string(),
    'start': Joi.date().timestamp('javascript'),
    'end': Joi.date().timestamp('javascript'),
    'allDay': Joi.boolean(),
    'type': Joi.any().valid(['emergency', 'normal']),
    'calColor': Joi.string(),
    'info': Joi.string(),
    'status': Joi.any().valid(['created', 'arrived', 'waiting', 'progress', 'completed']),
    'idCenter': Joi.string().required(),
    'idCustomer': Joi.string()
  }
};

/**
 * controller function to create appointment
 */
exports.createAppointment = function(req, res, next) {
  logger.info('initialing appointment' + req.body);

  var appointment = new Appointment(req.body);
  appointment.save(function(err, data, numrow) {
    if (!err) {
      logger.debug('Success');
      res.status(200).send({ status: 'success', data: data });

    } else {
      res.status(403).send({ status: 'failure', msg: err });
    }
  });
};

/**
 * validate get appointment request
 */
exports.validateGetAppointment = {
  query: {
    'centerId': Joi.string().required()
  }
};

/**
 *  get appointment based on center
 */
exports.getAppointment = function (req, res, next) {
  logger.info('fetch appoinment by center id by user with center id' + req.query.centerId);
  Appointment.find({ 'idCenter': req.query.centerId }, function (err, docs) {
    if (!err) {
      logger.info('sucessfullly fetched appointment data by centerid' + req.query.centerId);
      res.status(200).send({ status: 'success', data: docs });
    } else {
      logger.info('error while fetching data for center' + req.query.centerId);
      res.status(400).send({ status: 'failure', msg: err });
    }
  });
};
