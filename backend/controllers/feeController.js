const Fee = require('../models/feeStructure');

exports.getAllFees = async (req, res) => {
  try {
    const { sessionYear } = req.query;
    let query = {};
    
    if (sessionYear) {
      query.SessionYear = sessionYear;
    }
    
    const fees = await Fee.find(query).lean();
    res
      .status(200)
      .json({ status: 'success', results: fees.length, data: fees });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

exports.getFeeById = async (req, res) => {
  try {
    const fee = await Fee.findById(req.params.id).lean();
    if (!fee)
      return res
        .status(404)
        .json({ status: 'fail', message: 'Fee structure not found' });
    res.status(200).json({ status: 'success', data: fee });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

exports.getFeeByClass = async (req, res) => {
  try {
    const { class: className, sessionYear } = req.params;
    const fee = await Fee.findOne({ 
      Class: className, 
      SessionYear: sessionYear 
    }).lean();
    if (!fee)
      return res
        .status(404)
        .json({ status: 'fail', message: 'Fee structure not found for this class' });
    res.status(200).json({ status: 'success', data: fee });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

exports.createFee = async (req, res) => {
  try {
    const fee = await Fee.create(req.body);
    res.status(201).json({ status: 'success', data: fee });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

exports.updateFee = async (req, res) => {
  try {
    const fee = await Fee.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).lean();
    if (!fee)
      return res
        .status(404)
        .json({ status: 'fail', message: 'Fee record not found' });
    res.status(200).json({ status: 'success', data: fee });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

exports.deleteFee = async (req, res) => {
  try {
    const fee = await Fee.findByIdAndDelete(req.params.id);
    if (!fee)
      return res
        .status(404)
        .json({ status: 'fail', message: 'Fee structure not found' });
    res.status(200).json({ status: 'success', message: 'Fee structure deleted successfully' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};
