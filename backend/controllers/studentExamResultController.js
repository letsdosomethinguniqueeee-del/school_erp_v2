const ExaminationMarks = require('../models/ExaminationMarks');
const Examination = require('../models/systemConfiguration/Examination');
const Student = require('../models/studentModel');
const Subject = require('../models/systemConfiguration/Subject');
const Class = require('../models/systemConfiguration/Class');
const Section = require('../models/systemConfiguration/Section');
const AcademicYear = require('../models/systemConfiguration/AcademicYear');
const { sendSuccess, sendError } = require('../utils/response');

// Get published exams for a student
const getPublishedExams = async (req, res) => {
  try {
    const { class_id, student_id } = req.query;

    if (!class_id || !student_id) {
      return sendError(res, 400, 'Class ID and student ID are required');
    }

    // Get student details to find their class and section
    let student = null;
    const mongoose = require('mongoose');
    if (mongoose.Types.ObjectId.isValid(student_id) && student_id.length === 24) {
      student = await Student.findById(student_id);
    }
    if (!student) {
      student = await Student.findOne({ studentId: student_id });
    }
    if (!student) {
      return sendError(res, 404, 'Student not found');
    }

    // Find all exams that have marks published for this student in the specified class
    const publishedMarks = await ExaminationMarks.find({
      student_id: student._id,
      class_id,
      is_published: true
    }).distinct('exam_id');

    const exams = await Examination.find({
      _id: { $in: publishedMarks }
    }).sort({ exam_name: 1 });

    return sendSuccess(res, 200, 'Published exams retrieved successfully', exams);
  } catch (error) {
    console.error('Error fetching published exams:', error);
    return sendError(res, 500, 'Internal server error', error.message);
  }
};

// Get academic years for a specific student (only years they were enrolled)
const getStudentAcademicYears = async (req, res) => {
  try {
    const { student_id } = req.query;

    console.log('Fetching academic years for student:', student_id);

    if (!student_id) {
      return sendError(res, 400, 'Student ID is required');
    }

    let student = null;
    
    // Check if student_id is a valid ObjectId format
    const mongoose = require('mongoose');
    if (mongoose.Types.ObjectId.isValid(student_id) && student_id.length === 24) {
      // Try to find by MongoDB _id
      student = await Student.findById(student_id).populate('admissionYear');
      console.log('Found by _id:', student ? 'Yes' : 'No');
    }
    
    if (!student) {
      // Try finding by studentId field (which matches userId in User table)
      student = await Student.findOne({ studentId: student_id }).populate('admissionYear');
      console.log('Found by studentId field:', student ? 'Yes' : 'No');
    }
    
    if (!student) {
      return sendError(res, 404, 'Student not found');
    }
    
    console.log('Student found - ID:', student.studentId, 'Name:', student.firstName, student.lastName);

    console.log('Student admission year:', student.admissionYear);

    // If no admission year, return empty array
    if (!student.admissionYear) {
      console.log('No admission year set for student, returning empty array');
      return sendSuccess(res, 200, 'Student academic years retrieved successfully', []);
    }

    const admissionYearStartDate = new Date(student.admissionYear.start_date);
    
    // Get all academic years
    const allAcademicYears = await AcademicYear.find().sort({ start_date: 1 });
    
    console.log('Total academic years in system:', allAcademicYears.length);

    // Filter academic years based on student's enrollment (from admission year onwards)
    const studentAcademicYears = allAcademicYears.filter(year => {
      const yearStartDate = new Date(year.start_date);
      
      // Include years from admission year onwards
      return yearStartDate >= admissionYearStartDate;
    });

    console.log('Filtered academic years for student:', studentAcademicYears.length);

    // If student is inactive, further filter to only years with exam records
    if (student.isActive === false) {
      const yearsWithRecords = await ExaminationMarks.find({
        student_id: student._id
      }).distinct('academic_year_id');
      
      const filteredYears = studentAcademicYears.filter(year => 
        yearsWithRecords.some(recordYearId => recordYearId.toString() === year._id.toString())
      );
      
      return sendSuccess(res, 200, 'Student academic years retrieved successfully', filteredYears);
    }

    return sendSuccess(res, 200, 'Student academic years retrieved successfully', studentAcademicYears);
  } catch (error) {
    console.error('Error fetching student academic years:', error);
    return sendError(res, 500, 'Internal server error', error.message);
  }
};

// Get classes the student has studied in (based on exam marks records)
const getStudentClasses = async (req, res) => {
  try {
    const { student_id } = req.query;

    if (!student_id) {
      return sendError(res, 400, 'Student ID is required');
    }

    // Find student
    let student = null;
    const mongoose = require('mongoose');
    if (mongoose.Types.ObjectId.isValid(student_id) && student_id.length === 24) {
      student = await Student.findById(student_id);
    }
    if (!student) {
      student = await Student.findOne({ studentId: student_id });
    }
    if (!student) {
      return sendError(res, 404, 'Student not found');
    }

    // Get all unique class IDs from the student's exam marks
    const classIds = await ExaminationMarks.find({
      student_id: student._id
    }).distinct('class_id');

    // Get class details
    const classes = await Class.find({
      _id: { $in: classIds }
    }).sort({ class_name: 1 });

    // Mark current class
    const classesWithCurrent = classes.map(cls => ({
      _id: cls._id,
      class_name: cls.class_name,
      is_current: student.currentStudyClass && student.currentStudyClass.toString() === cls._id.toString()
    }));

    return sendSuccess(res, 200, 'Student classes retrieved successfully', classesWithCurrent);
  } catch (error) {
    console.error('Error fetching student classes:', error);
    return sendError(res, 500, 'Internal server error', error.message);
  }
};

// Get student exam results for a specific exam
const getStudentExamResults = async (req, res) => {
  try {
    const { exam_id, class_id, student_id } = req.query;

    if (!exam_id || !class_id || !student_id) {
      return sendError(res, 400, 'Exam ID, class ID, and student ID are required');
    }

    // Find student by _id or studentId field
    let student = null;
    const mongoose = require('mongoose');
    if (mongoose.Types.ObjectId.isValid(student_id) && student_id.length === 24) {
      student = await Student.findById(student_id);
    }
    if (!student) {
      student = await Student.findOne({ studentId: student_id });
    }
    if (!student) {
      return sendError(res, 404, 'Student not found');
    }

    const results = await ExaminationMarks.find({
      student_id: student._id,
      exam_id,
      class_id,
      is_published: true
    })
      .populate('subject_id', 'subject_name subject_code')
      .populate('exam_id', 'exam_name exam_code')
      .sort({ 'subject_id.subject_name': 1 });

    return sendSuccess(res, 200, 'Exam results retrieved successfully', results);
  } catch (error) {
    console.error('Error fetching exam results:', error);
    return sendError(res, 500, 'Internal server error', error.message);
  }
};

// Get final result (annual consolidated result)
const getFinalResult = async (req, res) => {
  try {
    const { class_id, student_id } = req.query;

    if (!class_id || !student_id) {
      return sendError(res, 400, 'Class ID and student ID are required');
    }

    // Find student by _id or studentId field
    let student = null;
    const mongoose = require('mongoose');
    if (mongoose.Types.ObjectId.isValid(student_id) && student_id.length === 24) {
      student = await Student.findById(student_id);
    }
    if (!student) {
      student = await Student.findOne({ studentId: student_id });
    }
    if (!student) {
      return sendError(res, 404, 'Student not found');
    }

    // Check if final result is published for this class
    const finalResultPublished = await ExaminationMarks.findOne({
      student_id: student._id,
      class_id,
      is_final_published: true // Assuming we'll add this field
    });

    if (!finalResultPublished) {
      return sendSuccess(res, 200, 'Final result not yet published', null);
    }

    // Get all marks for the class
    const allResults = await ExaminationMarks.find({
      student_id: student._id,
      class_id,
      is_published: true
    })
      .populate('subject_id', 'subject_name subject_code')
      .populate('exam_id', 'exam_name exam_code')
      .populate('class_id', 'class_name')
      .populate('section_id', 'section_name')
      .sort({ 'subject_id.subject_name': 1 });

    // Student details already fetched above

    // Group results by subject (aggregate all exams)
    const subjectMap = new Map();
    
    allResults.forEach(result => {
      const subjectId = result.subject_id._id.toString();
      
      if (!subjectMap.has(subjectId)) {
        subjectMap.set(subjectId, {
          subject_name: result.subject_id.subject_name,
          subject_code: result.subject_id.subject_code,
          max_marks: 0,
          marks_obtained: 0,
          is_absent: false,
          exams: []
        });
      }
      
      const subjectData = subjectMap.get(subjectId);
      subjectData.max_marks += result.max_marks;
      subjectData.marks_obtained += result.is_absent ? 0 : result.marks_obtained;
      subjectData.is_absent = subjectData.is_absent || result.is_absent;
      subjectData.exams.push({
        exam_name: result.exam_id.exam_name,
        marks_obtained: result.marks_obtained,
        max_marks: result.max_marks,
        is_absent: result.is_absent
      });
    });

    const subjects = Array.from(subjectMap.values());

    const finalResult = {
      student_id: student._id,
      student_name: student.name,
      roll_number: student.roll_number,
      class_name: student.currentStudyClass?.class_name || allResults[0]?.class_id?.class_name,
      section_name: student.currentSection?.section_name || allResults[0]?.section_id?.section_name,
      class_id,
      subjects,
      published_date: finalResultPublished.updatedAt
    };

    return sendSuccess(res, 200, 'Final result retrieved successfully', finalResult);
  } catch (error) {
    console.error('Error fetching final result:', error);
    return sendError(res, 500, 'Internal server error', error.message);
  }
};

// Publish exam results (Super Admin only)
const publishExamResults = async (req, res) => {
  try {
    const { exam_id, academic_year_id, class_id, section_id } = req.body;

    if (!exam_id || !academic_year_id || !class_id || !section_id) {
      return sendError(res, 400, 'Exam ID, academic year ID, class ID, and section ID are required');
    }

    // Update all marks for this exam/class/section to published
    const result = await ExaminationMarks.updateMany(
      {
        exam_id,
        academic_year_id,
        class_id,
        section_id
      },
      {
        $set: {
          is_published: true,
          published_by: req.user._id,
          published_at: new Date()
        }
      }
    );

    return sendSuccess(res, 200, `Results published for ${result.modifiedCount} students`, {
      modified_count: result.modifiedCount
    });
  } catch (error) {
    console.error('Error publishing exam results:', error);
    return sendError(res, 500, 'Internal server error', error.message);
  }
};

// Publish final yearly results (Super Admin only)
const publishFinalResults = async (req, res) => {
  try {
    const { academic_year_id } = req.body;

    if (!academic_year_id) {
      return sendError(res, 400, 'Academic year ID is required');
    }

    // Update all marks for this academic year to final published
    const result = await ExaminationMarks.updateMany(
      {
        academic_year_id,
        is_published: true // Only publish final for already published results
      },
      {
        $set: {
          is_final_published: true,
          final_published_by: req.user._id,
          final_published_at: new Date()
        }
      }
    );

    return sendSuccess(res, 200, `Final results published for academic year`, {
      modified_count: result.modifiedCount
    });
  } catch (error) {
    console.error('Error publishing final results:', error);
    return sendError(res, 500, 'Internal server error', error.message);
  }
};

module.exports = {
  getPublishedExams,
  getStudentExamResults,
  getFinalResult,
  publishExamResults,
  publishFinalResults,
  getStudentAcademicYears,
  getStudentClasses
};
