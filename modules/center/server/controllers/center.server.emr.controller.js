// use strict
var logger = require('winston');
var EMR = require('../models/center.server.emr.model.js');
var Joi = require('joi');
/**
 * update EMR or create new one if doesn't exist for the particular center id
 */
exports.update = function(req, res, next) {
  logger.debug('center : settings: entered update emr', req);
  EMR.update(req.body, function(err, data) {
    if (err) {
      logger.info('center: settings : update EMR: failure', err);
      res.status(403).send({ status: 'failure', message: err });
    } else {
      logger.info('center: settings : update EMR: success');
      delete data._doc._id;
      delete data._doc.__v;
      res.status(200).send({ status: 'success', data: data });
    }
  });
};

/**
 * Fetch EMR for a particular center id
 */
exports.getEMR = function (req, res, next) {
  logger.debug('center : settings: entered get emr', req);
  EMR.getAllEMRForCenter(req.query.centerId, function(err, emr) {
    if (err) {
      res.status(403).send({ status: 'failure', message: err });
    } else {
      res.status(200).send({ status: 'success', data: emr });
    }
  });
};

/**
 * Edit a single EMR for a particular center id
 */
exports.editEMR = function (req, res, next) {
  logger.debug('center : settings: entered edit emr', req);
  EMR.edit(req.body, function (err, emr) {
    if (err) {
      res.status(403).send({ status: 'failure', message: err });
    } else {
      res.status(200).send({ status: 'success', data: emr });
    }
  });
};

/**
 * validation params
 */
exports.postValidations = {
  body: {
    'centerId': Joi.string().required(),
    'observations': {
      'name': Joi.string().required()
    },
    'complaints': {
      'name': Joi.string().required()
    },
    'fileLabels': {
      'name': Joi.string().required()
    },
    'diagnoses': {
      'name': Joi.string().required()
    },
    'investigations': {
      'name': Joi.string().required()
    },
    'notes': {
      'name': Joi.string().required()
    },
    'vitals': {
      'default_temperature_unit': Joi.string()
    }
  }
};

exports.getValidations = {
  query: {
    'centerId': Joi.string().required()
  }
};

/**
 *
 */
exports.updateVital = function(req, res, next) {
  logger.debug('center : settings: entered update emrvital', req);
  EMR.updateVital(req.body, function(err, data) {
    if (err) {
      logger.info('center: settings : update EMR: failure', err);
      res.status(403).send({ status: 'failure', message: err });
    } else {
      logger.info('center: settings : update vital EMR: success');
    //   delete data._doc._id;
    //   delete data._doc.__v;
      res.status(200).send({ status: 'success', data: data });
    }
  });
};
