'use strict';

var _ = require('lodash'),
  config = require('../config'),
  mongoose = require('mongoose'),
  chalk = require('chalk'),
  crypto = require('crypto');


const rolesData = require('../../db/populate/roles');

const SMSData = require('../../db/populate/smsTemplate');
const EmailData = require('../../db/populate/emailTemplate');

// global seed options object
var seedOptions = {};

/* function saveSalesAdmin() {
  const salesData = salesAdminData.salesAdmin;
  const SalesAdmin = mongoose.model('SalesAdmin');
  SalesAdmin.update({ email: salesData.email }, salesAdminData.salesAdmin, { upsert: true }, function (err) {
  if (err) {
      console.log('error');
    } else {
      console.log('success');
    }
});

  var SalesAdminModel = new SalesAdmin(salesAdminData.salesAdmin);
  SalesAdminModel.save(function (err) {
    if (err) {
      console.log('error');
    } else {
      console.log('success');
    }
  });

} */

function addPermissions() {

  var Permissions = mongoose.model('Permissions');
  Permissions.update({ id: rolesData.permissions.id }, rolesData.permissions, { upsert: true }, function (err) {
    if (err) {
      console.log('error while seeding permissions ');
    } else {
      console.log('seeding permissions success');
    }
  });
}

function addGroups() {
  var Groups = mongoose.model('Groups');
  var groupData = rolesData.groups;
  _.each(groupData, function(value, key) {
    var group = { 'name': key,
                  'permissions': value
                };
    Groups.update({ name: group.name }, group, { upsert: true }, function (err) {
      if (err) {
        console.log(' error while adding groups');
      } else {
        console.log(' successfully added groups');
      }
    });
  });
}


function addRoles() {

  var Roles = mongoose.model('Roles');
  var roleData = rolesData.roles;
  _.each(roleData, function(role, index) {
    Roles.update({ name: role.name }, role, { upsert: true }, function (err) {
      if (err) {
        console.log(' error while adding roles');
      } else {
        console.log(' successfully added  roles');
      }
    });
  });
}
// function addSMSTemplates() {
//   // SMS and email templates
//   var SMS = mongoose.model('SMS');
//   var Attributea = mongoose.model('Attributes');
//   SMS.remove({}, function (err, data) {
//     _.each(SMSData.templates, function (template, index) {
//       var newSMS = new SMS(template);
//       newSMS.save(function (err) {
//         if (err) {
//           console.log('error while adding SMS templates');
//         } else {
//           console.log('SMS template added successfully');
//         }
//       });
//     });


//   });

// }
// function addEmailTemplates() {
//   var Email = mongoose.model('Email');
//   var Attributea = mongoose.model('Attribute');
//   Email.remove({}, function (err, data) {
//     _.each(EmailData.templates, function (template, index) {
//       var newEmail = new Email(template);
//       newEmail.save(function (err) {
//         if (err) {
//           console.log('error while adding Email templates');
//         } else {
//           console.log('Email template added successfully');
//         }
//       });
//     });
//   });

// }
module.exports.start = function start(options) {
  // Initialize the default seed options
  seedOptions = _.clone(config.seedDB.options, true);

  // Check for provided options

  if (_.has(options, 'logResults')) {
    seedOptions.logResults = options.logResults;
  }
  // saveSalesAdmin();
  addPermissions();
  addGroups();
  addRoles();
  // addSMSTemplates();
  // addEmailTemplates();
};
