/**
 *  Module dependencies
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var _ = require('lodash');
var logger = require('winston');

/**
 *  Observation Schema
 */
var Observation = new Schema({
  name: { type: String, index: { unique: true } },
  active: { type: Boolean, default: true }
});

/**
 *  Complaints Schema
 */
var Complaints = new Schema({
  name: { type: String },
  active: { type: Boolean, default: true }
});

/**
 *  Investigations Schema
 */
var Investigations = new Schema({
  name: { type: String },
  active: { type: Boolean, default: true }
});

/**
 *  Diagnosis Schema
 */
var Diagnosis = new Schema({
  name: { type: String },
  active: { type: Boolean, default: true }
});

/**
 *  FileLables Schema
 */
var FileLables = new Schema({
  name: { type: String },
  active: { type: Boolean, default: true }
});

/**
 *  Notes Schema
 */
var Notes = new Schema({
  name: { type: String },
  active: { type: Boolean, default: true }
});

/**
 *  Vitals Schema
 */
var Vitals = new Schema({
  default_temperature_unit: { type: String },
  default_temperature_method: { type: String },
  default_bp_measurement: { type: String }
});

/**
 *  EMR Schema
 */
var EMR = new Schema({
  centerId: { type: String, required: true },
  complaints: { type: [Complaints], required: false },
  observations: { type: [Observation], required: false },
  fileLabels: { type: [FileLables], required: false },
  diagnoses: { type: [Diagnosis], required: false },
  investigations: { type: [Investigations], required: false },
  notes: { type: [Notes], required: false },
  vitals: { type: [Vitals], required: false }
});

/**
 * Fetch EMR for ceter id
 */
EMR.statics.getAllEMRForCenter = function getEMR(inCenterId, callback) {
  // Error if center id is not present
  if (!inCenterId) {
    callback('Please provide center id', null);
    return;
  }
  this.findOne({ centerId: inCenterId }, '-_id complaints observations investigations notes fileLabels diagnoses vitals', function (err, emr) {
    if (err) return callback(err, null);
    else callback(null, emr);
  });
};

/**
 * update EMR for center id or create a new document if none exists
 */
EMR.statics.update = function addupdates(inEMR, callback) {
  // Error if center id is not present
  if (!inEMR.centerId) {
    callback('Please provide center id', null);
    return;
  }
  var query = { 'centerId': inEMR.centerId };
  var updateQuery = {};
  var updateData = {};
  if (inEMR.observations) {
    updateData.observations = inEMR.observations;
  }
  if (inEMR.complaints) {
    updateData.complaints = inEMR.complaints;
  }
  if (inEMR.investigations) {
    updateData.investigations = inEMR.investigations;
  }
  if (inEMR.notes) {
    updateData.notes = inEMR.notes;
  }
  if (inEMR.fileLabels) {
    updateData.fileLabels = inEMR.fileLabels;
  }
  if (inEMR.vitals) {
    updateData.vitals = inEMR.vitals;
  }
  if (inEMR.diagnoses) {
    updateData.diagnoses = inEMR.diagnoses;
  }
  var empty = _.isEmpty(updateData);
  if (!empty) {
    updateQuery = { '$push': updateData };
  }
  this.findOneAndUpdate(query, updateQuery, { upsert: true, new: true, unique: true }, function(err, doc) {
    callback(err, doc);
  });
};

/**
 * Edit Individual EMR
 */
EMR.statics.edit = function (inEMR, callback) {
  // Error if center id is not present
  if (!inEMR.centerId) {
    callback('Please provide center id', null);
    return;
  }
  var query = { 'centerId': inEMR.centerId };
  var updateQuery = {};
  if (inEMR.observations) {
    query['observations._id'] = inEMR.observations._id;
    updateQuery = { '$set': { 'observations.$.name': inEMR.observations.name, 'observations.$.active': inEMR.observations.active } };
  }
  if (inEMR.complaints) {
    query['complaints._id'] = inEMR.complaints._id;
    updateQuery = { '$set': { 'complaints.$.name': inEMR.complaints.name, 'complaints.$.active': inEMR.complaints.active } };
  }
  if (inEMR.investigations) {
    query['investigations._id'] = inEMR.investigations._id;
    updateQuery = { '$set': { 'investigations.$.name': inEMR.investigations.name, 'investigations.$.active': inEMR.investigations.active } };
  }
  if (inEMR.notes) {
    query['notes._id'] = inEMR.notes._id;
    updateQuery = { '$set': { 'notes.$.name': inEMR.notes.name, 'notes.$.active': inEMR.notes.active } };
  }
  if (inEMR.fileLabels) {
    query['fileLabels._id'] = inEMR.fileLabels._id;
    updateQuery = { '$set': { 'fileLabels.$.name': inEMR.fileLabels.name, 'fileLabels.$.active': inEMR.fileLabels.active } };
  }
  if (inEMR.vitals) {
    query['vitals._id'] = inEMR.vitals._id;
    var vitalUpdateData = {};
    if (inEMR.vitals.default_temperature_unit) {
      vitalUpdateData['vitals.$.default_temperature_unit'] = inEMR.vitals.default_temperature_unit;
    }
    if (inEMR.vitals.default_temperature_method) {
      vitalUpdateData['vitals.$.default_temperature_method'] = inEMR.vitals.default_temperature_method;
    }
    if (inEMR.vitals.default_bp_measurement) {
      vitalUpdateData['vitals.$.default_bp_measurement'] = inEMR.vitals.default_bp_measurement;
    }
    var empty = _.isEmpty(vitalUpdateData);
    if (!empty) {
      updateQuery = { '$set': vitalUpdateData };
    }
  }
  if (inEMR.diagnoses) {
    query['diagnoses._id'] = inEMR.diagnoses._id;
    updateQuery = { '$set': { 'diagnoses.$.name': inEMR.diagnoses.name, 'diagnoses.$.active': inEMR.diagnoses.active } };
  }
  this.findOneAndUpdate(query, updateQuery, function(err, doc) {
    callback(err, doc);
  });

};

EMR.statics.updateVital = function(inEMR, callback) {
  if (!inEMR.centerId) {
    callback('Please provide center id', null);
    return;
  }
  var query = { 'centerId': inEMR.centerId };
  var vitalUpdateData = {};
  if (inEMR.vitals.default_temperature_unit) {
    vitalUpdateData.vitals = inEMR.vitals;
  }

  this.findOneAndUpdate(query, { $set: vitalUpdateData }, { upsert: false, new: true }, function(err, doc) {
    callback(err, doc);
  });
};
module.exports = mongoose.model('EMR', EMR);
