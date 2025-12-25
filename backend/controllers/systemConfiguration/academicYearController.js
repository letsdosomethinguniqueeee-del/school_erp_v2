const AcademicYear = require('../../models/systemConfiguration/AcademicYear');
const { sendSuccess, sendError } = require('../../utils/response');

// Create a new academic year
exports.createAcademicYear = async (req, res) => {
  try {
    const { year_code, start_date, end_date, status } = req.body;
    
    const startDate = new Date(start_date);
    const endDate = new Date(end_date);
    
    if (startDate >= endDate) {
      return sendError(res, 400, 'Start date must be before end date');
    }

    // Check if academic year already exists
    const existingYear = await AcademicYear.findOne({ year_code });
    if (existingYear) {
      return sendError(res, 409, 'Academic year with this code already exists');
    }

    // Create new academic year
    const academicYear = new AcademicYear({
      year_code,
      start_date,
      end_date,
      status
    });

    await academicYear.save();

    return sendSuccess(res, 201, 'Academic year created successfully', academicYear);
  } catch (error) {
    console.error('Error creating academic year:', error);
    return sendError(res, 500, 'Failed to create academic year');
  }
};

// Get all academic years
exports.getAllAcademicYears = async (req, res) => {
  try {
    const academicYears = await AcademicYear.find({})
      .sort({ createdAt: -1 })
      .lean();

    return sendSuccess(res, 200, 'Academic years retrieved successfully', academicYears);
  } catch (error) {
    console.error('Error fetching academic years:', error);
    return sendError(res, 500, 'Failed to fetch academic years');
  }
};

// Get single academic year by ID
exports.getAcademicYearById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const academicYear = await AcademicYear.findById(id);
    if (!academicYear) {
      return sendError(res, 404, 'Academic year not found');
    }

    return sendSuccess(res, 200, 'Academic year retrieved successfully', academicYear);
  } catch (error) {
    console.error('Error fetching academic year:', error);
    return sendError(res, 500, 'Failed to fetch academic year');
  }
};

// Update academic year
exports.updateAcademicYear = async (req, res) => {
  try {
    const { id } = req.params;
    const { year_code, start_date, end_date, status } = req.body;

    const academicYear = await AcademicYear.findById(id);
    if (!academicYear) {
      return sendError(res, 404, 'Academic year not found');
    }

    // Validate dates if provided
    if (start_date && end_date) {
      const startDate = new Date(start_date);
      const endDate = new Date(end_date);
      
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return sendError(res, 400, 'Invalid date format');
      }

      if (startDate >= endDate) {
        return sendError(res, 400, 'Start date must be before end date');
      }
    }

    // Check for duplicate year code if updating
    if (year_code && year_code !== academicYear.year_code) {
      const existingYear = await AcademicYear.findOne({ 
        year_code, 
        _id: { $ne: id } 
      });
      if (existingYear) {
        return sendError(res, 409, 'Academic year with this code already exists');
      }
    }

    // Update fields
    const updateData = {};
    if (year_code) updateData.year_code = year_code;
    if (start_date) updateData.start_date = start_date;
    if (end_date) updateData.end_date = end_date;
    if (status) updateData.status = status;

    const updatedAcademicYear = await AcademicYear.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    return sendSuccess(res, 200, 'Academic year updated successfully', updatedAcademicYear);
  } catch (error) {
    console.error('Error updating academic year:', error);
    return sendError(res, 500, 'Failed to update academic year');
  }
};

// Delete academic year
exports.deleteAcademicYear = async (req, res) => {
  try {
    const { id } = req.params;
    
    const academicYear = await AcademicYear.findById(id);
    if (!academicYear) {
      return sendError(res, 404, 'Academic year not found');
    }

    await AcademicYear.findByIdAndDelete(id);
    return sendSuccess(res, 200, 'Academic year deleted successfully');
  } catch (error) {
    console.error('Error deleting academic year:', error);
    return sendError(res, 500, 'Failed to delete academic year');
  }
};

// Get current academic year
exports.getCurrentAcademicYear = async (req, res) => {
  try {
    const currentDate = new Date();
    
    const currentYear = await AcademicYear.findOne({
      start_date: { $lte: currentDate },
      end_date: { $gte: currentDate },
      status: 'current'
    });

    if (!currentYear) {
      return sendError(res, 404, 'No current academic year found');
    }

    return sendSuccess(res, 200, 'Current academic year retrieved successfully', currentYear);
  } catch (error) {
    console.error('Error fetching current academic year:', error);
    return sendError(res, 500, 'Failed to fetch current academic year');
  }
};