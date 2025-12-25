# School Website Customization Guide

This guide will help you customize the school website for your institution.

## Quick Start Checklist

- [ ] Update school name, tagline, and establishment year
- [ ] Change brand colors (primary, secondary, accent)
- [ ] Upload your school logo
- [ ] Update contact information
- [ ] Set ERP system link
- [ ] Customize hero section
- [ ] Update mission and vision statements
- [ ] Add principal's message
- [ ] Configure academic information
- [ ] Set admission dates and process
- [ ] Add faculty information
- [ ] Upload gallery images
- [ ] Add news and events
- [ ] Update social media links

## Detailed Customization

### 1. Basic School Information

```javascript
school: {
  name: "Delhi Public School",           // Change to your school name
  tagline: "Excellence in Education",    // Your tagline
  established: 1990                      // Founding year
}
```

### 2. Branding & Colors

```javascript
branding: {
  logo: "/images/logo.png",              // Path to your logo
  colors: {
    primary: "#1e40af",                  // Main color (header, footer)
    secondary: "#f0f9ff",                // Light backgrounds
    accent: "#f59e0b"                    // Buttons, highlights
  },
  theme: "modern"                        // Theme style
}
```

**Color Tips:**
- Use your school's official colors
- Ensure good contrast for readability
- Test colors on mobile devices
- Primary: Should be bold and representative
- Secondary: Light, for backgrounds
- Accent: Should stand out for CTAs

### 3. Contact Information

```javascript
contact: {
  phone: "+91-11-12345678",
  email: "info@dpsschool.com",
  address: "123 Education Street, New Delhi - 110001",
  mapLink: "https://maps.google.com/..."  // Google Maps embed link
}
```

**Getting Google Maps Link:**
1. Go to Google Maps
2. Search for your school
3. Click "Share"
4. Click "Embed a map"
5. Copy the URL from the iframe src

### 4. Social Media

```javascript
socialMedia: {
  facebook: "https://facebook.com/yourschool",
  twitter: "https://twitter.com/yourschool",
  instagram: "https://instagram.com/yourschool",
  youtube: "https://youtube.com/yourschool",
  linkedin: "https://linkedin.com/company/yourschool"
}
```

### 5. ERP Integration

```javascript
erpSystem: {
  link: "http://localhost:3000",         // Production: https://erp.yourschool.com
  buttonText: "Student/Parent Login"
}
```

### 6. Hero Section

```javascript
hero: {
  title: "Welcome to Delhi Public School",
  subtitle: "Nurturing Excellence Since 1990",
  backgroundImage: "/images/school-hero.jpg",
  primaryButton: {
    text: "Admissions Open",
    link: "/admissions"
  },
  secondaryButton: {
    text: "Take a Virtual Tour",
    link: "/gallery"
  }
}
```

### 7. About Section

```javascript
about: {
  title: "About Our School",
  description: "We are committed to providing world-class education...",
  mission: "To provide holistic education that nurtures mind, body, and spirit",
  vision: "To be a leading institution in shaping future global citizens",
  principalMessage: "Welcome message from the principal...",
  image: "/images/about-school.jpg"
}
```

### 8. Statistics

```javascript
statistics: [
  { icon: "👨‍🎓", value: "2000+", label: "Students" },
  { icon: "👨‍🏫", value: "150+", label: "Faculty Members" },
  { icon: "📚", value: "50+", label: "Years of Excellence" },
  { icon: "🏆", value: "98%", label: "Success Rate" }
]
```

### 9. Features/Highlights

```javascript
features: [
  {
    icon: "🎓",
    title: "Academic Excellence",
    description: "CBSE curriculum with focus on holistic development"
  },
  // Add 5-6 key features
]
```

### 10. Academic Information

```javascript
academics: {
  curriculum: "CBSE",
  classes: "Nursery to 12th",
  mediums: ["English", "Hindi"],
  streams: [
    {
      name: "Science",
      description: "For students interested in...",
      subjects: ["Physics", "Chemistry", "Mathematics", "Biology"]
    }
  ]
}
```

### 11. Admission Details

```javascript
admissions: {
  applicationPeriod: "January 1 - February 28, 2024",
  entranceTest: "March 15, 2024",
  resultDate: "March 30, 2024",
  process: [
    {
      title: "Registration",
      description: "Fill the online application form"
    }
    // Add all steps
  ],
  eligibility: [
    "Nursery: 3+ years (as on April 1st)",
    "Class 1: 5+ years (as on April 1st)"
  ],
  requiredDocuments: [
    "Birth Certificate",
    "Address Proof",
    "Transfer Certificate (if applicable)"
  ]
}
```

### 12. Gallery

```javascript
gallery: [
  {
    category: "Campus",
    images: [
      {
        url: "/images/gallery/campus1.jpg",
        title: "Main Building",
        description: "Our state-of-the-art facilities"
      }
    ]
  },
  {
    category: "Events",
    images: [...]
  }
]
```

**Gallery Tips:**
- Use high-quality images (1920x1080 or 1200x800)
- Optimize images (compress before uploading)
- Categorize logically (Campus, Events, Sports, etc.)
- Add descriptive titles and descriptions

### 13. News & Events

```javascript
news: [
  {
    title: "Annual Day Celebration 2024",
    date: "15 Jan 2024",
    excerpt: "A grand celebration with performances...",
    image: "/images/news/annual-day.jpg"
  }
],
events: [
  {
    title: "Science Exhibition",
    date: "25 Feb",
    time: "10:00 AM - 4:00 PM",
    location: "School Auditorium",
    description: "Students showcase their innovative projects"
  }
]
```

### 14. Footer

```javascript
footer: {
  copyrightText: "© {year} {schoolName}. All rights reserved.",
  quickLinks: [
    { label: "About Us", path: "/about" },
    { label: "Admissions", path: "/admissions" },
    { label: "Contact", path: "/contact" }
  ],
  bottomLinks: [
    { label: "Privacy Policy", path: "/privacy" },
    { label: "Terms of Service", path: "/terms" }
  ]
}
```

### 15. SEO Metadata

```javascript
seo: {
  title: "Delhi Public School - Excellence in Education",
  description: "Leading CBSE school providing quality education...",
  keywords: "school, education, CBSE, Delhi, admission",
  ogImage: "/images/og-image.jpg"
}
```

## Image Guidelines

### Required Images

1. **Logo** (`/images/logo.png`)
   - Size: 200x200px
   - Format: PNG with transparent background
   - Square or circular

2. **Hero Background** (`/images/hero-bg.jpg`)
   - Size: 1920x1080px
   - Format: JPG
   - High quality, represents your school

3. **About Image** (`/images/about.jpg`)
   - Size: 800x600px
   - Format: JPG
   - School building or students

4. **Gallery Images**
   - Size: 1200x800px
   - Format: JPG
   - 15-20 images minimum

### Image Optimization

```bash
# Install image optimization tool
npm install -g imagemin-cli

# Optimize images
imagemin images/*.jpg --out-dir=optimized
```

## Testing Your Customization

1. **Visual Testing**
   - Check on desktop (1920x1080)
   - Check on tablet (768x1024)
   - Check on mobile (375x667)

2. **Content Testing**
   - All links work
   - Contact form submits
   - Gallery opens in lightbox
   - ERP link redirects correctly

3. **Performance Testing**
   - Page load time < 3 seconds
   - Images load properly
   - No console errors

## Common Issues

### Issue: Colors not updating
**Solution**: Clear browser cache and hard refresh (Ctrl+Shift+R)

### Issue: Images not loading
**Solution**: Check file paths are correct and images exist in `/public/images/`

### Issue: Gallery not working
**Solution**: Ensure all images in gallery array have valid URLs

### Issue: Contact form not submitting
**Solution**: Configure backend endpoint for form submission

## Multi-School Setup

For deploying to multiple schools:

1. Create config files for each school:
   ```
   config-school1.js
   config-school2.js
   ```

2. Import based on environment:
   ```javascript
   const schoolId = process.env.REACT_APP_SCHOOL_ID;
   const config = require(`./config-${schoolId}.js`);
   ```

3. Set environment variable during build:
   ```bash
   REACT_APP_SCHOOL_ID=school1 npm run build
   ```

## Support

Need help customizing?
- Check README.md for general setup
- See inline comments in config.js
- Contact support: support@example.com

---

**Pro Tip**: Make a backup of config.js before making changes!
