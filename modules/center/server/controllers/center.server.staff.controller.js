
var logger = require('winston'),
  path = require('path'),
  mongoose = require('mongoose'),
  Center = mongoose.model('Center'),
  Staff = mongoose.model('Staff'),
  Joi = require('joi'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));


exports.editDoctorTimings = function (req, res, next) {
  logger.debug('center : settings: entered edit doctor timings', req);
  Staff.editdoctorTime(req.body, function (err, doc) {
    if (err) {
      res.status(403).send({ status: 'failure', message: err });
    } else {
      res.status(200).send({ status: 'success', data: doc });
    }
  });
};

exports.staffUpdateRequiredParams = {
  body: {
    'id': Joi.string().required(),
    'centerId': Joi.string().required()
  }
};

/**
 * update staff details
 */
exports.updateStaffCenterId = function(req, res, next) {

  logger.debug('center : entered updated staff center', req);

  Staff.findByIdAndUpdate(req.body.id, { $push: { centerIds: req.body.centerId } }, function(err, update) {
    if (err) {
      res.status(403).send({ status: 'failure', message: err });
    } else {
      res.status(200).send({ status: 'success', data: update });
    }
  });
};

exports.getDoctor = function(req, res, next) {
  logger.debug('doctor list');
  Staff.find({ IsDoctor: true }).exec(function(err, doctors) {
    if (!err) {
      logger.info('get doctor :  success');
      res.status(200).send({ status: 'success', doctors: doctors });
    } else {
      logger.info('get doctor :  error');
     // res.status(403).send({ status: 'failure', msg: doctors });
      res.send(doctors);
    }
  });
};

exports.getStaff = function(req, res, next) {
  logger.debug('doctor list');
  Staff.find({ IsDoctor: false }).exec(function(err, staffs) {
    logger.debug(staffs);
    // var sta = staffs.data;
   // logger.debug(staffs);
    if (!err) {
      logger.info('get doctor :  success');
      // res.status(200).send({ status: 'success', staffs: staffs });
      res.send(staffs);
    } else {
      logger.info('get doctor :  error');
      res.status(403).send({ status: 'failure', msg: staffs });
    }
  });

};

exports.updateStaffNotficationsValidations = {
  body: {
    'scheduleSMS': Joi.boolean(),
    'scheduleEmail': Joi.boolean(),
    'confirmationemail': Joi.boolean(),
    'confirmationSMS': Joi.boolean()
  }
};

exports.updateStaffNotfications = function (req, res, next) {
  var array = req.body;
  console.log(array);
  var notify = {};
  for (var i = 0; i < array.length; i++) {

    console.log(array[0].centerId);
    var query = { _id: array[i]._id, centerIds: [array[i].centerId] };
    console.log(query);
    Staff.findByIdAndUpdate(query, { $set: { scheduleSMS: array[i].scheduleSMS,
        scheduleEmail: array[i].scheduleEmail, confirmationemail: array[i].confirmationemail, confirmationSMS: array[i].confirmationSMS } },
    { upsert: false, new: true, multi: true }, function(err, doc) {
      if (err) {
        logger.info(err);
      } else {
        logger.info(doc);
      }
    });
  }
};


exports.getUser = function(req, res, next) {
  logger.debug('get staff details from session');
  if (req.session.userDetails) {
    res.json(req.session.userDetails);
  } else {
    res.status(400).send('error while fetching user details');
  }
};
