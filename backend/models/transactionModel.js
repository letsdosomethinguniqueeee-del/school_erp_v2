const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    date: { type: Date, required: true },
    time: { type: String },

    studentId: {
      type: String,
      required: true,
    },

    sessionYear : {type:String},
    amount: { type: Number, required: true },
    amountMode: { type: String },

    feesType: { type: String },

    transactionId: { type: String },
    receiptId: { type: String },
  },
  {
    timestamps: true,
  }
);


module.exports = mongoose.model('Transaction', transactionSchema);
