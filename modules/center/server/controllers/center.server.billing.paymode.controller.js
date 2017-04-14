// use strict
var logger = require('winston');
var path = require('path');
var mongoose = require('mongoose');
var Paymode = mongoose.model('Paymode');
var Joi = require('joi');

exports.createPaymodeDataValidations = {
  body: {
    'mode': Joi.string().required(),
    'type': Joi.string(),
    'fee': Joi.number()
  }
};

exports.createPaymodeData = function(req, res, next) {

  logger.debug('Paymode details');
  var paymode = new Paymode(req.body);
  paymode.save(function(err, data, numrow) {
    if (!err) {
      logger.debug('Success');
      res.status(200).send({ status: 'success', data: data });

    } else {
      res.status(403).send({ status: 'failure', msg: err });
    }
  });
};

exports.editPaymode = function (req, res, next) {
  logger.debug('center : settings: entered edit paymode', req);
  var id = req.params.editId;
  var query = { '_id': id, 'centerId': req.body.centerId };
  Paymode.findOneAndUpdate(query, { $set: { mode: req.body.mode, type: req.body.type, fee: req.body.fee } }, function(err, doc) {
    if (!err) {
      res.status(200).send({ status: 'success', data: doc });
    } else {
      res.status(403).send({ status: 'failure', msg: err });
    }
  });
};

exports.getPaymode = function(req, res, next) {
  logger.debug('Center Setting : get Paymode List', req);
  Paymode.find({ centerId: req.query.center }, function(err, data) {
    if (!err) {
      logger.info('Paymode :  success');
      res.status(200).send({ status: 'success', data: data });
    } else {
      res.status(403).send({ status: 'failure', msg: data });
    }
  });
};

exports.delPaymode = function (req, res, next) {
  logger.debug('center : settings: entered edit paymode', req);
  var id = req.params.delId;
  Paymode.remove({ _id: id }, function(err, doc) {
    if (!err) {
      res.status(200).send({ status: 'success', data: doc });
    } else {
      res.status(403).send({ status: 'failure', msg: doc });
    }
  });
};

