const Parent = require('../models/parentModel');

exports.getAllParents = async (req, res) => {
  try {
    const parents = await Parent.find().lean();
    res
      .status(200)
      .json({ status: 'success', results: parents.length, data: parents });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

exports.getParentById = async (req, res) => {
  try {
    const parent = await Parent.findById(req.params.id).lean();
    if (!parent)
      return res
        .status(404)
        .json({ status: 'fail', message: 'Parent not found' });
    res.status(200).json({ status: 'success', data: parent });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

exports.createParent = async (req, res) => {
  try {
    const parent = await Parent.create(req.body);
    res.status(201).json({ status: 'success', data: parent });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

exports.updateParent = async (req, res) => {
  try {
    const parent = await Parent.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).lean();
    if (!parent)
      return res
        .status(404)
        .json({ status: 'fail', message: 'Parent not found' });
    res.status(200).json({ status: 'success', data: parent });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

exports.deleteParent = async (req, res) => {
  try {
    const parent = await Parent.findByIdAndDelete(req.params.id);
    if (!parent)
      return res
        .status(404)
        .json({ status: 'fail', message: 'Parent not found' });
    res.status(204).json({ status: 'success', data: null });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};
