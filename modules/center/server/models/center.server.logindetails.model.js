'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;


var LoginSchema = new Schema({
  email: { type: String },
  password: { type: String }
});


LoginSchema.methods.hashPassword = function(password) {
  if (this.salt && password) {
    return crypto.pbkdf2Sync(password, new Buffer(this.salt, 'base64'), 10000, 64).toString('base64');
  } else {
    return password;
  }
};


LoginSchema.methods.authenticate = function(password) {
  return this.password === this.hashPassword(password);
};


mongoose.model('Logins', LoginSchema);