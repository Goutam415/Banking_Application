

var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var logger = require('winston');
var Staff = mongoose.model('Staff');


var StaffNote = new Schema({
  docconfirmationSMS: { type: Boolean, default: false },
  docscheduleSMS: { type: Boolean, default: false },
  docconfirmationemail: { type: Boolean, default: false },
  docscheduleemail: { type: Boolean, default: false },
  staffscheduleSMS: { type: Boolean, default: false },
  staffscheduleEmail: { type: Boolean, default: false },
  staffonlineappSMS: { type: Boolean, default: false },
  Idcenter: String

}, { collection: 'center' });

mongoose.model('StaffNote', StaffNote);

