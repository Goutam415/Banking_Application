var mongoose = require('mongoose'),
  Schema = mongoose.Schema;


var Details = new Schema({
  firstName: { type: String },
  lastName: { type: String },
  middleName: { type: String },
  ifscCode: { type: String },
  address: { type: String },
  accountOpenDate: { type: Date },
  email: { type: String },
  phoneNumber: { type: String },
  dob: { type: Date },
  occupation: { type: String }
});



var Transaction = new Schema({
  transactionEmployeeId: { type: Number },
  transactorCustName: { type: String },
  transactionId: { type: String },
  transactionType: { type: String },
  transactionAmount: { type: Number },
  balanceAfterTransaction: { type: Number },
  transactionDate: { type: Date }
});




var AccountCreateSchema = new Schema({
  accountNumber: { type: Number },
  customerId: { type: Number },
  accountType: { type: String },
  panNumber: { type: String },
  creatorId: { type: Number },
  accountDetails: [Details],
  transactions: [Transaction]
});



mongoose.model('AccountCreate', AccountCreateSchema);
