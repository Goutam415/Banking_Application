var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  crypto = require('crypto'),
  validator = require('validator'),
  generatePassword = require('generate-password'),
  owasp = require('owasp-password-strength-test'),
  logger = require('winston'),
  Timing = mongoose.model('Timing');

var TimingSchema = new Schema({
  timing: [
    {
      slot1: {
        startTime: { type: String },
        endTime: { type: String }
      },
      slot2: {
        startTime: { type: String },
        endTime: { type: String }
      }
    }
  ],
  isOpen: { type: Boolean, required: true }
});

var Staff = new Schema({
  idStaff: { type: String },
  centerIds: [{ type: Schema.Types.ObjectId, ref: 'Center' }],
  idCustomer: { type: Schema.Types.ObjectId, ref: 'Customer' },
  name: { type: String },
  staffDescription: { type: String },
  photoId: { type: String },
  gender: { type: String },
  mobile: { type: String },
  role: [{ type: String }],
  calColor: { type: String },
  DOB: { type: Date },
  idAddress: { type: Number },
  email: { type: String },
  isDoctor: { type: Boolean },
  regNo: { type: String },
  confirmationSMS: { type: Boolean },
  confirmationemail: { type: Boolean },
  scheduleSMS: { type: Boolean },
  scheduleEmail: { type: Boolean },
  approvalStatus: { type: String, enum: ['pending', 'confirmed', 'rejected'] },
  specialization: { type: Array },
  salt: { type: String },
  password: { type: String },
  permissions: { type: Array },
  pic: { type: String },
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


Staff.statics.updatedoctorTimings = function updatedoctorTimings(doctorTime, callback) {

//   if (!centerTime.centerId) {
//     callback('Please provide center id', null);
//     return;
//   }
  console.log(doctorTime._id);
  console.log(doctorTime.centerId);

  var query = { '_id': doctorTime._id };
  var updateQuery = {};
  var updateData = {};
  if (doctorTime.workingDays.monday) {
    updateData.monday = doctorTime.workingDays.monday;
  }

  if (doctorTime.workingDays.tuesday) {
    updateData.tuesday = doctorTime.workingDays.tuesday;
  }
  if (doctorTime.workingDays.wednesday) {
    updateData.wednesday = doctorTime.workingDays.wednesday;
  }
  if (doctorTime.workingDays.thursday) {
    updateData.thursday = doctorTime.workingDays.thursday;
  }
  if (doctorTime.workingDays.friday) {
    updateData.friday = doctorTime.workingDays.friday;
  }
  if (doctorTime.workingDays.saturday) {
    updateData.saturday = doctorTime.workingDays.saturday;
  }
  if (doctorTime.workingDays.sunday) {
    updateData.sunday = doctorTime.workingDays.sunday;
  }


  updateQuery.workingDays = updateData;
  this.findOneAndUpdate(query, { $set: updateQuery }, { upsert: false, new: true }, function(err, doc) {
    callback(err, doc);
  });
};

/**
 * Hook a pre save method to generate and hash the password
 */
Staff.pre('save', function (next) {
  var _this = this;
  mongoose.model('Staff').find({ email: this.email }, function (err, docs) {
    if (!docs.length) {
      logger.info('user not exsists :: save now', _this.email);
      Staff.statics.generateRandomPassphrase().then(function(password) {
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

/**
 * Create instance method for hashing a password
 */
Staff.methods.hashPassword = function (password) {
  if (this.salt && password) {
    return crypto.pbkdf2Sync(password, new Buffer(this.salt, 'base64'), 10000, 64).toString('base64');
  } else {
    return password;
  }
};


/**
 * Create instance method for authenticating user
 */
Staff.methods.authenticate = function (password) {
  return this.password === this.hashPassword(password);
};

Staff.statics.findUser = function(email, token, cb) {
  var self = this;
  this.findOne({ email: email }, function(err, usr) {
    if (err || !usr) {
      cb(err, null);
    } else if (usr.token && usr.token.token && token === usr.token.token) {
      cb(false, { email: usr.email, token: usr.token, date_created: usr.date_created, full_name: usr.full_name });
    } else {
      cb(new Error('Token does not exist or does not match.'), null);
    }
  });
};

Staff.statics.findUserByEmailOnly = function(email, cb) {
  var self = this;
  this.findOne({ email: email }, function(err, usr) {
    if (err || !usr) {
      cb(err, null);
    } else {
      cb(false, usr);
    }
  });
};

/* Staff.statics.createUserToken = function(email, cb) {
  var self = this;
  this.findOne({ email: email }, function(err, usr) {
    if (err || !usr) {
      console.log('err');
    }
        // Create a token and add to user and save
    var token = self.encode({ email: email });
    usr.token = new TokenModel({ token: token });
    usr.save(function(err, usr) {
      if (err) {
        cb(err, null);
      } else {
        self.getOwner(usr.center, function(e, a) {
          cb(false, usr.token.token, usr.name, usr.role, usr.center, usr.email, usr.mobile, a._id, usr._id, usr.address1, usr.isDoctor);
        });
      }
    });
  });
};*/

Staff.statics.invalidateUserToken = function(email, cb) {
  var self = this;
  this.findOne({ email: email }, function(err, usr) {
    if (err || !usr) {
      console.log('err');
    }
    console.log(usr);
       // usr.token = null;
    usr.save(function(err, usr) {
      if (err) {
        cb(err, null);
      } else {
        cb(false, 'removed');
      } });
  });
};


Staff.statics.getOwner = function(center, cb) {
  var self = this;
  this.findOne({ center: center, isOwner: true }, { _id: true, center: true }, function(err, usr) {
    if (err || !usr) {
      cb(err, false);
    } else {
      cb(false, usr);
    }

  });
};

Staff.statics.getOwnerDetails = function(center, cb) {
  var self = this;
  this.findOne({ center: center, isOwner: true }, function(err, usr) {
    if (err || !usr) {
      cb(err, false);
    } else {
      cb(false, usr);
    }

  });
};
// get all the doctors
Staff.statics.getDoctorFormCenterid = function(center_id, callback) {
  var self = this;
  this.find({ center: center_id, isDoctor: true }, { name: true, email: true, calcolor: true, mobile: true }, function(err, Staff) {
    console.log(Staff);
    if (err) {
      callback(err, false);
    } else {
      callback(true, Staff);
    }
  });

};

// get all staff -> center
Staff.statics.getAllStaffFromCenter = function(center_id, callback) {
  var self = this;
  this.find({ center: center_id, isDoctor: false }, { name: true, email: true, role: true, mobile: true }, function(err, Staff) {
    if (err) {
      callback(err, false);
    } else {
      callback(true, Staff);
    }
  });
};

Staff.statics.getAllDoctor = function(data, callback) {
  var self = this;
  this.findOne({ $or: [{ name: data.name, isDoctor: true }, { _id: data.id, isDoctor: true }] }, function(err, Staff) {
    if (err) {
                // handleError(error,res);
      callback(err, null);
    } else {
      callback(false, Staff);
                // res.send({status:"success",data:doctor});
    }


  });
};

Staff.statics.authPin = function(pin, callback) {
  var self = this;
  this.findOne({ pin: pin }, function(err, Staff) {
    console.log(err);
    if (err) {
      callback(true, null);
    } else if (Staff) {
      self.getOwner(Staff.center, function(e, a) {
        callback(false, a);
      });
    } else {
      callback(true, null);
    }

  });
};

Staff.statics.getMinDoctor = function(data, callback) {
  var self = this;
  // this.find({ $or: [ { name:data.name,isDoctor:true},{_id:data.id,isDoctor:true}]},function(err,Staff){
  this.find({ center: data.center, isDoctor: true }, function(err, Staff) {


    if (err) {
                // handleError(error,res);
      callback(false, err);
    } else if (Staff.length > 0) {
      var temp = [];

      for (var i = 0; i < Staff.length; i++) {
        temp.push({
          _id: Staff[i]._id,
          name: Staff[i].name,
          email: Staff[i].email,
          color: Staff[i].color

        });
                       // console.log(name);
      }

                           //  return(temp);
      return callback(true, temp);

                // res.send({status:"success",data:doctor});
    }

    return callback(false, null);
  });
};


Staff.statics.getCustomer = function(data, callback) {
  var self = this;

  this.find({ _id: data.id }, function(error, Staff) {
    if (error) {
      callback(false, error);
    } else {
      callback(true, Staff);
    }
  });
};


Staff.statics.updateCustomer = function(data, callback) {
  var self = this;
  var newcenter = {};
  for (var key in data) {
    if (data[key]) {
      newcenter[key] = data[key];
    }

  }
  console.dir(newcenter);
  this.update({ email: data.email }, newcenter, { multi: false }, function(error, Staff) {
    if (error) {
      callback(false, error);
    } else {
      callback(true, Staff);
    }

  });
};

/**
* Generates a random passphrase that passes the owasp test
* Returns a promise that resolves with the generated passphrase, or rejects with an error if something goes wrong.
* NOTE: Passphrases are only tested against the required owasp strength tests, and not the optional tests.
*/
Staff.statics.generateRandomPassphrase = function () {
  logger.info('generating password for user');
  return new Promise(function (resolve, reject) {
    var password = '';
    var repeatingCharacters = new RegExp('(.)\\1{2,}', 'g');

    // iterate until the we have a valid passphrase
    // NOTE: Should rarely iterate more than once, but we need this to ensure no repeating characters are present
    while (password.length < 6 || repeatingCharacters.test(password)) {
      // build the random password
      password = generatePassword.generate({
        length: Math.floor(Math.random() * (6)) + 2, // randomize length between 20 and 40 characters
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
    //  reject(new Error('An unexpected problem occured while generating the random passphrase'));
    // } else {
      // resolve with the validated passphrase
    resolve(password);
    // }
  });
};

mongoose.model('Staff', Staff);
