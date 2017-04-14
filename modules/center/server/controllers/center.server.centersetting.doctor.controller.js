var logger = require('winston'),
  path = require('path'),
  mongoose = require('mongoose'),
  Staff = mongoose.model('Staff'),
  Joi = require('joi'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));


exports.setDoctorTimings = function(req, res, next) {
  logger.debug('doctor : Doctor timings', req);
  Staff.updatedoctorTimings(req.body, function(status, data) {
    if (status) {
      logger.info('Doctor : Added timings :  success');
      res.status(200).send({ status: 'success', data: data });
    } else {
      logger.info('Doctor : Added timings :  error');
      res.status(403).send({ status: 'failure', msg: data });
    }
  });

};

exports.setDoctorTimingsValidations = {
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

