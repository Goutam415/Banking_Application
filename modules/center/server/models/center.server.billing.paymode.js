var mongoose = require('mongoose');

var Schema = mongoose.Schema;


var Paymode = new Schema({
  id: Number,
  mode: String,
  type: String,
  fee: Number,
  centerId: String

});

mongoose.model('Paymode', Paymode);

