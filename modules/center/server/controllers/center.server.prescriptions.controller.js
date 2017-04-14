// use strict
var logger = require('winston');
var path = require('path');
var mongoose = require('mongoose');
var Drug = mongoose.model('DrugCat');
var Joi = require('joi');
var Prescriptions = mongoose.model('Prescriptions');

exports.getDrugType = function(req, res, next) {
  logger.debug('getting drug type');
  Prescriptions.find({ centerId: req.query.center }).distinct('drugType', function(err, data, numrow) {
    if (!err) {
      res.status(200).send({ status: 'success', data: data });
    } else {
      res.status(400).send({ status: 'failure', msg: err });
    }
  });
};

exports.getDrugUnit = function(req, res, next) {
  logger.debug('getting drung unit');
  Prescriptions.find({ centerId: req.query.center }).distinct('unit', function(err, data, numrow) {
    if (!err) {
      res.status(200).send({ status: 'success', data: data });
    } else {
      res.status(400).send({ status: 'failure', msg: err });
    }
  });
};

exports.createDrugCatValidations = {
  body: {
    centerId: Joi.string().required(),
    'drugs': [{
      'DrugName': Joi.string().required(),
      'DrugStrength': Joi.string(),
      'DrugInstruction': Joi.string()
    }],
    'drugType': [{
      'DrugTypeName': Joi.string().required()
    }],
    'unit': [{
      'Unit': Joi.string()
    }]
  }
};

exports.createDrugCat = function(req, res, next) {
  logger.debug('Prescription/DrugCatalog details');
  var data = req.body;
  console.log(data);
  var query = { 'centerId': data.centerId };
  var updatePrescriptions = {};
  var updateDrugs = {};

  if (data.drugs) {
    updatePrescriptions.drugs = data.drugs;
  }
  updateDrugs = { '$push': updatePrescriptions };
  Prescriptions.findOneAndUpdate(query, updateDrugs, { upsert: true, new: true }, function(err, data) {
    if (!err) {
      logger.debug('Success');
      res.status(200).send({ status: 'success', data: data });

    } else {
      res.status(403).send({ status: 'failure', msg: err });
    }
  });
};

exports.createDrugType = function(req, res, next) {
  var data = req.body;
  console.log(data);
  var query = { 'centerId': data.centerId };
  var updatePrescriptions = {};
  var updateDrugs = {};

  if (data.drugType) {
    updatePrescriptions.drugType = data.drugType;
  }
  updateDrugs = { '$push': updatePrescriptions };
  Prescriptions.findOneAndUpdate(query, updateDrugs, { upsert: true, new: true }, function(err, data) {
    if (!err) {
      logger.debug('Success');
      res.status(200).send({ status: 'success', data: data });

    } else {
      res.status(403).send({ status: 'failure', msg: err });
    }
  });
};

exports.createDrugUnit = function(req, res, next) {
  var data = req.body;
  console.log(data);
  var query = { 'centerId': data.centerId };
  var updatePrescriptions = {};
  var updateDrugs = {};

  if (data.unit) {
    updatePrescriptions.unit = data.unit;
  }
  updateDrugs = { '$push': updatePrescriptions };
  Prescriptions.findOneAndUpdate(query, updateDrugs, { upsert: true, new: true }, function(err, data) {
    if (!err) {
      logger.debug('Success');
      res.status(200).send({ status: 'success', data: data });

    } else {
      res.status(403).send({ status: 'failure', msg: err });
    }
  });
};


exports.getDrugCat = function(req, res, next) {
  logger.debug('get Prescription/DrugCatalog List', req);
  Prescriptions.find({ centerId: req.query.center }, function(err, data) {
    if (!err) {
      logger.info('DrugCat :  success');
      res.status(200).send({ status: 'success', data: data });
    } else {
      res.status(403).send({ status: 'failure', msg: data });
    }
  });
};

exports.deleteDrugData = function(req, res, next) {
  logger.debug('prescription Setting : delete DrugData', req);
  var id = req.params.delId;
  Drug.remove({ _id: id }, function(err, doc) {
    if (!err) {
      logger.info('DrugData deleted:  success');
      res.status(200).send({ status: 'success', data: doc });
    } else {
      logger.info('DrugData delete : error');
      res.status(403).send({ status: 'failure', msg: doc });
    }
  });
};
