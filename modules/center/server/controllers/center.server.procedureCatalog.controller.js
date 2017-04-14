// use strict
 var logger = require('winston');
 var path = require('path');
 var mongoose = require('mongoose');
 var ProcedureCatalog = mongoose.model('ProcedureCatalog');
 var Joi = require('joi');

 exports.getProcType = function(req, res, next) {
   logger.debug('getting procedure types');
   ProcedureCatalog.find({ centerId: req.query.center }).distinct('procedureCategory', function(err, data, numrow) {
     if (!err) {
       res.status(200).send({ status: 'success', data: data });
     } else {
       res.status(400).send({ status: 'failure', msg: err });
     }
   });
 };

 exports.createProcedureCatalogValidations = {
   body: {
     'idCatalog': Joi.number().required(),
     'procedureName': Joi.string(),
     'procedureCategory': Joi.string(),
     'procedureCost': Joi.number(),
     'xTooth': Joi.boolean(),
     'notes': Joi.string(),
     'isTaxTDS': Joi.boolean(),
     'isTaxVAT': Joi.boolean(),
     'idCategory': Joi.number(),
     'idCenter': Joi.number()
   }
 };

 exports.createProcedureCatalog = function(req, res, next) {
   logger.debug('ProcedureCatalog details');
   var data = req.body;
   console.log(data);
   var query = { 'centerId': data.centerId };
   var updatePrescriptions = {};
   var updateDrugs = {};

   if (data.proceduresList) {
     updatePrescriptions.proceduresList = data.proceduresList;
   }
   updateDrugs = { '$push': updatePrescriptions };
   console.log(updateDrugs);
   ProcedureCatalog.findOneAndUpdate(query, updateDrugs, { upsert: true, new: true }, function(err, data) {
     if (!err) {
       logger.debug('Success');
       res.status(200).send({ status: 'success', data: data });

     } else {
       res.status(403).send({ status: 'failure', msg: err });
     }
   });
 };

 exports.createProcedureCategory = function(req, res, next) {
   var data = req.body;
   console.log(data);
   var query = { 'centerId': data.centerId };
   var updatePrescriptions = {};
   var updateDrugs = {};

   if (data.CategoryName) {
     updatePrescriptions.CategoryName = data.CategoryName;
   }
   updateDrugs = { '$push': updatePrescriptions };
   ProcedureCatalog.findOneAndUpdate(query, updateDrugs, { upsert: true, new: true }, function(err, data) {
     if (!err) {
       logger.debug('Success');
       res.status(200).send({ status: 'success', data: data });

     } else {
       res.status(403).send({ status: 'failure', msg: err });
     }
   });
 };

/**
 * update center with ProcedureCatalog changes
 */
 exports.updateProcedureCatalog = function(req, res, next) {
   logger.debug('Center Setting : Update ProcedureCatalog', req);
   var data = req.body;
   console.log(data);
   var query = { '_id': data._id, 'centerId': data.centerId };
   ProcedureCatalog.findOneAndUpdate(query, { $set: { procedureName: req.body.procedureName, procedureCost: req.body.procedureCost, notes: req.body.notes } }, function(status, data) {
     if (status) {
       logger.info('center : update center :  success');
       res.status(200).send({ status: 'success', data: data });
     } else {
       logger.info('center : update center :  error');
       res.status(403).send({ status: 'failure', msg: data });
     }
   });
 };

/**
 * get ProcedureCatalog by id
 */
 exports.getProcedureCatalog = function(req, res, next) {
   logger.debug('get ProcedureCatalog List', req.query);
   ProcedureCatalog.find({ centerId: req.query.center }, function(err, data) {
     if (!err) {
       logger.info('ProcedureCatalog :  success');
       res.status(200).send({ status: 'success', data: data });
     } else {
      // logger.info('center : get ProcedureCatalog :  error');
       res.status(403).send({ status: 'failure', msg: data });
     }
   });
 };

// /**
//  * Delete ProcedureCatalog by ProcedureCatalogid
//  */
 exports.deleteProcedureCatalog = function(req, res, next) {
   logger.debug('Center Setting : get ProcedureCatalog List', req);
   var id = req.query.center;
   console.log(id);
   ProcedureCatalog.remove({ _id: id }, function(status, data) {
     if (status) {

       logger.info('ProcedureCatalog deleted:  success');
       res.status(200).send({ status: 'success', data: data });
     } else {
       logger.info('ProcedureCatalog delete : error');
       res.status(403).send({ status: 'failure', msg: data });
     }
   });
 };
