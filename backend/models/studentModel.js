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
    fatherMobile: { type: String, default: '', required: true },

    motherFirstName: { type: String, required: true },
    motherMiddleName: { type: String, default: '' },
    motherLastName: { type: String, default: '' },
    motherMobile: { type: String, default: '', required: true },

    parent1Id: {type:String, required:true},
    parent1Relation: {type:String, required:true},
    parent2Id: {type:String, required:true},
    parent2Relation: {type:String, required:true},


    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
    dateOfBirth: { type: Date, required: true },

    category: { type: String, required: true },
    community: { type: String, required: true },
    nationality: { type: String, required: true },
    bloodGroup: { type: String, default: '', required: true },

    aadharCardNo: { type: String, required: true },
    contactNo: { type: String, required: true },
    additionalContactNo: { type: String, required: true },
    email: { type: String, sparse: true, required: true },

    admissionYear: { type: Number , required: true},

    currentStudyClass: { type: String , required: true},
    currentSection: { type: String , required: true},
    currentMedium: { type: String , required: true}, // NEW - Medium of instruction
    currentStream: { type: String , required: true}, // NEW - Stream (Science, Commerce, Arts, etc.)
    subjects: [{ type: String , required: true}], // NEW - Array of subjects
    currentAcademicYear: { type: String , required: true}, // NEW - "2024-25"

    // Academic Year-wise Concession (replaces single concession)
    concessions: [{
      academicYear: { type: String, required: true },
      percentage: { type: Number, required: true, min: 0, max: 100 },
      reason: { type: String, default: '' },
      isActive: { type: Boolean, default: true },
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date, default: Date.now }
    }],

    // Legacy concession fields (keep for backward compatibility, will be migrated)
    concessionPercentage: { type: Number, default: 0, min: 0, max: 100 },
    concessionReason: { type: String, default: '' },

    pic: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Student', studentSchema);