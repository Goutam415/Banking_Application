var mongoose = require('mongoose'),
  Schema = mongoose.Schema;


var Details = new Schema({
  firstName: { type: String },
  lastName: { type: String },
  middleName: { type: String },
  ifscCode: { type: String },
  address: { type: String },
  accountOpenDate: { type: Date },
  accountCloseDate: { type: Date },
  email: { type: String },
  phoneNumber: { type: String },
  dob: { type: Date },
  occupation: { type: String },
  rateOfInterest: { type: Number }
});



var Transaction = new Schema({
  transactionEmployeeId: { type: String },
  transactorCustName: { type: String },
  transactionId: { type: String },
  transactionType: { type: String },
  transactionAmount: { type: Number },
  balanceAfterTransaction: { type: Number },
  transactionDate: { type: Date }
});

var FDAccount = new Schema({
  fdAccountNumber: { type: Number },
  accountCreatorEmployeeId: { type: String },
  accountClosingEmployeeId: { type: String },
  transactionId: { type: String },
  closingTransactionId: { type: String },
  transactionType: { type: String },
  closingTransactionType: { type: String },
  fdAmount: { type: Number },
  commissionPercentage: { type: Number, default: 5 },
  commissionDeducted: {type: Number },
  rateOfInterest: { type: Number },
  accountOpenDate: { type: Date },
  accountCloseDate: { type: Date },
  accountStatus: { type: String },
  durationOfAccount: { type: Number },
  actuallyAccountClosedDate: { type: Date },
  totalAmountReturned: { type: Number }
});

var RDAccount = new Schema({
  rdAccountNumber: { type: Number },
  accountCreatorEmployeeId: { type: String },
  transactionId: { type: String },
  transactionType: { type: String },
  rdAmount: { type: Number },
  rateOfInterest: { type: Number },
  accountOpenDate: { type: Date },
  accountCloseDate: { type: Date },
  accountStatus: { type: String },
  durationOfAccount: { type: Number },
  totalAmountReturned: { type: Number }
});


var LoanAccount = new Schema({
  accountNumber: { type: Number },
  accountCreatorEmployeeId: { type: String },
  transactionId: { type: String },
  transactionType: { type: String },
  loanAmount: { type: Number },
  rateOfInterest: { type: Number },
  accountOpenDate: { type: Date },
  accountCloseDate: { type: Date },
  accountStatus: { type: String },
  durationOfAccount: { type: Number },
  totalAmountReturned: { type: Number }
});


var AccountCreateSchema = new Schema({
  accountNumber: { type: Number },
  accountBalance: { type: Number },
  customerId: { type: Number },
  accountType: { type: String },
  panNumber: { type: String },
  creatorId: { type: String },
  closerId: { type: String },
  accountStatus: { type: String },
  accountDetails: [Details],
  transactions: [Transaction],
  fdAccount: [FDAccount],
  loanAccount: [LoanAccount],
  rdAccount: [RDAccount]
});



mongoose.model('AccountCreate', AccountCreateSchema);
