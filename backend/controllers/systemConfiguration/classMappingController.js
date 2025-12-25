const ClassMapping = require('../../models/systemConfiguration/ClassMapping');
const { sendSuccess, sendError } = require('../../utils/response');

// Create a new class mapping
const createClassMapping = async (req, res) => {
  try {
    const { 
      class_name, 
      medium, 
      stream, 
      subjects, 
      sections, 
      is_active 
    } = req.body;

    // NOTE: Field validation (required, format, type) is handled by validateClassMapping middleware
    // Only business logic validations are done here

    // Create new class mapping
    const classMapping = new ClassMapping({
      class_name: class_name.trim(),
      medium: medium.trim(),
      stream: stream.trim(),
      subjects: subjects || [],
      sections: sections || [],
      is_active: is_active !== undefined ? is_active : true
    });

    await classMapping.save();

    return sendSuccess(res, 201, 'Class mapping created successfully', classMapping);
  } catch (error) {
    console.error('Error creating class mapping:', error);
    return sendError(res, 500, 'Internal server error', error.message);
  }
};

// Get all class mappings
const getAllClassMappings = async (req, res) => {
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
        { class_name: { $regex: search, $options: 'i' } },
        { medium: { $regex: search, $options: 'i' } },
        { stream: { $regex: search, $options: 'i' } }
      ];
    }

    const classMappings = await ClassMapping.find(filter)
      .sort({ class_name: 1 });

    return sendSuccess(res, 200, 'Class mappings retrieved successfully', classMappings);
  } catch (error) {
    console.error('Error fetching class mappings:', error);
    return sendError(res, 500, 'Internal server error', error.message);
  }
};

// Get class mapping by ID
const getClassMappingById = async (req, res) => {
  try {
    const { id } = req.params;
    const classMapping = await ClassMapping.findById(id);

    if (!classMapping) {
      return sendError(res, 404, 'Class mapping not found');
    }

    return sendSuccess(res, 200, 'Class mapping retrieved successfully', classMapping);
  } catch (error) {
    console.error('Error fetching class mapping:', error);
    return sendError(res, 500, 'Internal server error', error.message);
  }
};

// Update class mapping
const updateClassMapping = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      class_name, 
      medium, 
      stream, 
      subjects, 
      sections, 
      is_active 
    } = req.body;

    const classMapping = await ClassMapping.findById(id);
    if (!classMapping) {
      return sendError(res, 404, 'Class mapping not found');
    }

    // Update fields
    if (class_name) classMapping.class_name = class_name.trim();
    if (medium) classMapping.medium = medium.trim();
    if (stream) classMapping.stream = stream.trim();
    if (subjects !== undefined) classMapping.subjects = subjects;
    if (sections !== undefined) classMapping.sections = sections;
    if (is_active !== undefined) classMapping.is_active = is_active;

    await classMapping.save();

    return sendSuccess(res, 200, 'Class mapping updated successfully', classMapping);
  } catch (error) {
    console.error('Error updating class mapping:', error);
    return sendError(res, 500, 'Internal server error', error.message);
  }
};

// Delete class mapping
const deleteClassMapping = async (req, res) => {
  try {
    const { id } = req.params;
    const classMapping = await ClassMapping.findById(id);

    if (!classMapping) {
      return sendError(res, 404, 'Class mapping not found');
    }

    await ClassMapping.findByIdAndDelete(id);

    return sendSuccess(res, 200, 'Class mapping deleted successfully');
  } catch (error) {
    console.error('Error deleting class mapping:', error);
    return sendError(res, 500, 'Internal server error', error.message);
  }
};

// Get active class mappings
const getActiveClassMappings = async (req, res) => {
  try {
    const classMappings = await ClassMapping.find({ is_active: true })
      .sort({ class_name: 1 });
    
    return sendSuccess(res, 200, 'Active class mappings retrieved successfully', classMappings);
  } catch (error) {
    console.error('Error fetching active class mappings:', error);
    return sendError(res, 500, 'Internal server error', error.message);
  }
};


module.exports = {
  createClassMapping,
  getAllClassMappings,
  getClassMappingById,
  updateClassMapping,
  deleteClassMapping,
  getActiveClassMappings
};
