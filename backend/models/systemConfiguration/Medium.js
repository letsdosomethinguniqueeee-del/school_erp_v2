const mongoose = require('mongoose');

const mediumSchema = new mongoose.Schema({
  medium_code: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  medium_name: {
    type: String,
    required: true,
    trim: true
  },
  is_active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true // This automatically adds created_at and updated_at
});

// Indexes for better query performance
mediumSchema.index({ medium_code: 1 }, { unique: true });
mediumSchema.index({ is_active: 1 });

module.exports = mongoose.model('Medium', mediumSchema);
