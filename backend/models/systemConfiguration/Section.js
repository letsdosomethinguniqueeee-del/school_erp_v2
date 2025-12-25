const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema({
  section_code: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  section_name: {
    type: String,
    required: true,
    trim: true
  },
  section_order: {
    type: Number,
    default: 0
  },
  is_active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true // This automatically adds created_at and updated_at
});

// Indexes for better query performance
sectionSchema.index({ section_code: 1 }, { unique: true });
sectionSchema.index({ section_order: 1 });
sectionSchema.index({ is_active: 1 });

module.exports = mongoose.model('Section', sectionSchema);
