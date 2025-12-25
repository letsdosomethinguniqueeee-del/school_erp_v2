const mongoose = require('mongoose');

const feeStructure = new mongoose.Schema(
  {
    
    SessionYear: {type:String, required:true},
    Class: {type:String, required:true},
    FeesBreakDown : [
      {
        title: {
          type: String,
        },
        amount: {
          type: String,
        },
      },
    ], // {title , fees}
    InstallmentBreakDown : [
      {
        installment: {
          type: String,
        },
        amount: {
          type: String,
        },
        dueDate : {
          type:Date,
        }
      },
    ],

  },
  { timestamps: true }
);



module.exports = mongoose.model('Fee', feeStructure);
