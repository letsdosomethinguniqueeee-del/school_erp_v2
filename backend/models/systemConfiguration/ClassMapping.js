const mongoose = require('mongoose');

const classMappingSchema = new mongoose.Schema({
  class_name: {
    type: String,
    required: true,
    trim: true
  },
  medium: {
    type: String,
    required: true
  },
  stream: {
    type: String,
    required: true
  },
  subjects: [{
    type: String,
    required: true
  }],
  sections: [{
    type: String,
    required: true
  }],
  is_active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true // This automatically adds created_at and updated_at
});

// Indexes for better query performance
classMappingSchema.index({ class_name: 1 });
classMappingSchema.index({ stream: 1 });
classMappingSchema.index({ is_active: 1 });

module.exports = mongoose.model('ClassMapping', classMappingSchema);
