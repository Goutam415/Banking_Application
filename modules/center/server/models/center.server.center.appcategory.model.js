
var path = require('path');
var config = require(path.join(__dirname, '../config/config.js'));
var logger = require('winston');
var mongoose = require('mongoose');
var mailer = require('nodemailer');

var Schema = mongoose.Schema;


var AppCategorySchema = new Schema({

  category: { type: String },
  IsCategory: { type: Boolean, default: true },
  centerId: { type: String }

}, { collection: 'appcategory' });

mongoose.model('AppCategorySchema', AppCategorySchema);
