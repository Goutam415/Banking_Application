var mongoose = require('mongoose'),
  Consultation = mongoose.model('Consultation'),
  _ = require('lodash'),
  Joi = require('joi'),
  logger = require('winston');


exports.saveTreatmentPlans = function(req, res) {
  var data = req.body;
  var updateData = {};
  console.log(data);
  var query = { 'centerId': req.body.centerId };
  console.log(query);
  if (data) {
    updateData.treatmentPlans = data.treatmentPlans;
    // logger.info(updateData);
  }
  console.log(updateData);
  Consultation.findOneAndUpdate(query, { $push: updateData }, { upsert: true, new: true }, function(status, data) {
    if (status) {
      logger.info('consultation : Treatment Plans :  success');
      res.status(200).send({ status: 'success', data: data });
    } else {
      logger.info('consultation : Treatment Plans :  error');
      res.status(403).send({ status: 'failure', msg: data });
    }
  });
};
