
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var Roles = new Schema({
  roleName: { type: String },
  permissions: { type: Array },
  groups: { type: Array }
});


mongoose.model('Roles', Roles);
