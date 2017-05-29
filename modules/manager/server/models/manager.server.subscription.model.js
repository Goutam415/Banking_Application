'use strict';

/**
 *  Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * manager Schema
 */

var subscriptionSchema = new Schema({
  subscriptionname: { type: String, enum: ['gold', 'platinum', 'silver'], default: 'gold' },
  validity: { type: Number, required: true }
});

mongoose.model('Subscription', subscriptionSchema);

