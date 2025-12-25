const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  identifier: { type: String, required: true }, // email or mobile
  otp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 300 } // auto delete after 5 mins
});

module.exports = mongoose.model('Otp', otpSchema);
