const Student = require('../models/studentModel');
const Fee = require('../models/feeStructure');
const Transaction = require('../models/transactionModel');

exports.getAllStudentsWithFees = async (req, res) => {
  try {
    const { class: className, sessionYear } = req.query;
    const studentFilter = className ? { currentStudyClass: className } : {};
    const students = await Student.find(studentFilter).lean();
    
    // Get fee structure for the class
    let feeStructure = null;
    if (className && sessionYear) {
      feeStructure = await Fee.findOne({ 
        Class: className, 
        SessionYear: sessionYear 
      }).lean();
    }
    
    // Get transactions for students
    const studentIds = students.map((s) => s._id.toString());
    const transactions = await Transaction.find({ 
      studentId: { $in: studentIds },
      ...(sessionYear && { sessionYear })
    }).lean();

    res.status(200).json({ 
      status: 'success', 
      data: { students, feeStructure, transactions } 
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

exports.getStudentFeeDetails = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { sessionYear } = req.query;
    
    const student = await Student.findById(studentId).lean();
    if (!student)
      return res
        .status(404)
        .json({ status: 'fail', message: 'Student not found' });

    // Get fee structure for the student's class
    let feeStructure = null;
    if (student.currentStudyClass && sessionYear) {
      feeStructure = await Fee.findOne({ 
        Class: student.currentStudyClass, 
        SessionYear: sessionYear 
      }).lean();
    }

    // Get transactions for the student
    const transactions = await Transaction.find({ 
      studentId,
      ...(sessionYear && { sessionYear })
    }).sort({ date: -1 }).lean();

    // Calculate fee summary
    const totalPaid = transactions.reduce((sum, txn) => sum + txn.amount, 0);
    const totalFee = feeStructure ? 
      feeStructure.FeesBreakDown.reduce((sum, fee) => sum + parseFloat(fee.amount || 0), 0) : 0;

    res.status(200).json({ 
      status: 'success', 
      data: { 
        student, 
        feeStructure, 
        transactions,
        feeSummary: {
          totalFee,
          totalPaid,
          balance: totalFee - totalPaid,
          transactionCount: transactions.length
        }
      } 
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};
