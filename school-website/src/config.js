// School Website Configuration
// Customize this file for each school deployment

const schoolConfig = {
  // School Basic Information
  school: {
    name: "Delhi Public School",
    tagline: "Excellence in Education Since 1990",
    established: 1990
  },
  
  // Branding
  branding: {
    logo: "/assets/logo.png", // Path to school logo
    favicon: "/assets/favicon.ico",
    colors: {
      primary: "#6366f1", // Vibrant Indigo
      secondary: "#ec4899", // Pink
      accent: "#f59e0b", // Amber
      success: "#10b981", // Emerald
      info: "#06b6d4" // Cyan
    },
    theme: "colorful"
  },
  
  // Contact Information
  contact: {
    phone: "+91 11 1234 5678",
    email: "info@delhipublicschool.edu",
    address: "123 School Road, New Delhi, Delhi 110001, India",
    timing: "Mon - Fri: 8:00 AM - 3:00 PM",
    mapLink: "https://maps.google.com/?q=Delhi+Public+School"
  },
  
  // Social Media
  socialMedia: {
    facebook: "https://facebook.com/yourschool",
    twitter: "https://twitter.com/yourschool",
    instagram: "https://instagram.com/yourschool",
    youtube: "https://youtube.com/yourschool",
    linkedin: "https://linkedin.com/company/yourschool"
  },
  
  // ERP System Link
  erpSystem: {
    link: "http://localhost:3000", // Change this to your ERP system URL
    buttonText: "Student/Parent Login"
  },
  
  // Hero Section
  hero: {
    title: "Shaping Future Leaders",
    subtitle: "Providing Quality Education with Modern Teaching Methods",
    backgroundImage: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1920&q=80",
    primaryButton: {
      text: "Apply Now",
      link: "/admissions"
    },
    secondaryButton: {
      text: "Take a Tour",
      link: "/gallery"
    }
  },
  
  // About Section
  about: {
    title: "About Our School",
    description: "We are committed to providing world-class education that nurtures the mind, body, and spirit of every student.",
    mission: "To provide holistic education that nurtures the mind, body, and spirit of every student, preparing them for a successful future.",
    vision: "To be recognized as a leading educational institution that inspires innovation, creativity, and excellence in academic and co-curricular activities.",
    principalMessage: "Welcome to our school family. We are committed to providing the best education and creating future leaders who will contribute positively to society.",
    image: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=600&q=80"
  },
  
  // Statistics (for homepage)
  statistics: [
    { icon: "👨‍🎓", value: "2000+", label: "Students" },
    { icon: "👨‍🏫", value: "150+", label: "Faculty Members" },
    { icon: "📚", value: "30+", label: "Years of Excellence" },
    { icon: "🏆", value: "98%", label: "Success Rate" }
  ],
  
  // Features/Highlights
  features: [
    {
      icon: "🎓",
      title: "Expert Faculty",
      description: "Highly qualified and experienced teachers dedicated to student success"
    },
    {
      icon: "💻",
      title: "Smart Classrooms",
      description: "Technology-enabled learning environment with modern facilities"
    },
    {
      icon: "🏆",
      title: "Sports & Activities",
      description: "Wide range of sports and extracurricular activities for holistic development"
    },
    {
      icon: "🔬",
      title: "State-of-art Labs",
      description: "Well-equipped science, computer, and language labs"
    },
    {
      icon: "📚",
      title: "Rich Library",
      description: "Extensive collection of books and digital resources"
    },
    {
      icon: "🚌",
      title: "Transport Facility",
      description: "Safe and reliable transportation covering all major routes"
    }
  ],
  
  // Academic Information
  academics: {
    curriculum: "CBSE",
    classes: "Nursery to 12th Grade",
    mediums: ["English", "Hindi"],
    streams: [
      {
        name: "Science",
        description: "For students interested in pursuing careers in medicine, engineering, and technology",
        subjects: ["Physics", "Chemistry", "Mathematics", "Biology", "Computer Science", "English"]
      },
      {
        name: "Commerce",
        description: "For students interested in business, finance, and economics",
        subjects: ["Accountancy", "Business Studies", "Economics", "Mathematics", "English"]
      },
      {
        name: "Humanities",
        description: "For students interested in arts, social sciences, and liberal studies",
        subjects: ["History", "Political Science", "Geography", "Psychology", "English"]
      }
    ],
    subjects: [
      { name: "Mathematics", classes: "1-12" },
      { name: "Science", classes: "1-10" },
      { name: "English", classes: "1-12" },
      { name: "Hindi", classes: "1-12" },
      { name: "Social Studies", classes: "1-10" },
      { name: "Computer Science", classes: "1-12" },
      { name: "Physical Education", classes: "1-12" }
    ],
    specialPrograms: [
      { name: "Robotics Club", description: "Learn programming and build robots" },
      { name: "Debate Society", description: "Develop public speaking and critical thinking" },
      { name: "Music Academy", description: "Indian and Western music training" },
      { name: "Art Studio", description: "Painting, sculpture, and creative arts" }
    ]
  },
  
  // Admission Information
  admissions: {
    applicationPeriod: "December 1, 2024 - March 31, 2025",
    entranceTest: "April 15, 2025",
    resultDate: "April 30, 2025",
    requiredDocuments: [
      "Birth Certificate",
      "Address Proof",
      "Transfer Certificate (if applicable)",
      "Passport Size Photographs",
      "Aadhar Card",
      "Previous School Report Card"
    ],
    eligibility: [
      "Nursery: 3+ years (as on April 1st)",
      "Class 1: 5+ years (as on April 1st)",
      "Class 2-12: As per age criteria"
    ],
    process: [
      {
        title: "Registration",
        description: "Fill the online application form on our website with all required details"
      },
      {
        title: "Document Submission",
        description: "Upload scanned copies of all required documents"
      },
      {
        title: "Entrance Test",
        description: "Appear for the entrance examination (for classes 1-12)"
      },
      {
        title: "Interview",
        description: "Personal interaction with parents and student"
      },
      {
        title: "Result Declaration",
        description: "Check result online and download admission letter"
      },
      {
        title: "Fee Payment",
        description: "Complete the admission by paying the fee"
      }
    ]
  },
  
  // Gallery
  gallery: [
    {
      category: "Campus",
      images: [
        { url: "https://images.unsplash.com/photo-1562774053-701939374585?w=400&q=80", title: "Main Building", description: "Our state-of-the-art main building" },
        { url: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=400&q=80", title: "Library", description: "Well-stocked library with digital resources" },
        { url: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&q=80", title: "Science Labs", description: "Modern science laboratories" },
        { url: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400&q=80", title: "Classrooms", description: "Smart and spacious classrooms" }
      ]
    },
    {
      category: "Events",
      images: [
        { url: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=400&q=80", title: "Annual Day", description: "Annual day celebration 2024" },
        { url: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&q=80", title: "Sports Day", description: "Inter-house sports competition" },
        { url: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400&q=80", title: "Cultural Fest", description: "Cultural performances and activities" }
      ]
    },
    {
      category: "Sports",
      images: [
        { url: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400&q=80", title: "Basketball", description: "Indoor basketball court" },
        { url: "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=400&q=80", title: "Soccer Field", description: "Professional soccer ground" },
        { url: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=400&q=80", title: "Swimming Pool", description: "Olympic-size swimming pool" }
      ]
    },
    {
      category: "Academic",
      images: [
        { url: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400&q=80", title: "Study Sessions", description: "Group learning activities" },
        { url: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&q=80", title: "Computer Lab", description: "State-of-the-art IT facilities" },
        { url: "https://images.unsplash.com/photo-1606761568499-6d2451b23c66?w=400&q=80", title: "Art Studio", description: "Creative arts and crafts space" }
      ]
    }
  ],
  
  // News & Events
  news: [
    {
      title: "Annual Day Celebration 2024",
      date: "15 Dec 2024",
      excerpt: "Join us for our grand annual day celebration featuring cultural performances and prize distribution.",
      image: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=600&q=80"
    },
    {
      title: "Sports Day Championship",
      date: "20 Jan 2025",
      excerpt: "Inter-house sports competition showcasing athletic talents of our students.",
      image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&q=80"
    },
    {
      title: "Science Exhibition",
      date: "5 Feb 2025",
      excerpt: "Students showcase their innovative science projects and experiments.",
      image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&q=80"
    }
  ],
  
  events: [
    {
      title: "Parent-Teacher Meeting",
      date: "25 Nov",
      time: "9:00 AM - 12:00 PM",
      location: "School Campus",
      description: "Discuss your child's progress with teachers"
    },
    {
      title: "Winter Carnival",
      date: "15 Dec",
      time: "10:00 AM - 4:00 PM",
      location: "School Grounds",
      description: "Fun-filled day with games, food stalls, and performances"
    }
  ],
  
  // Footer
  footer: {
    copyrightText: "© {year} {schoolName}. All rights reserved.",
    quickLinks: [
      { label: "About Us", path: "/about" },
      { label: "Academics", path: "/academics" },
      { label: "Admissions", path: "/admissions" },
      { label: "Contact", path: "/contact" }
    ],
    bottomLinks: [
      { label: "Privacy Policy", path: "/privacy" },
      { label: "Terms of Service", path: "/terms" },
      { label: "Careers", path: "/careers" }
    ]
  },
  
  // SEO
  seo: {
    metaTitle: "Delhi Public School - Best School in Delhi",
    metaDescription: "Delhi Public School offers quality education from Nursery to 12th Grade with experienced faculty, modern facilities, and holistic development programs.",
    keywords: "delhi public school, best school delhi, cbse school, quality education, holistic development"
  }
};

export default schoolConfig;
