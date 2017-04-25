var patients = [{
    'userID': 'saurabh.simpyD7qba3kkqi',
    'name': 'Saurabh Jha',
    'ownerID': '572dae73f424fc4413486a5d',
    'mobile': 7406446615,
    'alternate_number': 9167905808,
    'age': 36,
    'dob': '1980-05-06T18:30:00.000Z',
    'bloodGroup': 'B+',
    'gender': 'M',
    'email': 'saurabh.simpy@gmail.com',
    'address': {
      'pinCode': 560021,
      'state': 'Karnataka',
      'city': 'Bangalore',
      'landamrk': 'UCB showroom',
      'addressLine2': 'Indira nagar',
      'addressLine1': '21 cross'
    },
    'city': 'Bangalore',
    'pinCode': 560021,
    'image': '',
    'signature': '',
    'updatedAt': 1462615144123,
    'createdAt': 1462615144123,
    'referredBy': 'Rk',
    'medicalVitalSign': [
      'fever',
      'cancer'
    ]
  },

  {
    'userID': 'suryafactspnDmQiz0Kz',
    'name': 'Surya Teja',
    'ownerID': '572dae73f424fc4413486a5d',
    'mobile': 8867871290,
    'alternate_number': 9167905808,
    'age': 36,
    'dob': '1980-05-06T18:30:00.000Z',
    'bloodGroup': 'O+',
    'gender': 'M',
    'email': 'suryafacts@gmail.com',
    'address': {
      'pinCode': 560043,
      'state': 'Karnataka',
      'city': 'Bangalore',
      'landamrk': 'KFC',
      'addressLine2': 'Koramangala',
      'addressLine1': '19 Cross'
    },
    'city': 'Bangalore',
    'pinCode': 560043,
    'image': '',
    'signature': '',
    'updatedAt': 1462615380093,
    'createdAt': 1462615380093,
    'referredBy': 'Rk',
    'medicalVitalSign': [
      'cold',
      'maleria'
    ]
  }
];

var path = require('path');
var mongoose = require('mongoose');
var Patient = require(path.join(__dirname, '/server/models/Patient'));
var config = require(path.join(__dirname, '/server/config/config.js'));
var _db = mongoose.createConnection(config.patientConfig.mongo_url);
_db.useDb(config.patientConfig.db);

function addPatients() {
  for (var i = 0; i < patients.length; i++) {
    var aPtaient = patients[i];
    Patient.createPatient(aPtaient, function(status, data) {
      if (status) {
        console.log('successsfully added patient');
      } else {
        console.log('Error');
      }
    });
  }

}

// exe
addPatients();

// Media
var share_password_email_template = {
  'templateID': 'password_sharing',
  'type': 'email',
  'subject': 'Your login credentials',
  'content': 'Hi nameval,\nWelcome to trueapps .\npassword:passwordval\n\n\nThanks,\ntrueapps  Team'
};
var Media = require(path.join(__dirname, '/server/models/media'));

function addSharePasswordEmailTemplate() {
  Media.template.createTemplate(share_password_email_template, function(status, data) {
    if (status) {
      console.log('successsfully added template');
    } else {
      console.log('Error while adding template');
    }
  });
}
addSharePasswordEmailTemplate();


var Account = require(path.join(__dirname, 'server/models/account'));
var password = '123456';
mongoose.connect(config.mongo_url);
var user = new Account({ name: 'emenage', email: 'trueapps@gmail.com', mobile: '7406446615', role: 'Admin', owner: '1', pin: '1234', isOwner: true, center: 'abc', _id: '572dae73f424fc4413486a5d' });

function create_customer() {
  console.log('creating customer');
  Account.register(user, password, function(error, account) {
    if (error) {
      console.log(error);
    } else {
      console.log('creted');
    }
    return;
  });

}
create_customer();



var doctorList = [{
    docname: 'Ankit Goel',
    emaildid: 'ankit89m@gmail.com',
    mobile: '9036163563',
    regno: '1234567890',
    calcolor: 'red',
    role: 'doctor',
    pcenter: 'abc'
  },
  {
    docname: 'Ratikanta Patra',
    emaildid: 'iratikanta.patra@gmail.com',
    mobile: '9167905808',
    regno: 'abcdefghi',
    calcolor: 'yellow',
    role: 'doctor',
    pcenter: 'abc'
  },
  {
    docname: 'Sawan Kumar',
    emaildid: 'sawankumar46@gmail.com',
    mobile: '9167905808',
    regno: 'abcdefghi',
    calcolor: 'yellow',
    role: 'doctor',
    pcenter: 'abc'
  }
];



var cost_details = {
  'templateID': 'cost_details',
  'type': 'email',
  'subject': 'Welcome to trueapps ',
  'content': 'Hello titleval nameval,\nWelcome to trueapps .Thank you for enrolling with us.\nYou have subscribed plan_nameval with us.\n\nCost details:\nBase price base_priceval\nService Tax servicetax_percentval servicetax_costval\nVAT vat_percentval vat_costval\nTotal Cost total_costval\nYour credential will reach sortly on your email address.\n\nThanks\ntrueapps  Team'

};

function addTemplate(data) {
  Media.template.createTemplate(data, function(status, data) {
    if (status) {
      console.log('successsfully added template');
    } else {
      console.log('failed to add template' + '\n' + data);
    }
  });
}

addTemplate(cost_details);