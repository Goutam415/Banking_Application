var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var AppointmentSchema = new Schema({
  idPatient: { type: Schema.Types.ObjectId, ref: 'Patient' },
  idDoctor: { type: Schema.Types.ObjectId, ref: 'Staff' },
  idCenter: { type: Schema.Types.ObjectId, ref: 'Center' },
  idCustomer: { type: Schema.Types.ObjectId, ref: 'Customer' },
  title: { type: String },
  start: { type: Date, default: Date.now },
  end: { type: Date },
  allDay: { type: String },
  type: { type: String, enum: ['emergency', 'normal'] },
  calColor: { type: String },
  info: { type: String },
  status: { type: String, enum: ['created', 'arrived', 'waiting', 'progress', 'completed'] }
}, {
  toObject: {
    virtuals: true
  },
  toJSON: {
    virtuals: true
  }
});


AppointmentSchema.virtual('idAppointment').get(function() {
  return this._id;
});

mongoose.model('Appointment', AppointmentSchema);
