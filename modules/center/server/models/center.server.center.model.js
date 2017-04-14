
'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  Joi = require('joi'),
  utils = require('../utils/utils'),
  _ = require('lodash'),
  Timing = mongoose.model('Timing');
var TimingSchema = new Schema({
  timing: [
    {
      slot: {
        startTime: { type: String },
        endTime: { type: String }
      },
      slot1: {
        startTime: { type: String },
        endTime: { type: String }
      }
    }
  ],
  isOpen: { type: Boolean, required: true }
});

var CenterSchema = new Schema({
  centerName: { type: String, required: true },
  centerAffilatedName: { type: String, required: true },
  centerTin: { type: String, required: false },
  address: ['Address'],
  centerEmail: { type: String, required: true },
  centerWebsite: { type: String, required: false },
  centerSpecialText: { type: String, required: false },
  centerContactNumber: { type: String, required: true },
  idCenterRating: { type: String, required: false },
  subscription: ['Subscription'],
  pin: { type: String },
  idOwner: { type: Schema.Types.ObjectId, ref: 'Staff' },
  idCustomer: { type: Schema.Types.ObjectId, ref: 'Customer' },
  dateofjoining: { type: String, required: true },
  lastUpdate: { type: String, required: false },
  idLogo: { type: String, required: false },
  centerTimezone: { type: String, required: true },
  centerSpecialization: { type: String, required: true },
  isActive: { type: Boolean },
  isDoctor: { type: Boolean },
  reminder_sms: {
    beforeAppointmentSMS: { type: Boolean },
    beforeAppointmentSMSTime: { type: String },
    onAppointmentSMS: { type: Boolean },
    onAppointmentSMSTime: { type: String }
  },
  reminder_email: {
    beforeAppointmentEmail: { type: Boolean },
    beforeAppointmentEmailTime: { type: String },
    onAppointmentEmail: { type: Boolean },
    onAppointmentEmailTime: { type: String }
  },
  workingDays: {
    sunday: TimingSchema,
    monday: TimingSchema,
    tuesday: TimingSchema,
    wednesday: TimingSchema,
    thursday: TimingSchema,
    friday: TimingSchema,
    saturday: TimingSchema
  }
});

CenterSchema.virtual('centerId').get(function() {
  return this._id;
});


/**
 * Hook a pre save method to generate PIN
 */
CenterSchema.pre('save', function (next) {
  this.pin = utils.randomPass(4);
  next();

});

CenterSchema.statics.updateCenterTimings = function updateCenterTimings(centerTime, callback) {

//   if (!centerTime.centerId) {
//     callback('Please provide center id', null);
//     return;
//   }
// console.log(centerTime.monday.startTime);
  var query = { '_id': centerTime.centerId };
  var updateQuery = {};
  var updateData = {};

// TODO change timings logic everywhere.
  if (centerTime.workingDays.sunday.timing[0] !== null) {
    updateData.sunday = centerTime.workingDays.sunday;
  }
  if (centerTime.workingDays.monday) {
    updateData.monday = centerTime.workingDays.monday;
  }

  if (centerTime.workingDays.tuesday.timing[0] !== null) {
    updateData.tuesday = centerTime.workingDays.tuesday;
  }
  if (centerTime.workingDays.wednesday) {
    updateData.wednesday = centerTime.workingDays.wednesday;
  }
  if (centerTime.workingDays.thursday) {
    updateData.thursday = centerTime.workingDays.thursday;
  }
  if (centerTime.workingDays.friday) {
    updateData.friday = centerTime.workingDays.friday;
  }
  if (centerTime.workingDays.saturday) {
    updateData.saturday = centerTime.workingDays.saturday;
  }

  updateQuery.workingDays = updateData;


 // updateQuery = { '$push': updateData };

  this.findOneAndUpdate(query, { $set: updateQuery }, { upsert: false, new: true }, function(err, doc) {
    callback(err, doc);
  });
};


CenterSchema.statics.updateSettings = function updateSettings(settings, callback) {
  var query = { '_id': settings.centerId };
  var updateQuery = {};
  var updateData = {};
  if (settings.sms) {
    updateData.reminder_sms = settings.sms;
  }
  if (settings.email) {
    updateData.reminder_email = settings.email;
  }
  var empty = _.isEmpty(updateData);
  if (!empty) {
    updateQuery = { '$set': updateData };
  }
  this.findOneAndUpdate(query, updateQuery, { upsert: true, new: true }, function(err, doc) {
    callback(err, doc);
  });
};

CenterSchema.statics.updateSettings = function updateSettings(settings, callback) {
  var query = { '_id': settings.centerId };
  var updateQuery = {};
  var updateData = {};
  if (settings.sms) {
    updateData.reminder_sms = settings.sms;
  }
  if (settings.email) {
    updateData.reminder_email = settings.email;
  }
  var empty = _.isEmpty(updateData);
  if (!empty) {
    updateQuery = { '$set': updateData };
  }
  this.findOneAndUpdate(query, updateQuery, { upsert: true, new: true }, function(err, doc) {
    callback(err, doc);
  });
};


mongoose.model('Center', CenterSchema);
