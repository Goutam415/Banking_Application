'use strict';

/**
 *  Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * manager Schema
 */

var addressSchema = new Schema({
  addressLine1: { type: String, required: true },
  addressLine2: { type: String, required: false },
  landamrk: { type: String, required: false },
  city: { type: String, required: true },
  state: { type: String, required: true },
  country: { type: String, required: true },
  pincode: { type: String, required: true }
});

mongoose.model('Address', addressSchema);
