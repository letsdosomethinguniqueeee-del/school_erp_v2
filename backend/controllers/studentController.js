const Student = require('../models/studentModel');
const User = require('../models/User');
const logger = require('../utils/logger');
const mongoose = require('mongoose');

// Check roll number uniqueness per class
exports.checkRollNumberUniqueness = async (req, res) => {
  try {
    const { rollNo, class: currentClass } = req.query;
    
    if (!rollNo || !currentClass) {
      return res.status(400).json({
        status: 'error',
        message: 'Roll number and class are required'
      });
    }
    
    // Check if roll number already exists in the given class
    const existingStudent = await Student.findOne({
      rollNo: rollNo,
      currentStudyClass: currentClass
    }).select('_id studentId firstName lastName').lean();
    
    res.status(200).json({
      status: 'success',
      exists: !!existingStudent,
      student: existingStudent || null
    });
    
  } catch (error) {
    console.error('Error checking roll number uniqueness:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

exports.getAllStudents = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search;
    const classFilter = req.query.class;
    const sectionFilter = req.query.section;
    const class_id = req.query.class_id;
    const section_id = req.query.section_id;
    const medium_id = req.query.medium_id;
    const academic_year_id = req.query.academic_year_id;

    console.log('=== GET ALL STUDENTS API CALL ===');
    console.log('Query parameters:', req.query);
    console.log('Class filter:', classFilter);
    console.log('Section filter:', sectionFilter);
    console.log('Search term:', search);

    // Build query object
    let query = {};
    
    // Optimized search functionality using indexes
    if (search) {
      // Use text search for better performance with indexes
      query.$or = [
        { studentId: { $regex: search, $options: 'i' } },
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { middleName: { $regex: search, $options: 'i' } },
        { rollNo: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Add class filter
    if (classFilter && classFilter !== 'all') {
      query.currentStudyClass = classFilter;
      console.log('Applied class filter:', classFilter);
    }

    // Add section filter
    if (sectionFilter && sectionFilter !== 'all') {
      query.currentSection = sectionFilter;
      console.log('Applied section filter:', sectionFilter);
    }

    // Support filtering by ObjectIds (for marks entry)
    if (class_id) {
      query.currentStudyClass = class_id;
    }

    if (section_id) {
      query.currentSection = section_id;
    }

    if (medium_id) {
      query.medium = medium_id;
    }

    if (academic_year_id) {
      query.admissionYear = academic_year_id;
    }

    console.log('Final query object:', JSON.stringify(query, null, 2));

    // Optimized query with lean(), proper sorting, and field selection
    const students = await Student.find(query)
      .select('studentId rollNo firstName middleName lastName govtProvidedId fatherFirstName fatherMiddleName fatherLastName fatherMobile motherFirstName motherMiddleName motherLastName motherMobile parent1Id parent1Relation parent2Id parent2Relation gender dateOfBirth category community nationality bloodGroup aadharCardNo contactNo additionalContactNo email admissionYear currentStudyClass currentSection medium concessionPercentage concessionReason pic')
      .populate('admissionYear', 'year_code')
      .populate('currentStudyClass', 'class_name')
      .populate('currentSection', 'section_name')
      .populate('medium', 'medium_name')
      .sort({ studentId: 1 }) // Sort by studentId for consistent ordering
      .lean() // Use lean() for better performance
      .skip(skip)
      .limit(limit);

    console.log('Found students:', students.length);
    console.log('Sample students:', students.slice(0, 3).map(s => ({ id: s._id, name: s.firstName + ' ' + s.lastName, class: s.currentStudyClass, rollNo: s.rollNo })));

    // Use estimatedDocumentCount for better performance on large collections
    const total = await Student.countDocuments(query);
    const totalPages = Math.ceil(total / limit);
    
    console.log('Total students matching query:', total);

    res
      .status(200)
      .json({ 
        status: 'success', 
        results: students.length, 
        total,
        page,
        totalPages,
        data: students 
      });
  } catch (err) {
    console.error('Error fetching students:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
};

exports.getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id)
      .populate('admissionYear', 'year_code')
      .populate('currentStudyClass', 'class_name')
      .populate('currentSection', 'section_name')
      .populate('medium', 'medium_name')
      .lean();
    if (!student)
      return res
        .status(404)
        .json({ status: 'fail', message: 'Student not found' });
    res.status(200).json({ status: 'success', data: student });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

exports.updateStudent = async (req, res) => {
  try {
    const studentId = req.params.id;
    const updateData = req.body;

    console.log('=== UPDATING STUDENT ===');
    console.log('Student ID:', studentId);
    console.log('Update Data:', updateData);

    // Validate concession fields if provided
    if (updateData.concessionPercentage !== undefined) {
      if (updateData.concessionPercentage < 0 || updateData.concessionPercentage > 100) {
        return res.status(400).json({
          status: 'fail',
          message: 'Concession percentage must be between 0 and 100'
        });
      }
    }

    // Check if student exists
    const existingStudent = await Student.findById(studentId);
    if (!existingStudent) {
      return res.status(404).json({ 
        status: 'fail', 
        message: 'Student not found' 
      });
    }

    // Check roll number uniqueness if rollNo or currentStudyClass is being updated
    if (updateData.rollNo || updateData.currentStudyClass) {
      const rollNo = updateData.rollNo || existingStudent.rollNo;
      const currentClass = updateData.currentStudyClass || existingStudent.currentStudyClass;
      
      if (rollNo && currentClass) {
        const existingStudentByRoll = await Student.findOne({ 
          rollNo: rollNo,
          currentStudyClass: currentClass,
          _id: { $ne: studentId } // Exclude current student
        });
        
        if (existingStudentByRoll) {
          return res.status(400).json({ 
            status: 'fail', 
            message: `Roll number ${rollNo} already exists in class ${currentClass}` 
          });
        }
      }
    }

    // Update the student
    const updatedStudent = await Student.findByIdAndUpdate(
      studentId,
      updateData,
      { new: true, runValidators: true }
    );

    console.log('Student updated successfully:', updatedStudent.studentId);

    res.status(200).json({
      status: 'success',
      message: 'Student updated successfully',
      data: updatedStudent
    });
  } catch (err) {
    console.error('Error updating student:', err);
    res.status(500).json({ 
      status: 'error', 
      message: err.message 
    });
  }
};

exports.createStudent = async (req, res) => {
  try {
    const { studentId, rollNo, firstName, lastName, fatherFirstName, motherFirstName } = req.body;
    
    console.log('=== STARTING STUDENT CREATION ===');
    console.log('Student ID:', studentId);
    console.log('Roll No:', rollNo);
    console.log('Name:', firstName, lastName);
    
    // Validate required fields
    if (!studentId || !rollNo || !firstName || !lastName || !fatherFirstName || !motherFirstName) {
      return res.status(400).json({ 
        status: 'fail', 
        message: 'Required fields: studentId, rollNo, firstName, lastName, fatherFirstName, motherFirstName' 
      });
    }

    // Validate concession fields if provided
    const { concessionPercentage, concessionReason } = req.body;
    if (concessionPercentage !== undefined) {
      if (concessionPercentage < 0 || concessionPercentage > 100) {
        return res.status(400).json({
          status: 'fail',
          message: 'Concession percentage must be between 0 and 100'
        });
      }
    }

    // Check if student ID already exists
    const existingStudentById = await Student.findOne({ studentId: studentId });
    if (existingStudentById) {
      return res.status(400).json({ 
        status: 'fail', 
        message: 'Student with this ID already exists' 
      });
    }

    // Check if roll number already exists in the same class
    const { currentStudyClass } = req.body;
    if (currentStudyClass) {
      const existingStudentByRoll = await Student.findOne({ 
        rollNo: rollNo,
        currentStudyClass: currentStudyClass
      });
      if (existingStudentByRoll) {
        return res.status(400).json({ 
          status: 'fail', 
          message: `Roll number ${rollNo} already exists in class ${currentStudyClass}` 
        });
      }
    }

    // Check if user with this studentId already exists
    const existingUser = await User.findOne({ userId: studentId });
    console.log('Checking for existing user with studentId:', studentId, 'Found:', existingUser ? 'Yes' : 'No');
    if (existingUser) {
      return res.status(400).json({ 
        status: 'fail', 
        message: 'User with this Student ID already exists' 
      });
    }

    // Count users before creation
    const userCountBefore = await User.countDocuments();
    console.log('Total users before creation:', userCountBefore);

    // Create student record
    console.log('Creating student record...');
    const student = await Student.create(req.body);
    console.log('Student created successfully:', student.studentId);

    // Create corresponding user record with fixed password
    const userData = {
      userId: studentId,
      password: "Password", // Fixed password as requested
      role: 'student',
      isActive: true
    };
    
    console.log('User data to create:', userData);
    console.log('Creating user record...');

    // Create user record
    let user;
    try {
      user = await User.create(userData);
      console.log('User created successfully:', user.userId, user.role);
      console.log('User ID:', user._id);
    } catch (userError) {
      console.error('=== USER CREATION FAILED ===');
      console.error('User creation error:', userError);
      console.error('Error details:', {
        message: userError.message,
        name: userError.name,
        code: userError.code,
        keyValue: userError.keyValue,
        errors: userError.errors
      });
      
      // Delete the student record if user creation fails
      await Student.findByIdAndDelete(student._id);
      console.log('Student record deleted due to user creation failure');
      
      throw new Error(`Failed to create user account: ${userError.message}`);
    }

    // Verify both records exist
    const verifyStudent = await Student.findById(student._id);
    const verifyUser = await User.findOne({ userId: studentId });
    console.log('Verification - Student found:', verifyStudent ? 'Yes' : 'No');
    console.log('Verification - User found:', verifyUser ? 'Yes' : 'No');

    // Count users after creation
    const userCountAfter = await User.countDocuments();
    console.log('Total users after creation:', userCountAfter);
    console.log('User count increased:', userCountAfter > userCountBefore ? 'Yes' : 'No');

    // Log the admission
    logger.application.userAction('STUDENT_ADMISSION', req.user.id, req.user.role, {
      studentId: student.studentId,
      rollNo: student.rollNo,
      studentName: `${student.firstName} ${student.lastName}`,
      admissionYear: student.admissionYear || new Date().getFullYear(),
      userId: user._id
    });

    console.log('=== STUDENT CREATION COMPLETED SUCCESSFULLY ===');

    res.status(201).json({ 
      status: 'success', 
      message: 'Student admitted successfully and user account created',
      data: { 
        student,
        user: {
          userId: user.userId,
          role: user.role,
          isActive: user.isActive,
          password: "Password" // Include the fixed password in response
        }
      }
    });
  } catch (err) {
    console.error('=== STUDENT CREATION FAILED ===');
    console.error('Error:', err.message);
    console.error('Full error:', err);
    
    logger.application.error(err, { 
      action: 'CREATE_STUDENT', 
      userId: req.user?.id, 
      userRole: req.user?.role 
    });
    res.status(400).json({ status: 'fail', message: err.message });
  }
};


exports.deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    
    if (!student) {
      return res.status(404).json({ status: 'fail', message: 'Student not found' });
    }

    // Delete the corresponding user record
    const user = await User.findOneAndDelete({ userId: student.studentId });
    
    // Delete the student record
    await Student.findByIdAndDelete(req.params.id);

    // Log the deletion (critical operation)
    logger.application.userAction('STUDENT_DELETE', req.user.id, req.user.role, {
      studentId: student.studentId,
      rollNo: student.rollNo,
      studentName: `${student.firstName} ${student.lastName}`,
      admissionYear: student.admissionYear,
      userId: user?._id
    });

    res.status(200).json({ 
      status: 'success', 
      message: 'Student and corresponding user account deleted successfully',
      data: null 
    });
  } catch (err) {
    logger.application.error(err, { 
      action: 'DELETE_STUDENT', 
      userId: req.user?.id, 
      userRole: req.user?.role,
      studentId: req.params.id
    });
    res.status(500).json({ status: 'error', message: err.message });
  }
};
