'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  crypto = require('crypto'),
  validator = require('validator'),
  generatePassword = require('generate-password'),
  owasp = require('owasp-password-strength-test'),
  logger = require('winston'),
  Timing = mongoose.model('Timing');


var LoginSchema = new Schema({
  FirstName: { type: String },
  MiddleName: { type: String },
  LastName: { type: String },
  Phone: { type: Number },
  BloodGroup: { type: String },
  DateOfJoining: { type: String },
  JoiningDay: { type: String },
  JobDescription: { type: String },
  Designation: { type: String },
  email: { type: String },
  password: { type: String }
});


LoginSchema.pre('save', function (next) {
  var _this = this;
  mongoose.model('LoginSchema').find({ email: this.email }, function (err, docs) {
    if (!docs.length) {
      logger.info('user not exsists :: save now', _this.email);
      LoginSchema.statics.generateRandomPassphrase().then(function(password) {
        if (password) {
          _this.salt = crypto.randomBytes(16).toString('base64');
          _this.origianlPassword = password;
          logger.debug('password for user' + _this.email + ' is ' + password);
          _this.password = _this.hashPassword(password);
        }
        next();
      }, function(params) {
        next(new Error('error while generating password'));
      });
    } else {
      logger.info('user already exsists', _this.email);
      next(new Error('User exists!'));
    }
  });
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
