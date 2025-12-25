const Examination = require('../../models/systemConfiguration/Examination');
const { sendSuccess, sendError } = require('../../utils/response');

// Create a new examination
const createExamination = async (req, res) => {
  try {
    const { exam_code, exam_name } = req.body;

    const existing = await Examination.findOne({ exam_code: exam_code.toUpperCase() });
    if (existing) {
      return sendError(res, 409, 'Examination code already exists');
    }

    const exam = new Examination({
      exam_code: exam_code.toUpperCase(),
      exam_name: exam_name.trim()
    });

    await exam.save();

    return sendSuccess(res, 201, 'Examination created successfully', exam);
  } catch (error) {
    console.error('Error creating examination:', error);
    return sendError(res, 500, 'Internal server error', error.message);
  }
};

// Get all examinations
const getAllExaminations = async (req, res) => {
  try {
    const { search } = req.query;
    const filter = {};
    if (search) {
      filter.$or = [
        { exam_code: { $regex: search, $options: 'i' } },
        { exam_name: { $regex: search, $options: 'i' } }
      ];
    }

    const exams = await Examination.find(filter).sort({ exam_code: 1 });
    return sendSuccess(res, 200, 'Examinations retrieved successfully', exams);
  } catch (error) {
    console.error('Error fetching examinations:', error);
    return sendError(res, 500, 'Internal server error', error.message);
  }
};

// Get examination by ID
const getExaminationById = async (req, res) => {
  try {
    const { id } = req.params;
    const exam = await Examination.findById(id);
    if (!exam) return sendError(res, 404, 'Examination not found');
    return sendSuccess(res, 200, 'Examination retrieved successfully', exam);
  } catch (error) {
    console.error('Error fetching examination:', error);
    return sendError(res, 500, 'Internal server error', error.message);
  }
};

// Update examination
const updateExamination = async (req, res) => {
  try {
    const { id } = req.params;
    const { exam_code, exam_name, max_marks, class_ids, medium_ids } = req.body;

    const exam = await Examination.findById(id);
    if (!exam) return sendError(res, 404, 'Examination not found');

    if (exam_code && exam_code.toUpperCase() !== exam.exam_code) {
      const existing = await Examination.findOne({ exam_code: exam_code.toUpperCase(), _id: { $ne: id } });
      if (existing) return sendError(res, 409, 'Examination code already exists');
    }

    if (exam_code) exam.exam_code = exam_code.toUpperCase();
    if (exam_name) exam.exam_name = exam_name.trim();
    if (max_marks !== undefined) exam.max_marks = max_marks;
    if (class_ids !== undefined) exam.class_ids = class_ids;
    if (medium_ids !== undefined) exam.medium_ids = medium_ids;

    await exam.save();
    return sendSuccess(res, 200, 'Examination updated successfully', exam);
  } catch (error) {
    console.error('Error updating examination:', error);
    return sendError(res, 500, 'Internal server error', error.message);
  }
};

// Delete (soft or hard) examination
const deleteExamination = async (req, res) => {
  try {
    const { id } = req.params;

    const exam = await Examination.findById(id);
    if (!exam) return sendError(res, 404, 'Examination not found');

    await Examination.findByIdAndDelete(id);
    return sendSuccess(res, 200, 'Examination deleted successfully');
  } catch (error) {
    console.error('Error deleting examination:', error);
    return sendError(res, 500, 'Internal server error', error.message);
  }
};

// Bulk create examinations with class and medium associations
const createBulkExaminations = async (req, res) => {
  try {
    const { class_ids, medium_ids, exams } = req.body;

    // Validation
    if (!class_ids || !Array.isArray(class_ids) || class_ids.length === 0) {
      return sendError(res, 400, 'At least one class must be selected');
    }
    if (!medium_ids || !Array.isArray(medium_ids) || medium_ids.length === 0) {
      return sendError(res, 400, 'At least one medium must be selected');
    }
    if (!exams || !Array.isArray(exams) || exams.length === 0) {
      return sendError(res, 400, 'At least one exam must be provided');
    }

    const createdExams = [];
    const errors = [];

    for (const examData of exams) {
      const { exam_name, max_marks } = examData;
      
      if (!exam_name || exam_name.trim() === '') {
        errors.push({ exam_name, error: 'Exam name is required' });
        continue;
      }

      // Generate exam code from name
      const cleanedName = exam_name.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
      const baseCode = (cleanedName.slice(0, 6) || 'EXAM') + String(Date.now() % 10000);
      
      // Check if exam code already exists
      let exam_code = baseCode;
      let counter = 1;
      while (await Examination.findOne({ exam_code })) {
        exam_code = baseCode + counter;
        counter++;
      }

      try {
        const exam = new Examination({
          exam_code,
          exam_name: exam_name.trim(),
          max_marks: max_marks || 100,
          class_ids,
          medium_ids
        });

        await exam.save();
        createdExams.push(exam);
      } catch (error) {
        errors.push({ exam_name, error: error.message });
      }
    }

    if (createdExams.length === 0) {
      return sendError(res, 400, 'No examinations were created', errors);
    }

    return sendSuccess(res, 201, `${createdExams.length} examination(s) created successfully`, {
      created: createdExams,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (error) {
    console.error('Error creating bulk examinations:', error);
    return sendError(res, 500, 'Internal server error', error.message);
  }
};

module.exports = {
  createExamination,
  getAllExaminations,
  getExaminationById,
  updateExamination,
  deleteExamination,
  createBulkExaminations
};
