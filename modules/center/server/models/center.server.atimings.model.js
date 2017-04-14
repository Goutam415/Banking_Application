var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var TimingSchema = new Schema({
  timing: [
    {
      startTime: { type: String },
      endTime: { type: String }
    },
    {
      startTime: { type: String },
      endTime: { type: String }
    }
  ],
  isOpen: { type: Boolean, required: true }
});

mongoose.model('Timing', TimingSchema);
