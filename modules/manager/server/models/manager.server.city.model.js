'use strict';

/**
 *  Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * manager Schema
 */

var cityMasterSchema = new Schema({
  CityId: { type: Number, required: true },
  CityName: { type: String, required: true },
  StateId: { type: Number, required: true }
});

mongoose.model('CityMaster', cityMasterSchema);
