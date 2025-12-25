const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    middleName: { type: String, default: '' },
    lastName: { type: String, default: '' },
    email: { type: String, unique: true },
    contactNo: { type: String , required:true, unique:true},
    additionalContactNo: { type: String }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Admin', adminSchema);
