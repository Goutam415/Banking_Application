var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var _ = require('lodash');
var logger = require('winston');

/**
 *  Observation Schema
 */
var Observation = new Schema({
  idObservation: { type: Schema.Types.ObjectId },
  notes: { type: String }
});
/**
 *  Comaplaint Schema
 */
var Comaplaint = new Schema({
  idComplaint: { type: Schema.Types.ObjectId },
  notes: { type: String }
});

/**
 *  Investigation Schema
 */
var Investigation = new Schema({
  idInvestigation: { type: Schema.Types.ObjectId },
  notes: { type: String }
});

/**
 *  Diagnosis Schema
 */
var Diagnosis = new Schema({
  idDiagnosis: { type: Schema.Types.ObjectId },
  notes: { type: String }
});


/**
 *  Note Schema
 */
var Note = new Schema({
  date: { type: Date, default: Date.now },
  complaints: { type: [Comaplaint] },
  observations: { type: [Observation] },
  investigations: { type: [Observation] },
  diagnoses: { type: [Observation] },
  createdBy: { type: Schema.Types.ObjectId, ref: 'Staff', required: true },
  createdAt: { type: Date, default: Date.now },
  modifiedAt: { type: Date, default: Date.now }
});
/**
 *  TreatmentPlan Schema
 */
var TreatmentPlan = new Schema({
  idTreatmentPlan: { type: Schema.Types.ObjectId, required: true },
  discount: {
    id: { type: Schema.Types.ObjectId },
    amount: { type: Number },
    isOffer: { type: Boolean },
    idOffer: { type: Schema.Types.ObjectId },
    type: { type: String }
  },
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: Schema.Types.ObjectId, ref: 'Staff', required: true },
  notes: { type: String },
  modifiedAt: { type: Date, default: Date.now },
  amount: { type: Number },
  variants: [{
    quantity: { type: Number },
    teeth: { type: Array }
  }]

});

/**
 *  TreatmentPlan Schema
 */
var CompletedProcedure = new Schema({
  idProcedure: { type: Schema.Types.ObjectId, required: true },
  discount: {
    id: { type: Schema.Types.ObjectId },
    amount: { type: Number },
    isOffer: { type: Boolean },
    idOffer: { type: Schema.Types.ObjectId },
    type: { type: String }
  },
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: Schema.Types.ObjectId, ref: 'Staff', required: true },
  notes: { type: [String] },
  modifiedAt: { type: Date, default: Date.now },
  variants: [{
    quantity: { type: Number }
  }]

});

/**
 *  Vital Schema
 */
var Vital = new Schema({
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: Schema.Types.ObjectId, ref: 'Staff', required: true },
  modifiedAt: { type: Date, default: Date.now },
  signs: [{
    key: { type: String },
    value: { type: Number },
    unit: { type: String }
  }]
});
/**
 *  File Schema
 */
var File = new Schema({
  createdAt: { type: Date, default: Date.now },
  modifiedAt: { type: Date, default: Date.now },
  uploadedBy: { type: Schema.Types.ObjectId, ref: 'Staff', required: true },
  path: { type: String },
  label: { type: String }
});

/**
 *  Drug Schema
 */
var Drug = new Schema({
  idDrug: { type: Schema.Types.ObjectId, required: true },
  strength: {
    value: { type: Number },
    unit: { type: String }
  },
  duration: {
    value: { type: Number },
    unit: { type: String }
  },
  interval: [{
    key: { type: String },
    value: { type: Number }
  }],
  when: {
    key: { type: String },
    value: { type: Boolean }
  },
  instructions: { type: [String] }
});

/**
 *  Prescription Schema
 */
var Prescription = new Schema({
  id: { type: Schema.Types.ObjectId, required: true },
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: Schema.Types.ObjectId, ref: 'Staff', required: true },
  drugs: { type: [Drug] }
});


/**
 *  Consultation Schema
 */
var Consultation = new Schema({
  centerId: { type: Schema.Types.ObjectId, ref: 'Center', required: true },
  patientId: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
  appointments: { type: [Schema.Types.ObjectId] },
  notes: { type: [Note] },
  treatmentPlans: { type: [TreatmentPlan] },
  completedProcedures: { type: [CompletedProcedure] },
  vitals: { type: [Vital] },
  files: { type: [File] },
  Prescription: { type: [Prescription] }
});


mongoose.model('Consultation', Consultation);
