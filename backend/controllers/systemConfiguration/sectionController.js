const Section = require('../../models/systemConfiguration/Section');
const { sendSuccess, sendError } = require('../../utils/response');

// Create a new section
const createSection = async (req, res) => {
  try {
    const { section_code, section_name, section_order, is_active } = req.body;

    // NOTE: Field validation (required, format, type) is handled by validateSection middleware
    // Only business logic validations are done here

    // Check if section code already exists
    const existingSection = await Section.findOne({ section_code: section_code.toUpperCase() });
    if (existingSection) {
      return sendError(res, 409, 'Section code already exists');
    }

    // Create new section
    const section = new Section({
      section_code: section_code.toUpperCase(),
      section_name: section_name.trim(),
      section_order: section_order || 0,
      is_active: is_active !== undefined ? is_active : true
    });

    await section.save();

    return sendSuccess(res, 201, 'Section created successfully', section);
  } catch (error) {
    console.error('Error creating section:', error);
    return sendError(res, 500, 'Internal server error', error.message);
  }
};

// Get all sections
const getAllSections = async (req, res) => {
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
        { section_code: { $regex: search, $options: 'i' } },
        { section_name: { $regex: search, $options: 'i' } }
      ];
    }

    const sections = await Section.find(filter).sort({ section_order: 1, section_code: 1 });

    return sendSuccess(res, 200, 'Sections retrieved successfully', sections);
  } catch (error) {
    console.error('Error fetching sections:', error);
    return sendError(res, 500, 'Internal server error', error.message);
  }
};

// Get section by ID
const getSectionById = async (req, res) => {
  try {
    const { id } = req.params;
    const section = await Section.findById(id);

    if (!section) {
      return sendError(res, 404, 'Section not found');
    }

    return sendSuccess(res, 200, 'Section retrieved successfully', section);
  } catch (error) {
    console.error('Error fetching section:', error);
    return sendError(res, 500, 'Internal server error', error.message);
  }
};

// Update section
const updateSection = async (req, res) => {
  try {
    const { id } = req.params;
    const { section_code, section_name, section_order, is_active } = req.body;

    const section = await Section.findById(id);
    if (!section) {
      return sendError(res, 404, 'Section not found');
    }

    // Check if new section code conflicts with existing sections (excluding current section)
    if (section_code && section_code !== section.section_code) {
      const existingSection = await Section.findOne({ 
        section_code: section_code.toUpperCase(),
        _id: { $ne: id }
      });
      if (existingSection) {
        return sendError(res, 409, 'Section code already exists');
      }
    }

    // Update fields
    if (section_code) section.section_code = section_code.toUpperCase();
    if (section_name) section.section_name = section_name.trim();
    if (section_order !== undefined) section.section_order = section_order;
    if (is_active !== undefined) section.is_active = is_active;

    await section.save();

    return sendSuccess(res, 200, 'Section updated successfully', section);
  } catch (error) {
    console.error('Error updating section:', error);
    return sendError(res, 500, 'Internal server error', error.message);
  }
};

// Delete section
const deleteSection = async (req, res) => {
  try {
    const { id } = req.params;
    const section = await Section.findById(id);

    if (!section) {
      return sendError(res, 404, 'Section not found');
    }

    await Section.findByIdAndDelete(id);

    return sendSuccess(res, 200, 'Section deleted successfully');
  } catch (error) {
    console.error('Error deleting section:', error);
    return sendError(res, 500, 'Internal server error', error.message);
  }
};

// Get active sections
const getActiveSections = async (req, res) => {
  try {
    const sections = await Section.find({ is_active: true }).sort({ section_order: 1, section_code: 1 });
    return sendSuccess(res, 200, 'Active sections retrieved successfully', sections);
  } catch (error) {
    console.error('Error fetching active sections:', error);
    return sendError(res, 500, 'Internal server error', error.message);
  }
};

module.exports = {
  createSection,
  getAllSections,
  getSectionById,
  updateSection,
  deleteSection,
  getActiveSections
};
