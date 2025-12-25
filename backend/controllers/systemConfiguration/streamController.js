const Stream = require('../../models/systemConfiguration/Stream');
const { sendSuccess, sendError } = require('../../utils/response');

// Create a new stream
const createStream = async (req, res) => {
  try {
    const { stream_code, stream_name, is_active } = req.body;

    // NOTE: Field validation (required, format, type) is handled by validateStream middleware
    // Only business logic validations are done here

    // Check if stream code already exists
    const existingStream = await Stream.findOne({ stream_code: stream_code.toUpperCase() });
    if (existingStream) {
      return sendError(res, 409, 'Stream code already exists');
    }

    // Create new stream
    const stream = new Stream({
      stream_code: stream_code.toUpperCase(),
      stream_name: stream_name.trim(),
      is_active: is_active !== undefined ? is_active : true
    });

    await stream.save();

    return sendSuccess(res, 201, 'Stream created successfully', stream);
  } catch (error) {
    console.error('Error creating stream:', error);
    return sendError(res, 500, 'Internal server error', error.message);
  }
};

// Get all streams
const getAllStreams = async (req, res) => {
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
        { stream_code: { $regex: search, $options: 'i' } },
        { stream_name: { $regex: search, $options: 'i' } }
      ];
    }

    const streams = await Stream.find(filter).sort({ stream_code: 1 });

    return sendSuccess(res, 200, 'Streams retrieved successfully', streams);
  } catch (error) {
    console.error('Error fetching streams:', error);
    return sendError(res, 500, 'Internal server error', error.message);
  }
};

// Get stream by ID
const getStreamById = async (req, res) => {
  try {
    const { id } = req.params;
    const stream = await Stream.findById(id);

    if (!stream) {
      return sendError(res, 404, 'Stream not found');
    }

    return sendSuccess(res, 200, 'Stream retrieved successfully', stream);
  } catch (error) {
    console.error('Error fetching stream:', error);
    return sendError(res, 500, 'Internal server error', error.message);
  }
};

// Update stream
const updateStream = async (req, res) => {
  try {
    const { id } = req.params;
    const { stream_code, stream_name, is_active } = req.body;

    const stream = await Stream.findById(id);
    if (!stream) {
      return sendError(res, 404, 'Stream not found');
    }

    // Check if new stream code conflicts with existing streams (excluding current stream)
    if (stream_code && stream_code !== stream.stream_code) {
      const existingStream = await Stream.findOne({ 
        stream_code: stream_code.toUpperCase(),
        _id: { $ne: id }
      });
      if (existingStream) {
        return sendError(res, 409, 'Stream code already exists');
      }
    }

    // Update fields
    if (stream_code) stream.stream_code = stream_code.toUpperCase();
    if (stream_name) stream.stream_name = stream_name.trim();
    if (is_active !== undefined) stream.is_active = is_active;

    await stream.save();

    return sendSuccess(res, 200, 'Stream updated successfully', stream);
  } catch (error) {
    console.error('Error updating stream:', error);
    return sendError(res, 500, 'Internal server error', error.message);
  }
};

// Delete stream
const deleteStream = async (req, res) => {
  try {
    const { id } = req.params;
    const stream = await Stream.findById(id);

    if (!stream) {
      return sendError(res, 404, 'Stream not found');
    }

    await Stream.findByIdAndDelete(id);

    return sendSuccess(res, 200, 'Stream deleted successfully');
  } catch (error) {
    console.error('Error deleting stream:', error);
    return sendError(res, 500, 'Internal server error', error.message);
  }
};

// Get active streams
const getActiveStreams = async (req, res) => {
  try {
    const streams = await Stream.find({ is_active: true }).sort({ stream_code: 1 });
    return sendSuccess(res, 200, 'Active streams retrieved successfully', streams);
  } catch (error) {
    console.error('Error fetching active streams:', error);
    return sendError(res, 500, 'Internal server error', error.message);
  }
};

module.exports = {
  createStream,
  getAllStreams,
  getStreamById,
  updateStream,
  deleteStream,
  getActiveStreams
};
