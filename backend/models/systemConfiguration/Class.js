const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  class_code: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  class_name: {
    type: String,
    required: true,
    trim: true
  },
  class_order: {
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
classSchema.index({ class_code: 1 }, { unique: true });
classSchema.index({ class_order: 1 });
classSchema.index({ is_active: 1 });

module.exports = mongoose.model('Class', classSchema);
