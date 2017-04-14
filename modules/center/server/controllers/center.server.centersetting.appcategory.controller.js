
var path = require('path');
var mongoose = require('mongoose');
var AppCategorySchema = mongoose.model('AppCategorySchema');
var Joi = require('joi');
var logger = require('winston');
// var AppCategorySchema = require('../models/center.server.center.appcategory.model.js');
var errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

exports.createAppList = function (req, res) {
  console.log(req.body.centerId);
  var appList = new AppCategorySchema(req.body);
  appList.centerId = req.body.centerId;
  console.log(appList);
  appList.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.status(200).send(appList);
    }
  });
};


exports.getappCategory = function(req, res, next) {
  logger.debug('doctor list');
  console.log(req.query);
  AppCategorySchema.find({ IsCategory: true, centerId: req.query.center }).exec(function(err, appcategory) {
    logger.debug(appcategory);
    // var sta = staffs.data;
   // logger.debug(staffs);
    if (!err) {
      logger.info('get doctor :  success');
      // res.status(200).send({ status: 'success', staffs: staffs });
      res.send(appcategory);
    } else {
      logger.info('get doctor :  error');
      res.status(403).send({ status: 'failure', msg: appcategory });

    }
  });
};

exports.editAppCategory = function(req, res) {
  var array = req.body;
  console.log(array);
  var query = { _id: array._id, centerId: array.centerId };
  AppCategorySchema.findByIdAndUpdate(query, { $set: { IsCategory: array.IsCategory } },
  { upsert: false, new: true, multi: false }, function(err, category) {
    if (err) {
      console.log(err);
    } else {
      console.log(category);
    }
  });
};


exports.createAppListValidations = {
  body: {
    'category': Joi.string().required()
  }
};

