const mongoose = require('mongoose');
const AcademicYear = require('../../models/systemConfiguration/AcademicYear');
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

// Generate random academic year data with unique year codes
const generateAcademicYearData = (usedYearCodes) => {
  const currentYear = new Date().getFullYear();
  const startYear = currentYear - 10; // Start from 10 years ago
  const endYear = currentYear + 5; // Go up to 5 years in future
  
  let yearCode;
  let attempts = 0;
  
  // Generate unique year code
  do {
    const baseYear = startYear + Math.floor(Math.random() * (endYear - startYear));
    const nextYear = baseYear + 1;
    yearCode = `${baseYear}-${nextYear.toString().slice(-2)}`;
    attempts++;
    
    // Prevent infinite loop
    if (attempts > 100) {
      yearCode = `${baseYear}-${nextYear.toString().slice(-2)}-${Math.random().toString(36).substr(2, 3)}`;
      break;
    }
  } while (usedYearCodes.has(yearCode));
  
  usedYearCodes.add(yearCode);
  
  // Generate start date (random month between Jan and Dec)
  const startMonth = Math.floor(Math.random() * 12) + 1;
  const startDay = Math.floor(Math.random() * 28) + 1; // Use 28 to avoid invalid dates
  const startDate = new Date(startYear + Math.floor(Math.random() * (endYear - startYear)), startMonth - 1, startDay);
  
  // Generate end date (1 year after start date)
  const endDate = new Date(startDate);
  endDate.setFullYear(endDate.getFullYear() + 1);
  
  // Random status
  const statuses = ['upcoming', 'current', 'completed'];
  const status = statuses[Math.floor(Math.random() * statuses.length)];
  
  return {
    year_code: yearCode,
    start_date: startDate,
    end_date: endDate,
    status: status,
    is_active: Math.random() > 0.1 // 90% chance of being active
  };
};

// Create dummy academic years
const createDummyAcademicYears = async (count = 5000) => {
  try {
    console.log(`Creating ${count} dummy academic years...`);
    
    const academicYears = [];
    const usedYearCodes = new Set();
    
    for (let i = 0; i < count; i++) {
      academicYears.push(generateAcademicYearData(usedYearCodes));
      
      // Log progress every 1000 records
      if ((i + 1) % 1000 === 0) {
        console.log(`Generated ${i + 1} records...`);
      }
    }
    
    console.log('Inserting records into database...');
    const result = await AcademicYear.insertMany(academicYears);
    console.log(`Successfully created ${result.length} academic years`);
    
    // Show some statistics
    const stats = await AcademicYear.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
    
    console.log('\nStatus distribution:');
    stats.forEach(stat => {
      console.log(`${stat._id}: ${stat.count} records`);
    });
    
    const activeCount = await AcademicYear.countDocuments({ is_active: true });
    const inactiveCount = await AcademicYear.countDocuments({ is_active: false });
    
    console.log(`\nActive records: ${activeCount}`);
    console.log(`Inactive records: ${inactiveCount}`);
    
  } catch (error) {
    console.error('Error creating dummy academic years:', error);
    throw error;
  }
};

// Clear existing academic years (optional)
const clearExistingData = async () => {
  try {
    console.log('Clearing existing academic years...');
    const result = await AcademicYear.deleteMany({});
    console.log(`Deleted ${result.deletedCount} existing records`);
  } catch (error) {
    console.error('Error clearing existing data:', error);
    throw error;
  }
};

// Main function
const main = async () => {
  try {
    await connectDB();
    
    // Ask user if they want to clear existing data
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    const answer = await new Promise((resolve) => {
      rl.question('Do you want to clear existing academic years? (y/N): ', resolve);
    });
    
    if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
      await clearExistingData();
    }
    
    await createDummyAcademicYears(5000);
    
    console.log('\n✅ Dummy data creation completed successfully!');
    console.log('You can now test the fetch request and other features.');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Database connection closed');
    process.exit(0);
  }
};

// Run the script
if (require.main === module) {
  main();
}

module.exports = {
  createDummyAcademicYears,
  clearExistingData,
  generateAcademicYearData
};
