const mongoose = require('mongoose');

const parentSchema = new mongoose.Schema(
  {
    parentFirstName: { type: String, required: true },
    parentMiddleName: { type: String, default: '' },
    parentLastName: { type: String, default: '' },


    parentContactNo: { type: String , required:true, unique:true},
    additionalContactNo: { type: String },

    email: { type: String, unique: true },

    parentPic: { type: String }

  },
  { timestamps: true }
);


module.exports = mongoose.model('Parent', parentSchema);
