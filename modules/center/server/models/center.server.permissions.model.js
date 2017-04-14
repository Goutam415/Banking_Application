'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;


var PermissionSchema = new Schema({
  id: { type: Number },
  permissions: { type: Array }
});

mongoose.model('Permissions', PermissionSchema);
