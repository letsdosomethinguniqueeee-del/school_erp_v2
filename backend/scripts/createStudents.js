const mongoose = require('mongoose');
const Student = require('../models/studentModel');
const User = require('../models/User');
require('dotenv').config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Sample data for students
const sampleNames = {
  male: [
    'Aarav', 'Arjun', 'Vikram', 'Rohan', 'Karan', 'Suresh', 'Rajesh', 'Manoj', 'Pradeep', 'Anil',
    'Ravi', 'Kumar', 'Sandeep', 'Deepak', 'Naveen', 'Vinod', 'Sunil', 'Ramesh', 'Suresh', 'Mukesh',
    'Amit', 'Rahul', 'Vishal', 'Gaurav', 'Nikhil', 'Rohit', 'Akash', 'Pranav', 'Kunal', 'Sahil',
    'Yash', 'Aditya', 'Harsh', 'Krishna', 'Shivam', 'Ankit', 'Vivek', 'Ritik', 'Siddharth', 'Abhishek'
  ],
  female: [
    'Priya', 'Anita', 'Sunita', 'Kavita', 'Rita', 'Sita', 'Gita', 'Neha', 'Pooja', 'Sneha',
    'Riya', 'Kavya', 'Shreya', 'Ananya', 'Isha', 'Aisha', 'Kriti', 'Nisha', 'Tanya', 'Divya',
    'Sakshi', 'Pallavi', 'Shweta', 'Deepika', 'Rashmi', 'Jyoti', 'Meera', 'Kiran', 'Suman', 'Rekha',
    'Anjali', 'Shilpa', 'Manisha', 'Sarita', 'Usha', 'Lata', 'Geeta', 'Kamala', 'Sushila', 'Indira'
  ],
  lastNames: [
    'Sharma', 'Verma', 'Gupta', 'Singh', 'Kumar', 'Yadav', 'Patel', 'Jain', 'Agarwal', 'Malhotra',
    'Reddy', 'Nair', 'Iyer', 'Menon', 'Pillai', 'Rao', 'Joshi', 'Pandey', 'Mishra', 'Tiwari',
    'Choudhary', 'Bansal', 'Goyal', 'Khanna', 'Saxena', 'Agarwal', 'Bhatia', 'Chopra', 'Dixit', 'Garg'
  ]
};

const classes = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th'];
const sections = ['A', 'B', 'C', 'D'];
const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const communities = ['Hindu', 'Muslim', 'Christian', 'Sikh', 'Buddhist', 'Jain', 'Parsi', 'Other'];
const categories = ['General', 'OBC', 'SC', 'ST', 'EWS'];

// Get current year for admission year
const currentYear = new Date().getFullYear();

// Function to generate random student data
const generateStudentData = (studentId, rollNo, currentStudyClass, currentSection) => {
  const isMale = Math.random() > 0.5;
  const gender = isMale ? 'Male' : 'Female';
  const firstName = isMale ? 
    sampleNames.male[Math.floor(Math.random() * sampleNames.male.length)] :
    sampleNames.female[Math.floor(Math.random() * sampleNames.female.length)];
  
  const lastName = sampleNames.lastNames[Math.floor(Math.random() * sampleNames.lastNames.length)];
  const fatherName = sampleNames.male[Math.floor(Math.random() * sampleNames.male.length)];
  const motherName = sampleNames.female[Math.floor(Math.random() * sampleNames.female.length)];
  
  // Generate random date of birth (age 5-18)
  const birthYear = currentYear - (5 + Math.floor(Math.random() * 14));
  const birthMonth = Math.floor(Math.random() * 12);
  const birthDay = Math.floor(Math.random() * 28) + 1;
  const dateOfBirth = new Date(birthYear, birthMonth, birthDay);
  
  // Generate mobile numbers
  const generateMobile = () => {
    const prefixes = ['9', '8', '7', '6'];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    return prefix + Math.floor(Math.random() * 9000000000) + 1000000000;
  };
  
  return {
    studentId,
    rollNo: rollNo.toString(),
    firstName,
    middleName: Math.random() > 0.7 ? sampleNames.male[Math.floor(Math.random() * sampleNames.male.length)] : '',
    lastName,
    govtProvidedId: '',
    fatherFirstName: fatherName,
    fatherMiddleName: '',
    fatherLastName: lastName,
    fatherMobile: generateMobile(),
    motherFirstName: motherName,
    motherMiddleName: '',
    motherLastName: lastName,
    motherMobile: generateMobile(),
    parent1Id: '',
    parent1Relation: 'Father',
    parent2Id: '',
    parent2Relation: 'Mother',
    gender,
    dateOfBirth,
    category: categories[Math.floor(Math.random() * categories.length)],
    community: communities[Math.floor(Math.random() * communities.length)],
    nationality: 'Indian',
    bloodGroup: bloodGroups[Math.floor(Math.random() * bloodGroups.length)],
    aadharCardNo: Math.floor(Math.random() * 900000000000) + 100000000000,
    contactNo: generateMobile(),
    additionalContactNo: Math.random() > 0.5 ? generateMobile() : '',
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
    admissionYear: currentYear,
    currentStudyClass: currentStudyClass,
    currentSection: currentSection,
    pic: ''
  };
};

// Main function to create students
async function createStudents(options = {}) {
  const {
    resetDatabase = false,
    studentsPerClass = 100,
    createSystemUsers = true
  } = options;

  try {
    await connectDB();
    
    if (resetDatabase) {
      console.log('🗑️ Resetting database...');
      await Student.deleteMany({});
      await User.deleteMany({});
      console.log('✅ Database reset complete');
    }
    
    if (createSystemUsers) {
      console.log('\n👥 Creating system users...');
      const systemUsers = [
        { userId: 'admin', password: 'admin123', role: 'admin', isActive: true },
        { userId: 'superadmin', password: 'superadmin123', role: 'super-admin', isActive: true },
        { userId: 'teacher1', password: 'teacher123', role: 'teacher', isActive: true },
        { userId: 'teacher2', password: 'teacher123', role: 'teacher', isActive: true },
        { userId: 'staff1', password: 'staff123', role: 'staff', isActive: true },
        { userId: 'staff2', password: 'staff123', role: 'staff', isActive: true },
      ];
      
      for (const userData of systemUsers) {
        try {
          await User.create(userData);
          console.log(`  ✅ Created ${userData.role}: ${userData.userId}`);
        } catch (error) {
          console.log(`  ❌ Failed to create ${userData.userId}: ${error.message}`);
        }
      }
    }
    
    console.log(`\n📚 Creating ${studentsPerClass} students for each class...`);
    console.log(`📅 Admission Year: ${currentYear}`);
    console.log(`🆔 Student ID Format: DPS${currentYear}001, DPS${currentYear}002, etc.`);
    
    let totalCreated = 0;
    let totalErrors = 0;
    let globalStudentCounter = 1;
    
    for (const currentClass of classes) {
      console.log(`\n🎓 Creating students for class ${currentClass}...`);
      
      let classRollCounter = 1;
      
      for (const section of sections) {
        const studentsPerSection = Math.ceil(studentsPerClass / sections.length);
        
        for (let i = 1; i <= studentsPerSection; i++) {
          const studentId = `DPS${currentYear}${globalStudentCounter.toString().padStart(3, '0')}`;
          const rollNo = classRollCounter.toString().padStart(3, '0');
          
          const studentData = generateStudentData(studentId, rollNo, currentClass, section);
          
          try {
            // Create student record
            const student = await Student.create(studentData);
            
            // Create corresponding user record
            const userData = {
              userId: studentId,
              password: "Password",
              role: 'student',
              isActive: true
            };
            
            await User.create(userData);
            
            console.log(`    ✅ Created ${studentId} (Roll: ${rollNo}) - ${studentData.firstName} ${studentData.lastName}`);
            totalCreated++;
            globalStudentCounter++;
            classRollCounter++;
          } catch (error) {
            console.log(`    ❌ Failed to create ${studentId}: ${error.message}`);
            totalErrors++;
            globalStudentCounter++;
            classRollCounter++;
          }
        }
      }
    }
    
    console.log('\n📊 Final Summary:');
    console.log(`✅ Students Created: ${totalCreated}`);
    console.log(`❌ Total Errors: ${totalErrors}`);
    console.log(`📚 Classes: ${classes.length}`);
    console.log(`👥 Students per class: ${studentsPerClass}`);
    console.log(`📋 Total Students: ${classes.length * studentsPerClass}`);
    
  } catch (error) {
    console.error('❌ Error in student creation process:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  }
}

// Export for use in other scripts
module.exports = { createStudents, generateStudentData };

// Run if called directly
if (require.main === module) {
  const args = process.argv.slice(2);
  const options = {
    resetDatabase: args.includes('--reset'),
    studentsPerClass: parseInt(args.find(arg => arg.startsWith('--students='))?.split('=')[1]) || 100,
    createSystemUsers: !args.includes('--no-system-users')
  };
  
  createStudents(options);
}
