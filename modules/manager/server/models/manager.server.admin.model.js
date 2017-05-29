'use strict';

/**
 *  Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  crypto = require('crypto'),
  validator = require('validator'),
  generatePassword = require('generate-password'),
  owasp = require('owasp-password-strength-test'),
  logger = require('winston');

/**
 * SalesAdmin Schema
 */

var SalesAdmin = new Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  salt: { type: String }
});

/**
 * Hook a pre save method to hash the password
 */
SalesAdmin.pre('save', function (next) {
  var _this = this;
  mongoose.model('SalesAdmin').find({ email: this.email }, function (err, docs) {
    if (!docs.length) {
      logger.info('user not exsists :: save now', _this.email);
      if (_this.password && _this.isModified('password')) {
        _this.salt = crypto.randomBytes(16).toString('base64');
        _this.password = _this.hashPassword(_this.password);
      }
      next();
    } else {
      logger.info('user already exsists', _this.email);
      next(new Error('User exists!'));
    }
  });
});

/**
 * Create instance method for hashing a password
 */
SalesAdmin.methods.hashPassword = function (password) {
  if (this.salt && password) {
    return crypto.pbkdf2Sync(password, new Buffer(this.salt, 'base64'), 10000, 64).toString('base64');
  } else {
    return password;
  }
};


/**
 * Create instance method for authenticating user
 */
SalesAdmin.methods.authenticate = function (password) {
  return this.password === this.hashPassword(password);
};


mongoose.model('SalesAdmin', SalesAdmin);
