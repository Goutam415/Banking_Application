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
 * manager Schema
 */

var managerSchema = new Schema({
  managerName: { type: String, required: true },
  managerClass: { type: String },
  managerAffliateName: { type: String },
  managerTin: { type: String },
  managerEmail: { type: String, required: true },
  managerWebsite: { type: String },
  managerspecialtext: { type: String },
  managercontactnumber1: { type: String },
  idmanagerRating: { type: Number },
  centerIds: [{ type: Schema.Types.ObjectId, ref: 'Center' }],
  dateofjoining: { type: Date },
  idOwner: { type: Schema.Types.ObjectId, ref: 'Staff' },
  lastupdate: { true: Date },
  idsubscription: [{ type: Schema.Types.ObjectId, ref: 'Subscription' }],
  address: ['Address'],
  salt: { type: String },
  password: { type: String }
});


managerSchema.virtual('managerId').get(function() {
  return this._id;
});

/**
 * Hook a pre save method to generate and hash the password
 */
managerSchema.pre('save', function (next) {
  var _this = this;
  mongoose.model('manager').find({ managerEmail: this.managerEmail }, function (err, docs) {
    if (!docs.length) {
      logger.info('user not exsists :: save now', _this.email);
      managerSchema.statics.generateRandomPassphrase().then(function(password) {
        if (password) {
          _this.salt = crypto.randomBytes(16).toString('base64');
          _this.origianlPassword = password;
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

managerSchema.set('toJSON', {
  transform: function(doc, ret, options) {
    var retJson = {
      email: ret.managerEmail,
      name: ret.managerName,
      modified: ret.managercontactnumber1
    };
    return retJson;
  }
});

/**
 * Create instance method for hashing a password
 */
managerSchema.methods.hashPassword = function (password) {
  if (this.salt && password) {
    return crypto.pbkdf2Sync(password, new Buffer(this.salt, 'base64'), 10000, 64).toString('base64');
  } else {
    return password;
  }
};


/**
* Generates a random passphrase that passes the owasp test
* Returns a promise that resolves with the generated passphrase, or rejects with an error if something goes wrong.
* NOTE: Passphrases are only tested against the required owasp strength tests, and not the optional tests.
*/
managerSchema.statics.generateRandomPassphrase = function () {
  logger.info('generating password for user');
  return new Promise(function (resolve, reject) {
    var password = '';
    var repeatingCharacters = new RegExp('(.)\\1{2,}', 'g');

    // iterate until the we have a valid passphrase
    // NOTE: Should rarely iterate more than once, but we need this to ensure no repeating characters are present
    while (password.length < 6 || repeatingCharacters.test(password)) {
      // build the random password
      password = generatePassword.generate({
        length: Math.floor(Math.random() * (6)) + 9, // randomize length between 20 and 40 characters
        numbers: true,
        symbols: false,
        uppercase: true,
        excludeSimilarCharacters: true
      });

      // check if we need to remove any repeating characters
      password = password.replace(repeatingCharacters, '');
    }

    // Send the rejection back if the passphrase fails to pass the strength test
   // if (owasp.test(password).errors.length) {
     // reject(new Error('An unexpected problem occured while generating the random passphrase'));
    // } else {
      // resolve with the validated passphrase
    resolve(password);
   // }
  });
};


mongoose.model('manager', managerSchema);
