const mongoose = require('mongoose');

const streamSchema = new mongoose.Schema({
  stream_code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
    maxlength: 10
  },
  stream_name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  is_active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for better query performance
streamSchema.index({ stream_code: 1 });
streamSchema.index({ is_active: 1 });

module.exports = mongoose.model('Stream', streamSchema);
