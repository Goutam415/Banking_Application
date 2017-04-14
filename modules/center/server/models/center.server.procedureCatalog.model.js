var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var Categories = new Schema({
  procedureCategory: String
});

var catalog = new Schema({
  procedureName: String,
  idCategory: String,
  procedureCost: Number,
  xTooth: Boolean,
  notes: String,
  isTaxTDS: Boolean,
  isTaxVAT: Boolean
});

var ProcedureCatalog = new Schema({
  centerId: String,
  CategoryName: [Categories],
  proceduresList: [catalog]
  // VariableParams: Arrayofstrings
}, { collection: 'ProcedureCatalog' });

mongoose.model('ProcedureCatalog', ProcedureCatalog);
