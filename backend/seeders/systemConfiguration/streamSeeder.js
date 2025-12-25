const mongoose = require('mongoose');
const Stream = require('../../models/systemConfiguration/Stream');
require('dotenv').config();

const seedStreams = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/school_erp');
    console.log('Connected to MongoDB');

    // Clear existing streams
    await Stream.deleteMany({});
    console.log('Cleared existing streams');

    // Create dummy streams
    const dummyStreams = [
      {
        stream_code: 'ARTS',
        stream_name: 'Arts',
        is_active: true
      },
      {
        stream_code: 'COMM',
        stream_name: 'Commerce',
        is_active: true
      },
      {
        stream_code: 'SCI',
        stream_name: 'Science',
        is_active: true
      },
      {
        stream_code: 'PCM',
        stream_name: 'PCM (Physics, Chemistry, Mathematics)',
        is_active: true
      },
      {
        stream_code: 'PCB',
        stream_name: 'PCB (Physics, Chemistry, Biology)',
        is_active: true
      },
      {
        stream_code: 'MATH',
        stream_name: 'Mathematics',
        is_active: true
      },
      {
        stream_code: 'GEN',
        stream_name: 'General',
        is_active: true
      },
      {
        stream_code: 'VOC',
        stream_name: 'Vocational',
        is_active: false
      }
    ];

    // Insert dummy streams
    const createdStreams = await Stream.insertMany(dummyStreams);
    console.log(`Created ${createdStreams.length} dummy streams:`);
    
    createdStreams.forEach(stream => {
      console.log(`- ${stream.stream_code}: ${stream.stream_name} (${stream.is_active ? 'Active' : 'Inactive'})`);
    });

    console.log('Stream seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding streams:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  }
};

// Run the seeder
seedStreams();
