const mongoose = require('mongoose');
const Subject = require('../../models/systemConfiguration/Subject');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const generateSubjectData = (usedSubjectCodes) => {
  const subjects = [
    { code: 'PHY', name: 'Physics' },
    { code: 'CHEM', name: 'Chemistry' },
    { code: 'MATH', name: 'Mathematics' },
    { code: 'BIO', name: 'Biology' },
    { code: 'ENG', name: 'English' },
    { code: 'HIN', name: 'Hindi' },
    { code: 'SST', name: 'Social Studies' },
    { code: 'SCI', name: 'Science' },
    { code: 'COMP', name: 'Computer Science' },
    { code: 'ART', name: 'Art' },
    { code: 'MUS', name: 'Music' },
    { code: 'PE', name: 'Physical Education' },
    { code: 'ECO', name: 'Economics' },
    { code: 'HIST', name: 'History' },
    { code: 'GEO', name: 'Geography' },
    { code: 'POL', name: 'Political Science' },
    { code: 'PSY', name: 'Psychology' },
    { code: 'PHIL', name: 'Philosophy' },
    { code: 'LIT', name: 'Literature' },
    { code: 'BIO', name: 'Biology' },
    { code: 'CHEM', name: 'Chemistry' },
    { code: 'PHY', name: 'Physics' },
    { code: 'MATH', name: 'Mathematics' },
    { code: 'ENG', name: 'English' },
    { code: 'HIN', name: 'Hindi' }
  ];

  let subjectCode;
  let attempts = 0;
  
  // Generate unique subject code
  do {
    const randomSubject = subjects[Math.floor(Math.random() * subjects.length)];
    subjectCode = randomSubject.code;
    attempts++;
    
    // Prevent infinite loop
    if (attempts > 100) {
      subjectCode = `${randomSubject.code}-${Math.random().toString(36).substr(2, 3)}`;
      break;
    }
  } while (usedSubjectCodes.has(subjectCode));
  
  usedSubjectCodes.add(subjectCode);
  
  const randomSubject = subjects[Math.floor(Math.random() * subjects.length)];
  
  return {
    subject_code: subjectCode,
    subject_name: randomSubject.name,
    is_active: Math.random() > 0.1 // 90% chance of being active
  };
};

const createDummySubjects = async (count = 100) => {
  try {
    await connectDB();
    
    // Clear existing subjects
    await Subject.deleteMany({});
    console.log('Cleared existing subjects');
    
    const usedSubjectCodes = new Set();
    const subjects = [];
    
    for (let i = 0; i < count; i++) {
      const subjectData = generateSubjectData(usedSubjectCodes);
      subjects.push(subjectData);
    }
    
    await Subject.insertMany(subjects);
    console.log(`Successfully created ${count} subjects`);
    
    // Display some sample data
    const sampleSubjects = await Subject.find().limit(5);
    console.log('Sample subjects created:');
    sampleSubjects.forEach(subject => {
      console.log(`- ${subject.subject_code}: ${subject.subject_name} (${subject.is_active ? 'Active' : 'Inactive'})`);
    });
    
  } catch (error) {
    console.error('Error creating subjects:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run the seeder
if (require.main === module) {
  const count = process.argv[2] ? parseInt(process.argv[2]) : 100;
  createDummySubjects(count);
}

module.exports = { createDummySubjects };
