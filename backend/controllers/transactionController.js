const Transaction = require('../models/transactionModel');

exports.getAllTransactions = async (req, res) => {
  try {
    const { sessionYear, studentId } = req.query;
    let query = {};
    
    if (sessionYear) {
      query.sessionYear = sessionYear;
    }
    
    if (studentId) {
      query.studentId = studentId;
    }
    
    const transactions = await Transaction.find(query)
      .sort({ date: -1 })
      .lean();
    
    res.status(200).json({ 
      status: 'success', 
      results: transactions.length, 
      data: transactions 
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

exports.getTransactionById = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id).lean();
    if (!transaction)
      return res
        .status(404)
        .json({ status: 'fail', message: 'Transaction not found' });
    res.status(200).json({ status: 'success', data: transaction });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

exports.getTransactionsByStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { sessionYear } = req.query;
    
    let query = { studentId };
    if (sessionYear) {
      query.sessionYear = sessionYear;
    }
    
    const transactions = await Transaction.find(query)
      .sort({ date: -1 })
      .lean();
    
    res.status(200).json({ 
      status: 'success', 
      results: transactions.length, 
      data: transactions 
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

exports.createTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.create(req.body);
    res.status(201).json({ status: 'success', data: transaction });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

exports.updateTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).lean();
    if (!transaction)
      return res
        .status(404)
        .json({ status: 'fail', message: 'Transaction not found' });
    res.status(200).json({ status: 'success', data: transaction });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

exports.deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findByIdAndDelete(req.params.id);
    if (!transaction)
      return res
        .status(404)
        .json({ status: 'fail', message: 'Transaction not found' });
    res.status(200).json({ status: 'success', message: 'Transaction deleted successfully' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// Get fee summary for a student
exports.getStudentFeeSummary = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { sessionYear } = req.query;
    
    let query = { studentId };
    if (sessionYear) {
      query.sessionYear = sessionYear;
    }
    
    const transactions = await Transaction.find(query).lean();
    
    const totalPaid = transactions.reduce((sum, txn) => sum + txn.amount, 0);
    
    // Get fee structure for the student's class (you'll need to implement this)
    // For now, returning mock data
    const totalFee = 5800; // This should come from fee structure
    
    res.status(200).json({
      status: 'success',
      data: {
        studentId,
        sessionYear,
        totalFee,
        totalPaid,
        balance: totalFee - totalPaid,
        transactionCount: transactions.length,
        transactions: transactions.slice(0, 5) // Last 5 transactions
      }
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};