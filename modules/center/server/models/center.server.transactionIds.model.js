var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var TransactionIdSchema = new Schema({
  transactionId: { type: String }
});



mongoose.model('TransactionId', TransactionIdSchema);
