const ExaminationMarks = require('../models/ExaminationMarks');
const Student = require('../models/studentModel');
const { sendSuccess, sendError } = require('../utils/response');

/**
 * Save marks in bulk for multiple students
 */
exports.saveMarksBulk = async (req, res) => {
  try {
    const { marks } = req.body;

    if (!marks || !Array.isArray(marks) || marks.length === 0) {
      return sendError(res, 400, 'Marks array is required');
    }

    const savedMarks = [];
    const errors = [];

    for (const markEntry of marks) {
      try {
        const {
          student_id,
          academic_year_id,
          exam_id,
          class_id,
          section_id,
          medium_id,
          subject_id,
          marks_obtained,
          max_marks,
          is_absent,
          remarks
        } = markEntry;

        // Validate marks
        if (marks_obtained > max_marks) {
          errors.push({
            student_id,
            error: `Marks obtained (${marks_obtained}) cannot exceed max marks (${max_marks})`
          });
          continue;
        }

        // Check if marks already exist for this student, exam, and subject
        const existingMark = await ExaminationMarks.findOne({
          student_id,
          exam_id,
          subject_id
        });

        if (existingMark) {
          // Update existing marks
          existingMark.marks_obtained = marks_obtained;
          existingMark.max_marks = max_marks;
          existingMark.is_absent = is_absent || false;
          existingMark.remarks = remarks || '';
          existingMark.updated_by = req.user.id;
          await existingMark.save();
          savedMarks.push(existingMark);
        } else {
          // Create new marks entry
          const newMark = new ExaminationMarks({
            student_id,
            academic_year_id,
            exam_id,
            class_id,
            section_id,
            medium_id,
            subject_id,
            marks_obtained,
            max_marks,
            is_absent: is_absent || false,
            remarks: remarks || '',
            created_by: req.user.id,
            updated_by: req.user.id
          });
          await newMark.save();
          savedMarks.push(newMark);
        }
      } catch (error) {
        errors.push({
          student_id: markEntry.student_id,
          error: error.message
        });
      }
    }

    return sendSuccess(
      res,
      200,
      'Marks saved successfully',
      {
        saved: savedMarks.length,
        errors: errors.length > 0 ? errors : undefined
      }
    );
  } catch (error) {
    console.error('Error saving marks:', error);
    return sendError(res, 500, error.message || 'Failed to save marks');
  }
};

/**
 * Get marks for specific criteria
 */
exports.getMarks = async (req, res) => {
  try {
    const { exam_id, subject_id, class_id, section_id, academic_year_id, student_id } = req.query;

    const query = {};
    if (exam_id) query.exam_id = exam_id;
    if (subject_id) query.subject_id = subject_id;
    if (class_id) query.class_id = class_id;
    if (section_id) query.section_id = section_id;
    if (academic_year_id) query.academic_year_id = academic_year_id;
    if (student_id) query.student_id = student_id;

    const marks = await ExaminationMarks.find(query)
      .populate('student_id', 'firstName middleName lastName studentId rollNo')
      .populate('academic_year_id', 'year_code')
      .populate('exam_id', 'exam_name max_marks')
      .populate('class_id', 'class_name')
      .populate('section_id', 'section_name')
      .populate('medium_id', 'medium_name')
      .populate('subject_id', 'subject_name')
      .sort({ 'student_id.rollNo': 1 });

    return sendSuccess(
      res,
      200,
      'Marks fetched successfully',
      marks
    );
  } catch (error) {
    console.error('Error fetching marks:', error);
    return sendError(res, 500, error.message || 'Failed to fetch marks');
  }
};

/**
 * Get marks for a specific student
 */
exports.getStudentMarks = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { academic_year_id, exam_id } = req.query;

    const query = { student_id: studentId };
    if (academic_year_id) query.academic_year_id = academic_year_id;
    if (exam_id) query.exam_id = exam_id;

    const marks = await ExaminationMarks.find(query)
      .populate('academic_year_id', 'year_code')
      .populate('exam_id', 'exam_name max_marks')
      .populate('class_id', 'class_name')
      .populate('section_id', 'section_name')
      .populate('subject_id', 'subject_name')
      .sort({ createdAt: -1 });

    return sendSuccess(
      res,
      200,
      'Student marks fetched successfully',
      marks
    );
  } catch (error) {
    console.error('Error fetching student marks:', error);
    return sendError(res, 500, error.message || 'Failed to fetch student marks');
  }
};

/**
 * Delete marks entry
 */
exports.deleteMarks = async (req, res) => {
  try {
    const { id } = req.params;

    const marks = await ExaminationMarks.findByIdAndDelete(id);
    if (!marks) {
      return sendError(res, 404, 'Marks entry not found');
    }

    return sendSuccess(
      res,
      200,
      'Marks deleted successfully',
      null
    );
  } catch (error) {
    console.error('Error deleting marks:', error);
    return sendError(res, 500, error.message || 'Failed to delete marks');
  }
};

/**
 * Update marks entry
 */
exports.updateMarks = async (req, res) => {
  try {
    const { id } = req.params;
    const { marks_obtained, is_absent, remarks } = req.body;

    const marks = await ExaminationMarks.findById(id);
    if (!marks) {
      return sendError(res, 404, 'Marks entry not found');
    }

    // Validate marks
    if (!is_absent && marks_obtained > marks.max_marks) {
      return sendError(
        res,
        400,
        `Marks obtained (${marks_obtained}) cannot exceed max marks (${marks.max_marks})`
      );
    }

    // Update fields
    marks.marks_obtained = is_absent ? 0 : marks_obtained;
    marks.is_absent = is_absent;
    if (remarks !== undefined) {
      marks.remarks = remarks;
    }

    await marks.save();

    const updatedMarks = await ExaminationMarks.findById(id)
      .populate('student_id', 'firstName middleName lastName studentId')
      .populate('academic_year_id', 'year_code')
      .populate('exam_id', 'exam_name max_marks')
      .populate('class_id', 'class_name')
      .populate('section_id', 'section_name')
      .populate('medium_id', 'medium_name')
      .populate('subject_id', 'subject_name');

    return sendSuccess(
      res,
      200,
      'Marks updated successfully',
      updatedMarks
    );
  } catch (error) {
    console.error('Error updating marks:', error);
    return sendError(res, 500, error.message || 'Failed to update marks');
  }
};
