

var mongoose = require('mongoose');

var Schema = mongoose.Schema;


var Tax = new Schema({
  idTax: Number,
  taxName: String,
  taxPercentage: Number,
  taxValue: String,
  centerId: String


}, { collection: 'Tax' });

mongoose.model('Tax', Tax);

