const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Student schema
const studentSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  middleName: { type: String, default: '' },
  lastName: { type: String, default: '' },
  studentId: {type:String, required:true, unique:true},
  rollNo: { type: String, required:true },
  govtProvidedId : {type:String},
  fatherFirstName: { type: String, required: true },
  fatherMiddleName: { type: String, default: '' },
  fatherLastName: { type: String, default: '' },
  fatherMobile: { type: String, default: '' },
  motherFirstName: { type: String, required: true },
  motherMiddleName: { type: String, default: '' },
  motherLastName: { type: String, default: '' },
  motherMobile: { type: String, default: '' },
  parent1Id: {type:String },
  parent1Relation: {type:String},
  parent2Id: {type:String },
  parent2Relation: {type:String},
  gender: { type: String, enum: ['Male', 'Female', 'Other'] },
  dateOfBirth: { type: Date },
  category: { type: String },
  community: { type: String },
  nationality: { type: String },
  bloodGroup: { type: String, default: '' },
  aadharCardNo: { type: String },
  contactNo: { type: String },
  additionalContactNo: { type: String },
  email: { type: String, sparse: true },
  admissionYear: { type: Number },
  currentStudyClass: { type: String },
  currentSection: { type: String },
  pic: { type: String },
}, { timestamps: true });

const Student = mongoose.model('Student', studentSchema);

// User schema
const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

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
  const currentYear = new Date().getFullYear();
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

async function createCompleteUserSystem() {
  try {
    await connectDB();
    
    console.log('🗑️ Deleting ALL existing records...');
    
    // Delete all students
    const deletedStudents = await Student.deleteMany({});
    console.log(`✅ Deleted ${deletedStudents.deletedCount} students`);
    
    // Delete all users
    const deletedUsers = await User.deleteMany({});
    console.log(`✅ Deleted ${deletedUsers.deletedCount} users`);
    
    console.log('\n👥 Creating system users (Admin, Super-Admin, Teachers, Staff)...');
    
    // Create system users
    const systemUsers = [
      { userId: 'admin', password: 'admin123', role: 'admin', isActive: true },
      { userId: 'superadmin', password: 'superadmin123', role: 'super-admin', isActive: true },
      { userId: 'teacher1', password: 'teacher123', role: 'teacher', isActive: true },
      { userId: 'teacher2', password: 'teacher123', role: 'teacher', isActive: true },
      { userId: 'teacher3', password: 'teacher123', role: 'teacher', isActive: true },
      { userId: 'staff1', password: 'staff123', role: 'staff', isActive: true },
      { userId: 'staff2', password: 'staff123', role: 'staff', isActive: true },
      { userId: 'staff3', password: 'staff123', role: 'staff', isActive: true },
    ];
    
    let systemUsersCreated = 0;
    for (const userData of systemUsers) {
      try {
        await User.create(userData);
        console.log(`  ✅ Created ${userData.role}: ${userData.userId}`);
        systemUsersCreated++;
      } catch (error) {
        console.log(`  ❌ Failed to create ${userData.userId}: ${error.message}`);
      }
    }
    
    console.log(`\n📊 System Users Created: ${systemUsersCreated}`);
    
    console.log('\n📚 Creating 100 students for each class...');
    console.log(`📅 Admission Year: ${currentYear}`);
    console.log(`🆔 Student ID Format: DPS${currentYear}001, DPS${currentYear}002, etc.`);
    console.log(`🔢 Roll Number Format: 001, 002, 003... (per class)`);
    
    let totalStudentsCreated = 0;
    let totalErrors = 0;
    let globalStudentCounter = 1; // Global counter for student IDs across all classes
    
    for (const currentClass of classes) {
      console.log(`\n🎓 Creating students for class ${currentClass}...`);
      
      let classRollCounter = 1; // Roll number counter for this class
      
      for (const section of sections) {
        console.log(`  📝 Section ${section}:`);
        
        for (let i = 1; i <= 25; i++) { // 25 students per section (4 sections = 100 per class)
          // Global student ID (sequential across all classes)
          const studentId = `DPS${currentYear}${globalStudentCounter.toString().padStart(3, '0')}`;
          
          // Class-wise roll number
          const rollNo = classRollCounter.toString().padStart(3, '0');
          
          const studentData = generateStudentData(studentId, rollNo, currentClass, section);
          
          try {
            // Create student record directly
            const student = await Student.create(studentData);
            
            // Create corresponding user record
            const userData = {
              userId: studentId,
              password: "Password", // Fixed password as requested
              role: 'student',
              isActive: true
            };
            
            await User.create(userData);
            
            console.log(`    ✅ Created ${studentId} (Roll: ${rollNo}) - ${studentData.firstName} ${studentData.lastName}`);
            totalStudentsCreated++;
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
    console.log(`✅ System Users Created: ${systemUsersCreated}`);
    console.log(`✅ Students Created: ${totalStudentsCreated}`);
    console.log(`❌ Total Errors: ${totalErrors}`);
    console.log(`📚 Classes: ${classes.length} (${classes.join(', ')})`);
    console.log(`👥 Students per class: 100`);
    console.log(`📋 Total Students: ${classes.length * 100}`);
    console.log(`🆔 Student ID range: DPS${currentYear}001 to DPS${currentYear}${(totalStudentsCreated).toString().padStart(3, '0')}`);
    console.log(`🔢 Roll numbers: 001-100 per class`);
    console.log(`\n👤 System Users Available:`);
    console.log(`   - admin (admin123) - Admin`);
    console.log(`   - superadmin (superadmin123) - Super Admin`);
    console.log(`   - teacher1, teacher2, teacher3 (teacher123) - Teachers`);
    console.log(`   - staff1, staff2, staff3 (staff123) - Staff`);
    console.log(`   - All students (Password) - Students`);
    
  } catch (error) {
    console.error('❌ Error in creating complete user system:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  }
}

// Run the script
createCompleteUserSystem();
