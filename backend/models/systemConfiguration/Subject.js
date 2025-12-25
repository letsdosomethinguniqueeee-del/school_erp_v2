const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  subject_code: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true
  },
  subject_name: {
    type: String,
    required: true,
    trim: true
  },
  is_active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for performance
subjectSchema.index({ subject_code: 1 }, { unique: true });
subjectSchema.index({ is_active: 1 });

module.exports = mongoose.model('Subject', subjectSchema);