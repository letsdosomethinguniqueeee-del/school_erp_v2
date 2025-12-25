const mongoose = require('mongoose');

const examinationMarksSchema = new mongoose.Schema({
  student_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  academic_year_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AcademicYear',
    required: true
  },
  exam_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Examination',
    required: true
  },
  class_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true
  },
  section_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Section',
    required: true
  },
  medium_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Medium',
    required: true
  },
  subject_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true
  },
  marks_obtained: {
    type: Number,
    required: true,
    min: 0
  },
  max_marks: {
    type: Number,
    required: true,
    min: 0
  },
  is_absent: {
    type: Boolean,
    default: false
  },
  remarks: {
    type: String,
    default: ''
  },
  is_published: {
    type: Boolean,
    default: false
  },
  published_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  published_at: {
    type: Date
  },
  is_final_published: {
    type: Boolean,
    default: false
  },
  final_published_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  final_published_at: {
    type: Date
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  updated_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indexes for better query performance
examinationMarksSchema.index({ student_id: 1, exam_id: 1, subject_id: 1 }, { unique: true });
examinationMarksSchema.index({ academic_year_id: 1 });
examinationMarksSchema.index({ class_id: 1, section_id: 1 });
examinationMarksSchema.index({ exam_id: 1 });

module.exports = mongoose.model('ExaminationMarks', examinationMarksSchema);
