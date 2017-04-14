
// /**
//  * Created by sawan kumar on 10/05/16.
//  */
// var path = require('path');
// var config = require(path.join(__dirname, '../config/config.js'));

// var mongoose = require('mongoose');
// var mailer = require('nodemailer');
// var utils = require(path.join(__dirname, '../utils/utils.js'));

// var Schema = mongoose.Schema;

// var _db = mongoose.createConnection(config.centerConfig.mongo_url);
// _db.useDb(config.centerConfig.db);

// var tax = new Schema({
//   idTax: Number,
//   TaxName: String,
//   TaxValue: String,
//   idCenter: Number

// }, { collection: 'Tax' });

// // post tax details
// tax.statics.createTaxData = function createTaxData(data, callback) {
//   var Self = this;
//   var newTaxDetails = {};

//   newTaxDetails.idTax = data.idTax;
//   newTaxDetails.TaxName = data.TaxName;
//   newTaxDetails.TaxValue = data.TaxValue;
//   newTaxDetails.idCenter = data.idCenter;

//   var c = new Self(newTaxDetails);

//   c.save(function(error, taxObject) {
//     if (error || !taxObject) {
//       callback(false, ['failure in creating center']);
//     } else {
//       callback(true, taxObject);
//     }
//   });

// };

// // Method to get Taxes details
// tax.statics.getTax = function (query, callback) {
// 	c.find( function(error, taxes) {
// 	if (!error) {
// 		callback(true, taxes);
// 	} else {
//       callback(false, taxes);
// 	}
// 	});
// };

// module.exports = _db.model('tax', tax);
