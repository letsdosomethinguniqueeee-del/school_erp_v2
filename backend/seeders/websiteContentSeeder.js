const mongoose = require('mongoose');
require('dotenv').config();

const {
  NewsEvent,
  Gallery,
  DirectorMessage,
  Faculty,
  Notice,
  Testimonial,
  Achievement
} = require('../models/websiteContent');

const MONGO_URI = process.env.MONGO_URI;

// Sample Data
const sampleNewsEvents = [
  {
    title: 'Annual Science Exhibition 2024',
    category: 'event',
    description: 'Join us for our grand science exhibition showcasing innovative projects by our talented students.',
    content: 'The Annual Science Exhibition will feature over 100 projects across various scientific disciplines including Physics, Chemistry, Biology, and Environmental Science. Students have worked tirelessly to create innovative solutions to real-world problems.',
    image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&q=80',
    eventDate: new Date('2024-12-15'),
    location: 'School Auditorium',
    time: '10:00 AM - 4:00 PM',
    author: 'Admin',
    isPublished: true,
    isFeatured: true
  },
  {
    title: 'Inter-School Sports Championship Victory',
    category: 'achievement',
    description: 'Our school wins the Inter-School Sports Championship with outstanding performance.',
    content: 'Students brought glory to our institution by winning the Inter-School Sports Championship, securing first place in multiple events including athletics, basketball, and swimming.',
    image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&q=80',
    eventDate: new Date('2024-11-20'),
    author: 'Sports Coordinator',
    isPublished: true,
    isFeatured: false
  },
  {
    title: 'Cultural Fest Diwali Celebration',
    category: 'event',
    description: 'Celebrate Diwali with traditional performances, rangoli competition, and festive activities.',
    content: 'Join us for a vibrant celebration of Diwali featuring traditional dance performances, music, rangoli competition, and a special assembly highlighting the significance of the festival of lights.',
    image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600&q=80',
    eventDate: new Date('2024-11-01'),
    location: 'School Ground',
    time: '9:00 AM - 1:00 PM',
    author: 'Cultural Committee',
    isPublished: true
  },
  {
    title: 'Parent-Teacher Meeting',
    category: 'announcement',
    description: 'Important PTM scheduled for all classes to discuss student progress.',
    content: 'Parents are requested to attend the Parent-Teacher Meeting to discuss their ward\'s academic progress, behavior, and overall development. Individual time slots will be shared via email.',
    eventDate: new Date('2024-12-05'),
    location: 'Respective Classrooms',
    time: '2:00 PM - 5:00 PM',
    isPublished: true
  }
];

const sampleGalleries = [
  {
    title: 'Campus Infrastructure',
    description: 'Modern facilities and well-equipped campus',
    category: 'campus',
    images: [
      { url: 'https://images.unsplash.com/photo-1562774053-701939374585?w=400&q=80', caption: 'Main Building' },
      { url: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=400&q=80', caption: 'Library' },
      { url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&q=80', caption: 'Science Labs' },
      { url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400&q=80', caption: 'Smart Classrooms' }
    ],
    isPublished: true
  },
  {
    title: 'Annual Day 2024',
    description: 'Memorable moments from our annual day celebration',
    category: 'events',
    images: [
      { url: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=400&q=80', caption: 'Cultural Performance' },
      { url: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400&q=80', caption: 'Prize Distribution' }
    ],
    isPublished: true
  },
  {
    title: 'Sports Activities',
    description: 'Students excelling in various sports',
    category: 'sports',
    images: [
      { url: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400&q=80', caption: 'Basketball' },
      { url: 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=400&q=80', caption: 'Football' },
      { url: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=400&q=80', caption: 'Swimming' }
    ],
    isPublished: true
  },
  {
    title: 'Academic Excellence',
    description: 'Classroom learning and academic activities',
    category: 'academic',
    images: [
      { url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400&q=80', caption: 'Group Study' },
      { url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&q=80', caption: 'Computer Lab' },
      { url: 'https://images.unsplash.com/photo-1606761568499-6d2451b23c66?w=400&q=80', caption: 'Art Class' }
    ],
    isPublished: true
  }
];

const sampleDirectorMessage = {
  name: 'Dr. Rajesh Kumar',
  designation: 'Principal',
  image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&q=80',
  message: 'Welcome to Delhi Public School. As the Principal, I am proud to lead an institution that is committed to academic excellence, character development, and holistic growth. Our dedicated faculty, modern infrastructure, and innovative teaching methods ensure that every student receives the best education possible. We believe in nurturing not just academic brilliance but also values, creativity, and leadership skills that will prepare our students for the challenges of tomorrow. Together, let us build a brighter future.',
  qualifications: ['Ph.D. in Education', 'M.Ed., M.A. (English)', 'B.Ed.'],
  experience: '25 years in education sector',
  email: 'principal@delhipublicschool.edu',
  phone: '+91 11 1234 5678',
  isActive: true
};

const sampleFaculty = [
  {
    name: 'Mrs. Priya Sharma',
    designation: 'Senior Teacher',
    department: 'Mathematics',
    qualification: 'M.Sc. (Mathematics), B.Ed.',
    experience: '15 years',
    subjects: ['Mathematics', 'Statistics'],
    email: 'priya.sharma@school.edu',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&q=80',
    bio: 'Passionate mathematics educator with expertise in making complex concepts simple and engaging.',
    achievements: ['Best Teacher Award 2023', 'Mathematics Olympiad Coach'],
    isActive: true,
    displayOrder: 1
  },
  {
    name: 'Mr. Amit Verma',
    designation: 'Head of Science Department',
    department: 'Science',
    qualification: 'M.Sc. (Physics), B.Ed.',
    experience: '18 years',
    subjects: ['Physics', 'General Science'],
    email: 'amit.verma@school.edu',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80',
    bio: 'Dedicated science educator promoting hands-on learning and scientific inquiry.',
    achievements: ['CBSE Science Excellence Award', 'Innovation in Teaching Award'],
    isActive: true,
    displayOrder: 2
  },
  {
    name: 'Ms. Kavita Singh',
    designation: 'English Teacher',
    department: 'Languages',
    qualification: 'M.A. (English), B.Ed.',
    experience: '12 years',
    subjects: ['English Literature', 'English Language'],
    email: 'kavita.singh@school.edu',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&q=80',
    bio: 'Creative educator fostering love for literature and language skills.',
    achievements: ['Literary Excellence Award', 'Debate Team Coach'],
    isActive: true,
    displayOrder: 3
  },
  {
    name: 'Mr. Rahul Mehta',
    designation: 'Computer Science Teacher',
    department: 'Computer Science',
    qualification: 'M.C.A., B.Tech (CSE)',
    experience: '10 years',
    subjects: ['Computer Science', 'Information Technology'],
    email: 'rahul.mehta@school.edu',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&q=80',
    bio: 'Technology enthusiast teaching modern programming and digital skills.',
    achievements: ['Coding Competition Mentor', 'Tech Innovation Award'],
    isActive: true,
    displayOrder: 4
  }
];

const sampleNotices = [
  {
    title: 'Winter Vacation Notice',
    content: 'The school will remain closed for winter vacation from December 25, 2024 to January 5, 2025. School will reopen on January 6, 2025. Wishing everyone a joyful holiday season!',
    type: 'holiday',
    priority: 'high',
    publishDate: new Date('2024-11-22'),
    expiryDate: new Date('2025-01-05'),
    targetAudience: 'all',
    isActive: true,
    isPinned: true
  },
  {
    title: 'Annual Examination Schedule',
    content: 'The annual examinations for classes 1-12 will commence from December 10, 2024. Detailed timetable and examination guidelines have been shared with students. Parents are requested to ensure students are well-prepared.',
    type: 'exam',
    priority: 'urgent',
    publishDate: new Date('2024-11-20'),
    expiryDate: new Date('2024-12-20'),
    targetAudience: 'all',
    isActive: true,
    isPinned: true
  },
  {
    title: 'School Uniform Reminder',
    content: 'All students must wear complete school uniform daily. Sports uniform should be worn only on designated PE days. Thank you for your cooperation.',
    type: 'general',
    priority: 'medium',
    publishDate: new Date('2024-11-15'),
    targetAudience: 'students',
    isActive: true
  }
];

const sampleTestimonials = [
  {
    name: 'Ananya Gupta',
    role: 'Alumni',
    batch: '2020',
    message: 'Delhi Public School provided me with the best foundation for my career. The teachers were supportive, and the learning environment was excellent. I am grateful for the values and knowledge I gained here.',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80',
    rating: 5,
    isApproved: true,
    isPublished: true,
    displayOrder: 1
  },
  {
    name: 'Mr. Rajiv Kapoor',
    role: 'Parent',
    batch: 'Current',
    message: 'As a parent, I am extremely satisfied with the quality of education and overall development my child receives at this school. The faculty is dedicated and caring.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
    rating: 5,
    isApproved: true,
    isPublished: true,
    displayOrder: 2
  },
  {
    name: 'Priya Malhotra',
    role: 'Student',
    batch: 'Class 12',
    message: 'I love my school! The teachers are amazing, and there are so many opportunities to explore our interests through clubs and activities. Best school ever!',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
    rating: 5,
    isApproved: true,
    isPublished: true,
    displayOrder: 3
  }
];

const sampleAchievements = [
  {
    title: 'National Science Olympiad Winners',
    description: 'Our students secured top positions in the National Science Olympiad 2024, bringing laurels to the school.',
    category: 'academic',
    achievers: [
      { name: 'Arjun Reddy', class: '10A', rollNumber: '1045' },
      { name: 'Sneha Patel', class: '9B', rollNumber: '932' }
    ],
    date: new Date('2024-10-15'),
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&q=80',
    isPublished: true
  },
  {
    title: 'State Level Basketball Championship',
    description: 'School basketball team won the State Level Championship, showcasing exceptional teamwork and skill.',
    category: 'sports',
    achievers: [
      { name: 'Rahul Kumar', class: '11A', rollNumber: '1123' },
      { name: 'Vikram Singh', class: '12B', rollNumber: '1245' }
    ],
    date: new Date('2024-09-20'),
    image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=600&q=80',
    isPublished: true
  },
  {
    title: 'Inter-School Debate Competition Winners',
    description: 'Students won first prize in the Inter-School Debate Competition with outstanding oratory skills.',
    category: 'cultural',
    achievers: [
      { name: 'Meera Joshi', class: '10B', rollNumber: '1067' }
    ],
    date: new Date('2024-11-05'),
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&q=80',
    isPublished: true
  }
];

async function seedWebsiteData() {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('Connected to MongoDB');
    
    // Clear existing data
    console.log('Clearing existing website data...');
    await NewsEvent.deleteMany({});
    await Gallery.deleteMany({});
    await DirectorMessage.deleteMany({});
    await Faculty.deleteMany({});
    await Notice.deleteMany({});
    await Testimonial.deleteMany({});
    await Achievement.deleteMany({});
    
    // Insert sample data
    console.log('Inserting news and events...');
    await NewsEvent.insertMany(sampleNewsEvents);
    
    console.log('Inserting gallery items...');
    await Gallery.insertMany(sampleGalleries);
    
    console.log('Inserting director message...');
    await DirectorMessage.create(sampleDirectorMessage);
    
    console.log('Inserting faculty data...');
    await Faculty.insertMany(sampleFaculty);
    
    console.log('Inserting notices...');
    await Notice.insertMany(sampleNotices);
    
    console.log('Inserting testimonials...');
    await Testimonial.insertMany(sampleTestimonials);
    
    console.log('Inserting achievements...');
    await Achievement.insertMany(sampleAchievements);
    
    console.log('✅ Website data seeded successfully!');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding website data:', error);
    process.exit(1);
  }
}

seedWebsiteData();
