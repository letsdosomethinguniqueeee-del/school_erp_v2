const mongoose = require('mongoose');
const Student = require('../models/studentModel');
const User = require('../models/User');
require('dotenv').config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/school_erp');
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Class mapping for student ID generation
const classMapping = {
  'Nursery': 'NUR',
  'LKG': 'LKG', 
  'UKG': 'UKG',
  '1st': '01',
  '2nd': '02',
  '3rd': '03',
  '4th': '04',
  '5th': '05',
  '6th': '06',
  '7th': '07',
  '8th': '08',
  '9th': '09',
  '10th': '10',
  '11th': '11',
  '12th': '12'
};

// Generate new student ID based on format: DPS{YY}{CLASS}{ROLL}
const generateStudentId = (admissionYear, currentStudyClass, rollNo) => {
  const year = admissionYear.toString().slice(-2); // Get last 2 digits of year
  const classCode = classMapping[currentStudyClass] || '00';
  const rollCode = rollNo.toString().padStart(3, '0'); // Pad roll number to 3 digits
  
  return `DPS${year}${classCode}${rollCode}`;
};

// Clear all existing students and users
const clearExistingData = async () => {
  try {
    console.log('Clearing existing students and users...');
    
    // Delete all students
    const deletedStudents = await Student.deleteMany({});
    console.log(`Deleted ${deletedStudents.deletedCount} students`);
    
    // Delete all users with role 'student'
    const deletedUsers = await User.deleteMany({ role: 'student' });
    console.log(`Deleted ${deletedUsers.deletedCount} student users`);
    
    console.log('Existing data cleared successfully');
  } catch (error) {
    console.error('Error clearing existing data:', error);
    throw error;
  }
};

// Create sample students with new ID format
const createSampleStudents = async () => {
  try {
    console.log('Creating sample students with new ID format...');
    
    const sampleStudents = [
      {
        studentId: 'DPS25NUR001', // DPS + 25 (2025) + NUR (Nursery) + 001 (roll)
        rollNo: '001',
        firstName: 'Rajesh',
        middleName: 'Kumar',
        lastName: 'Sharma',
        fatherFirstName: 'Ramesh',
        fatherMiddleName: 'Kumar',
        fatherLastName: 'Sharma',
        motherFirstName: 'Sunita',
        motherMiddleName: 'Devi',
        motherLastName: 'Sharma',
        gender: 'Male',
        dateOfBirth: new Date('2019-04-15'),
        category: 'General',
        community: 'Hindu',
        nationality: 'Indian',
        contactNo: '9876543210',
        email: 'rajesh.sharma@example.com',
        admissionYear: 2025,
        currentStudyClass: 'Nursery',
        currentSection: 'A'
      },
      {
        studentId: 'DPS25LKG001', // DPS + 25 (2025) + LKG (LKG) + 001 (roll)
        rollNo: '001',
        firstName: 'Priya',
        middleName: '',
        lastName: 'Singh',
        fatherFirstName: 'Amit',
        fatherMiddleName: 'Kumar',
        fatherLastName: 'Singh',
        motherFirstName: 'Rekha',
        motherMiddleName: 'Devi',
        motherLastName: 'Singh',
        gender: 'Female',
        dateOfBirth: new Date('2018-06-20'),
        category: 'General',
        community: 'Hindu',
        nationality: 'Indian',
        contactNo: '9876543211',
        email: 'priya.singh@example.com',
        admissionYear: 2025,
        currentStudyClass: 'LKG',
        currentSection: 'A'
      },
      {
        studentId: 'DPS25UKG001', // DPS + 25 (2025) + UKG (UKG) + 001 (roll)
        rollNo: '001',
        firstName: 'Arjun',
        middleName: 'Raj',
        lastName: 'Patel',
        fatherFirstName: 'Vikram',
        fatherMiddleName: 'Singh',
        fatherLastName: 'Patel',
        motherFirstName: 'Meera',
        motherMiddleName: 'Devi',
        motherLastName: 'Patel',
        gender: 'Male',
        dateOfBirth: new Date('2017-08-10'),
        category: 'General',
        community: 'Hindu',
        nationality: 'Indian',
        contactNo: '9876543212',
        email: 'arjun.patel@example.com',
        admissionYear: 2025,
        currentStudyClass: 'UKG',
        currentSection: 'A'
      },
      {
        studentId: 'DPS2501001', // DPS + 25 (2025) + 01 (1st) + 001 (roll)
        rollNo: '001',
        firstName: 'Sneha',
        middleName: 'Kumari',
        lastName: 'Gupta',
        fatherFirstName: 'Rajesh',
        fatherMiddleName: 'Kumar',
        fatherLastName: 'Gupta',
        motherFirstName: 'Pooja',
        motherMiddleName: 'Devi',
        motherLastName: 'Gupta',
        gender: 'Female',
        dateOfBirth: new Date('2016-03-25'),
        category: 'General',
        community: 'Hindu',
        nationality: 'Indian',
        contactNo: '9876543213',
        email: 'sneha.gupta@example.com',
        admissionYear: 2025,
        currentStudyClass: '1st',
        currentSection: 'A'
      },
      {
        studentId: 'DPS2502001', // DPS + 25 (2025) + 02 (2nd) + 001 (roll)
        rollNo: '001',
        firstName: 'Rohit',
        middleName: 'Kumar',
        lastName: 'Verma',
        fatherFirstName: 'Suresh',
        fatherMiddleName: 'Kumar',
        fatherLastName: 'Verma',
        motherFirstName: 'Kavita',
        motherMiddleName: 'Devi',
        motherLastName: 'Verma',
        gender: 'Male',
        dateOfBirth: new Date('2015-11-12'),
        category: 'General',
        community: 'Hindu',
        nationality: 'Indian',
        contactNo: '9876543214',
        email: 'rohit.verma@example.com',
        admissionYear: 2025,
        currentStudyClass: '2nd',
        currentSection: 'A'
      },
      {
        studentId: 'DPS2503001', // DPS + 25 (2025) + 03 (3rd) + 001 (roll)
        rollNo: '001',
        firstName: 'Ananya',
        middleName: '',
        lastName: 'Joshi',
        fatherFirstName: 'Deepak',
        fatherMiddleName: 'Kumar',
        fatherLastName: 'Joshi',
        motherFirstName: 'Sushma',
        motherMiddleName: 'Devi',
        motherLastName: 'Joshi',
        gender: 'Female',
        dateOfBirth: new Date('2014-09-18'),
        category: 'General',
        community: 'Hindu',
        nationality: 'Indian',
        contactNo: '9876543215',
        email: 'ananya.joshi@example.com',
        admissionYear: 2025,
        currentStudyClass: '3rd',
        currentSection: 'A'
      },
      {
        studentId: 'DPS2504001', // DPS + 25 (2025) + 04 (4th) + 001 (roll)
        rollNo: '001',
        firstName: 'Vikram',
        middleName: 'Singh',
        lastName: 'Yadav',
        fatherFirstName: 'Manoj',
        fatherMiddleName: 'Kumar',
        fatherLastName: 'Yadav',
        motherFirstName: 'Rita',
        motherMiddleName: 'Devi',
        motherLastName: 'Yadav',
        gender: 'Male',
        dateOfBirth: new Date('2013-07-05'),
        category: 'General',
        community: 'Hindu',
        nationality: 'Indian',
        contactNo: '9876543216',
        email: 'vikram.yadav@example.com',
        admissionYear: 2025,
        currentStudyClass: '4th',
        currentSection: 'A'
      },
      {
        studentId: 'DPS2505001', // DPS + 25 (2025) + 05 (5th) + 001 (roll)
        rollNo: '001',
        firstName: 'Kavya',
        middleName: 'Sharma',
        lastName: 'Mishra',
        fatherFirstName: 'Naveen',
        fatherMiddleName: 'Kumar',
        fatherLastName: 'Mishra',
        motherFirstName: 'Geeta',
        motherMiddleName: 'Devi',
        motherLastName: 'Mishra',
        gender: 'Female',
        dateOfBirth: new Date('2012-12-30'),
        category: 'General',
        community: 'Hindu',
        nationality: 'Indian',
        contactNo: '9876543217',
        email: 'kavya.mishra@example.com',
        admissionYear: 2025,
        currentStudyClass: '5th',
        currentSection: 'A'
      },
      {
        studentId: 'DPS2506001', // DPS + 25 (2025) + 06 (6th) + 001 (roll)
        rollNo: '001',
        firstName: 'Aditya',
        middleName: 'Kumar',
        lastName: 'Tiwari',
        fatherFirstName: 'Ravi',
        fatherMiddleName: 'Kumar',
        fatherLastName: 'Tiwari',
        motherFirstName: 'Sunita',
        motherMiddleName: 'Devi',
        motherLastName: 'Tiwari',
        gender: 'Male',
        dateOfBirth: new Date('2011-05-14'),
        category: 'General',
        community: 'Hindu',
        nationality: 'Indian',
        contactNo: '9876543218',
        email: 'aditya.tiwari@example.com',
        admissionYear: 2025,
        currentStudyClass: '6th',
        currentSection: 'A'
      },
      {
        studentId: 'DPS2507001', // DPS + 25 (2025) + 07 (7th) + 001 (roll)
        rollNo: '001',
        firstName: 'Ishita',
        middleName: 'Kumari',
        lastName: 'Agarwal',
        fatherFirstName: 'Sanjay',
        fatherMiddleName: 'Kumar',
        fatherLastName: 'Agarwal',
        motherFirstName: 'Neha',
        motherMiddleName: 'Devi',
        motherLastName: 'Agarwal',
        gender: 'Female',
        dateOfBirth: new Date('2010-10-22'),
        category: 'General',
        community: 'Hindu',
        nationality: 'Indian',
        contactNo: '9876543219',
        email: 'ishita.agarwal@example.com',
        admissionYear: 2025,
        currentStudyClass: '7th',
        currentSection: 'A'
      },
      // Additional 10 students for pagination testing
      {
        studentId: 'DPS25NUR002', // DPS + 25 (2025) + NUR (Nursery) + 002 (roll)
        rollNo: '002',
        firstName: 'Krishna',
        middleName: 'Kumar',
        lastName: 'Sharma',
        fatherFirstName: 'Vikash',
        fatherMiddleName: 'Kumar',
        fatherLastName: 'Sharma',
        motherFirstName: 'Rekha',
        motherMiddleName: 'Devi',
        motherLastName: 'Sharma',
        gender: 'Male',
        dateOfBirth: new Date('2019-08-12'),
        category: 'General',
        community: 'Hindu',
        nationality: 'Indian',
        contactNo: '9876543220',
        email: 'krishna.sharma@example.com',
        admissionYear: 2025,
        currentStudyClass: 'Nursery',
        currentSection: 'B'
      },
      {
        studentId: 'DPS25LKG002', // DPS + 25 (2025) + LKG (LKG) + 002 (roll)
        rollNo: '002',
        firstName: 'Sakshi',
        middleName: '',
        lastName: 'Verma',
        fatherFirstName: 'Rajesh',
        fatherMiddleName: 'Kumar',
        fatherLastName: 'Verma',
        motherFirstName: 'Sunita',
        motherMiddleName: 'Devi',
        motherLastName: 'Verma',
        gender: 'Female',
        dateOfBirth: new Date('2018-03-15'),
        category: 'General',
        community: 'Hindu',
        nationality: 'Indian',
        contactNo: '9876543221',
        email: 'sakshi.verma@example.com',
        admissionYear: 2025,
        currentStudyClass: 'LKG',
        currentSection: 'B'
      },
      {
        studentId: 'DPS25UKG002', // DPS + 25 (2025) + UKG (UKG) + 002 (roll)
        rollNo: '002',
        firstName: 'Rahul',
        middleName: 'Singh',
        lastName: 'Yadav',
        fatherFirstName: 'Manoj',
        fatherMiddleName: 'Kumar',
        fatherLastName: 'Yadav',
        motherFirstName: 'Kavita',
        motherMiddleName: 'Devi',
        motherLastName: 'Yadav',
        gender: 'Male',
        dateOfBirth: new Date('2017-11-08'),
        category: 'General',
        community: 'Hindu',
        nationality: 'Indian',
        contactNo: '9876543222',
        email: 'rahul.yadav@example.com',
        admissionYear: 2025,
        currentStudyClass: 'UKG',
        currentSection: 'B'
      },
      {
        studentId: 'DPS2501002', // DPS + 25 (2025) + 01 (1st) + 002 (roll)
        rollNo: '002',
        firstName: 'Pooja',
        middleName: 'Kumari',
        lastName: 'Mishra',
        fatherFirstName: 'Naveen',
        fatherMiddleName: 'Kumar',
        fatherLastName: 'Mishra',
        motherFirstName: 'Geeta',
        motherMiddleName: 'Devi',
        motherLastName: 'Mishra',
        gender: 'Female',
        dateOfBirth: new Date('2016-07-20'),
        category: 'General',
        community: 'Hindu',
        nationality: 'Indian',
        contactNo: '9876543223',
        email: 'pooja.mishra@example.com',
        admissionYear: 2025,
        currentStudyClass: '1st',
        currentSection: 'B'
      },
      {
        studentId: 'DPS2502002', // DPS + 25 (2025) + 02 (2nd) + 002 (roll)
        rollNo: '002',
        firstName: 'Vikash',
        middleName: 'Kumar',
        lastName: 'Tiwari',
        fatherFirstName: 'Ravi',
        fatherMiddleName: 'Kumar',
        fatherLastName: 'Tiwari',
        motherFirstName: 'Sunita',
        motherMiddleName: 'Devi',
        motherLastName: 'Tiwari',
        gender: 'Male',
        dateOfBirth: new Date('2015-12-03'),
        category: 'General',
        community: 'Hindu',
        nationality: 'Indian',
        contactNo: '9876543224',
        email: 'vikash.tiwari@example.com',
        admissionYear: 2025,
        currentStudyClass: '2nd',
        currentSection: 'B'
      },
      {
        studentId: 'DPS2503002', // DPS + 25 (2025) + 03 (3rd) + 002 (roll)
        rollNo: '002',
        firstName: 'Neha',
        middleName: '',
        lastName: 'Agarwal',
        fatherFirstName: 'Sanjay',
        fatherMiddleName: 'Kumar',
        fatherLastName: 'Agarwal',
        motherFirstName: 'Rita',
        motherMiddleName: 'Devi',
        motherLastName: 'Agarwal',
        gender: 'Female',
        dateOfBirth: new Date('2014-05-18'),
        category: 'General',
        community: 'Hindu',
        nationality: 'Indian',
        contactNo: '9876543225',
        email: 'neha.agarwal@example.com',
        admissionYear: 2025,
        currentStudyClass: '3rd',
        currentSection: 'B'
      },
      {
        studentId: 'DPS2504002', // DPS + 25 (2025) + 04 (4th) + 002 (roll)
        rollNo: '002',
        firstName: 'Amit',
        middleName: 'Kumar',
        lastName: 'Joshi',
        fatherFirstName: 'Deepak',
        fatherMiddleName: 'Kumar',
        fatherLastName: 'Joshi',
        motherFirstName: 'Sushma',
        motherMiddleName: 'Devi',
        motherLastName: 'Joshi',
        gender: 'Male',
        dateOfBirth: new Date('2013-09-25'),
        category: 'General',
        community: 'Hindu',
        nationality: 'Indian',
        contactNo: '9876543226',
        email: 'amit.joshi@example.com',
        admissionYear: 2025,
        currentStudyClass: '4th',
        currentSection: 'B'
      },
      {
        studentId: 'DPS2505002', // DPS + 25 (2025) + 05 (5th) + 002 (roll)
        rollNo: '002',
        firstName: 'Shreya',
        middleName: 'Kumari',
        lastName: 'Gupta',
        fatherFirstName: 'Rajesh',
        fatherMiddleName: 'Kumar',
        fatherLastName: 'Gupta',
        motherFirstName: 'Pooja',
        motherMiddleName: 'Devi',
        motherLastName: 'Gupta',
        gender: 'Female',
        dateOfBirth: new Date('2012-01-14'),
        category: 'General',
        community: 'Hindu',
        nationality: 'Indian',
        contactNo: '9876543227',
        email: 'shreya.gupta@example.com',
        admissionYear: 2025,
        currentStudyClass: '5th',
        currentSection: 'B'
      },
      {
        studentId: 'DPS2506002', // DPS + 25 (2025) + 06 (6th) + 002 (roll)
        rollNo: '002',
        firstName: 'Rohit',
        middleName: 'Kumar',
        lastName: 'Singh',
        fatherFirstName: 'Suresh',
        fatherMiddleName: 'Kumar',
        fatherLastName: 'Singh',
        motherFirstName: 'Kavita',
        motherMiddleName: 'Devi',
        motherLastName: 'Singh',
        gender: 'Male',
        dateOfBirth: new Date('2011-06-30'),
        category: 'General',
        community: 'Hindu',
        nationality: 'Indian',
        contactNo: '9876543228',
        email: 'rohit.singh@example.com',
        admissionYear: 2025,
        currentStudyClass: '6th',
        currentSection: 'B'
      },
      {
        studentId: 'DPS2507002', // DPS + 25 (2025) + 07 (7th) + 002 (roll)
        rollNo: '002',
        firstName: 'Kavya',
        middleName: 'Kumari',
        lastName: 'Patel',
        fatherFirstName: 'Vikram',
        fatherMiddleName: 'Singh',
        fatherLastName: 'Patel',
        motherFirstName: 'Meera',
        motherMiddleName: 'Devi',
        motherLastName: 'Patel',
        gender: 'Female',
        dateOfBirth: new Date('2010-04-12'),
        category: 'General',
        community: 'Hindu',
        nationality: 'Indian',
        contactNo: '9876543229',
        email: 'kavya.patel@example.com',
        admissionYear: 2025,
        currentStudyClass: '7th',
        currentSection: 'B'
      }
    ];

    // Create students and corresponding user accounts
    for (const studentData of sampleStudents) {
      try {
        // Create student record
        const student = await Student.create(studentData);
        console.log(`Created student: ${student.studentId} - ${student.firstName} ${student.lastName}`);

        // Create corresponding user account
        const userData = {
          userId: student.studentId,
          password: "Password", // Fixed password as requested
          role: 'student',
          isActive: true
        };

        const user = await User.create(userData);
        console.log(`Created user account: ${user.userId} (${user.role})`);
      } catch (error) {
        console.error(`Error creating student ${studentData.studentId}:`, error.message);
      }
    }

    console.log('Sample students created successfully');
  } catch (error) {
    console.error('Error creating sample students:', error);
    throw error;
  }
};

// Main migration function
const migrateStudentIds = async () => {
  try {
    await connectDB();
    
    console.log('Starting student ID migration...');
    console.log('This will clear all existing students and create new ones with the format: DPS{YY}{CLASS}{ROLL}');
    
    // Ask for confirmation
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    const answer = await new Promise((resolve) => {
      rl.question('Are you sure you want to proceed? This will delete all existing students. (yes/no): ', resolve);
    });

    rl.close();

    if (answer.toLowerCase() !== 'yes') {
      console.log('Migration cancelled.');
      process.exit(0);
    }

    await clearExistingData();
    await createSampleStudents();
    
    console.log('Migration completed successfully!');
    console.log('New student ID format: DPS{YY}{CLASS}{ROLL}');
    console.log('Example: DPS2501001 (DPS + 25 + 01 + 001)');
    
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
    process.exit(0);
  }
};

// Run migration if this file is executed directly
if (require.main === module) {
  migrateStudentIds();
}

module.exports = { migrateStudentIds, generateStudentId, classMapping };
