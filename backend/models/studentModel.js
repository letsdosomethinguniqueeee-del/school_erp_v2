const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    middleName: { type: String, default: '' },
    lastName: { type: String, default: '' },


    studentId: {type:String, required:true, unique:true},
    rollNo: { type: String, required:true },
    govtProvidedId : {type:String},
    
    fatherFirstName: { type: String, required: true },
    fatherMiddleName: { type: String, default: '' },
    fatherLastName: { type: String, default: '' },
    fatherMobile: { type: String, default: '' },

    motherFirstName: { type: String, required: true },
    motherMiddleName: { type: String, default: '' },
    motherLastName: { type: String, default: '' },
    motherMobile: { type: String, default: '' },

    parent1Id: {type:String },
    parent1Relation: {type:String},
    parent2Id: {type:String },
    parent2Relation: {type:String},


    gender: { type: String, enum: ['Male', 'Female', 'Other'] },
    dateOfBirth: { type: Date },

    category: { type: String },
    community: { type: String },
    nationality: { type: String },
    bloodGroup: { type: String, default: '' },

    aadharCardNo: { type: String },
    contactNo: { type: String },
    additionalContactNo: { type: String },
    email: { type: String, sparse: true },

    admissionYear: { type: mongoose.Schema.Types.ObjectId, ref: 'AcademicYear' },

    currentStudyClass: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
    currentSection: { type: mongoose.Schema.Types.ObjectId, ref: 'Section' },
    medium: { type: mongoose.Schema.Types.ObjectId, ref: 'Medium' },

    // Concession fields
    concessionPercentage: { type: Number, default: 0, min: 0, max: 100 },
    concessionReason: { type: String, default: '' },

    pic: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Student', studentSchema);
