const mongoose = require('mongoose');

const academicYearSchema = new mongoose.Schema({
  year_code: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  start_date: {
    type: Date,
    required: true
  },
  end_date: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['upcoming', 'current', 'completed'],
    default: 'upcoming'
  }
}, {
  timestamps: true // This automatically adds created_at and updated_at
});

// Index for better query performance
academicYearSchema.index({ year_code: 1 }, { unique: true });
module.exports = mongoose.model('AcademicYear', academicYearSchema);
