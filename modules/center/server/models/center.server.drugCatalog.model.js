var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var DrugCat = new Schema({
  id: Number,
  drugName: String,
  drugType: String,
  drugUnits: String,
  drugStrength: Number,
  drugInstructions: String,
  centerId: String
}, { collection: 'DrugCatalog' });

var Categories = new Schema({
  DrugTypeName: String
});

var Measurements = new Schema({
  Unit: String
});

var Drugs = new Schema({
  DrugName: String,
  DrugInstruction: String,
  DrugStrength: String
});

var prescriptions = new Schema({
  drugType: [Categories],
  unit: [Measurements],
  drugs: [Drugs],
  centerId: String
});

mongoose.model('DrugCat', DrugCat);

