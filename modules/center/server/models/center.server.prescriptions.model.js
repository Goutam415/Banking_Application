var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var Categories = new Schema({
  DrugTypeName: String
});

var MeasurementUnit = new Schema({
  Unit: String
});

var Drugs = new Schema({
  DrugName: String,
  DrugInstruction: String,
  DrugStrength: String,
  idDrugType: String,
  idDrugUnit: String
});

var Prescriptions = new Schema({
  drugType: Categories,
  unit: MeasurementUnit,
  drugs: Drugs,
  centerId: String
});

mongoose.model('Prescriptions', Prescriptions);

