const Medium = require('../../models/systemConfiguration/Medium');
const { sendSuccess, sendError } = require('../../utils/response');

// Create a new medium
const createMedium = async (req, res) => {
  try {
    const { medium_code, medium_name, is_active } = req.body;

    // NOTE: Field validation (required, format, type) is handled by validateMedium middleware
    // Only business logic validations are done here

    // Check if medium code already exists
    const existingMedium = await Medium.findOne({ medium_code: medium_code.toUpperCase() });
    if (existingMedium) {
      return sendError(res, 409, 'Medium code already exists');
    }

    // Create new medium
    const medium = new Medium({
      medium_code: medium_code.toUpperCase(),
      medium_name: medium_name.trim(),
      is_active: is_active !== undefined ? is_active : true
    });

    await medium.save();

    return sendSuccess(res, 201, 'Medium created successfully', medium);
  } catch (error) {
    console.error('Error creating medium:', error);
    return sendError(res, 500, 'Internal server error', error.message);
  }
};

// Get all mediums
const getAllMediums = async (req, res) => {
  try {
    const { is_active, search } = req.query;
    
    // Build filter object
    const filter = {};
    
    // Apply is_active filter if provided
    if (is_active !== undefined) {
      filter.is_active = is_active === 'true';
    }
    
    // Apply search filter if provided
    if (search) {
      filter.$or = [
        { medium_code: { $regex: search, $options: 'i' } },
        { medium_name: { $regex: search, $options: 'i' } }
      ];
    }

    const mediums = await Medium.find(filter).sort({ medium_code: 1 });

    return sendSuccess(res, 200, 'Mediums retrieved successfully', mediums);
  } catch (error) {
    console.error('Error fetching mediums:', error);
    return sendError(res, 500, 'Internal server error', error.message);
  }
};

// Get medium by ID
const getMediumById = async (req, res) => {
  try {
    const { id } = req.params;
    const medium = await Medium.findById(id);

    if (!medium) {
      return sendError(res, 404, 'Medium not found');
    }

    return sendSuccess(res, 200, 'Medium retrieved successfully', medium);
  } catch (error) {
    console.error('Error fetching medium:', error);
    return sendError(res, 500, 'Internal server error', error.message);
  }
};

// Update medium
const updateMedium = async (req, res) => {
  try {
    const { id } = req.params;
    const { medium_code, medium_name, is_active } = req.body;

    const medium = await Medium.findById(id);
    if (!medium) {
      return sendError(res, 404, 'Medium not found');
    }

    // Check if new medium code conflicts with existing mediums (excluding current medium)
    if (medium_code && medium_code !== medium.medium_code) {
      const existingMedium = await Medium.findOne({ 
        medium_code: medium_code.toUpperCase(),
        _id: { $ne: id }
      });
      if (existingMedium) {
        return sendError(res, 409, 'Medium code already exists');
      }
    }

    // Update fields
    if (medium_code) medium.medium_code = medium_code.toUpperCase();
    if (medium_name) medium.medium_name = medium_name.trim();
    if (is_active !== undefined) medium.is_active = is_active;

    await medium.save();

    return sendSuccess(res, 200, 'Medium updated successfully', medium);
  } catch (error) {
    console.error('Error updating medium:', error);
    return sendError(res, 500, 'Internal server error', error.message);
  }
};

// Delete medium
const deleteMedium = async (req, res) => {
  try {
    const { id } = req.params;
    const medium = await Medium.findById(id);

    if (!medium) {
      return sendError(res, 404, 'Medium not found');
    }

    await Medium.findByIdAndDelete(id);

    return sendSuccess(res, 200, 'Medium deleted successfully');
  } catch (error) {
    console.error('Error deleting medium:', error);
    return sendError(res, 500, 'Internal server error', error.message);
  }
};

// Get active mediums
const getActiveMediums = async (req, res) => {
  try {
    const mediums = await Medium.find({ is_active: true }).sort({ medium_code: 1 });
    return sendSuccess(res, 200, 'Active mediums retrieved successfully', mediums);
  } catch (error) {
    console.error('Error fetching active mediums:', error);
    return sendError(res, 500, 'Internal server error', error.message);
  }
};

module.exports = {
  createMedium,
  getAllMediums,
  getMediumById,
  updateMedium,
  deleteMedium,
  getActiveMediums
};
