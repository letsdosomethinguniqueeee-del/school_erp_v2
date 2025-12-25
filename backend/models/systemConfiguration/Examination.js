const mongoose = require('mongoose');

const examinationSchema = new mongoose.Schema({
  exam_code: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true
  },
  exam_name: {
    type: String,
    required: true,
    trim: true
  },
  max_marks: {
    type: Number,
    default: 100
  },
  class_ids: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class'
  }],
  medium_ids: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Medium'
  }]
}, {
  timestamps: true
});

// Indexes
examinationSchema.index({ exam_code: 1 }, { unique: true });

module.exports = mongoose.model('Examination', examinationSchema);
