// use strict
var logger = require('winston');
var path = require('path');
var mongoose = require('mongoose');
var Tax = mongoose.model('Tax');
var Joi = require('joi');

exports.createTaxDataValidations = {
  body: {
    'taxName': Joi.string().required(),
    'taxPercentage': Joi.number(),
    'taxValue': Joi.string()
  }
};

exports.createTaxData = function(req, res, next) {
  logger.debug('taxCat details');
  // console.log(req.body);
  var tax = new Tax(req.body);
  tax.save(function(err, data, numrow) {
    if (!err) {
      logger.debug('Success');
      res.status(200).send({ status: 'success', data: data });
    } else {
      res.status(403).send({ status: 'failure', msg: err });
    }
  });
};

exports.editTaxData = function(req, res, next) {
  logger.debug('Center Setting : Update taxCat', req);
  console.log(req.body);
  var id = req.params.editId;
  var query = { '_id': id, 'centerId': req.body.centerId };
  Tax.findOneAndUpdate(query, { $set: { taxName: req.body.taxName, taxPercentage: req.body.taxPercentage, taxValue: req.body.taxValue } }, function(err, doc) {
    if (!err) {
      res.status(200).send({ status: 'success', data: doc });
    } else {
      res.status(403).send({ status: 'failure', msg: err });
    }
  });
};

exports.getTaxData = function(req, res, next) {
  logger.debug('get TaxData List', req);
  Tax.find({ centerId: req.query.center }, function(err, data) {
    if (!err) {
      logger.info('TaxData :  success');
      res.status(200).send({ status: 'success', data: data });
    } else {
      res.status(403).send({ status: 'failure', msg: data });
    }
  });
};

exports.delTaxData = function(req, res, next) {
  logger.debug('Center Setting : del TaxData List', req);
  var id = req.params.delId;
  Tax.remove({ _id: id }, function(err, doc) {
    if (!err) {
      res.status(200).send({ status: 'success', data: doc });
    } else {
      res.status(403).send({ status: 'failure', msg: doc });
    }
  });
};
