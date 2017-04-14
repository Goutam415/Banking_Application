var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var Groups = new Schema({
  name: { type: String },
  permissions: { type: Array }
});

mongoose.model('Groups', Groups);
