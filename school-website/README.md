# School Website - Customizable Multi-School Platform

A fully customizable, responsive school website that can be easily rebranded for different schools. Built with React, this website integrates seamlessly with the School ERP system.

## Features

- 🎨 **Fully Customizable**: Easy configuration through `config.js` for branding, colors, content
- 📱 **Responsive Design**: Works perfectly on all devices
- 🏫 **Multi-School Support**: Easily rebrand for different schools
- 🔗 **ERP Integration**: Direct link to student/parent portal
- 📄 **8 Complete Pages**: Home, About, Academics, Admissions, Faculty, Gallery, News/Events, Contact
- ⚡ **Fast Performance**: Built with React for optimal speed
- 🎯 **SEO Optimized**: Metadata configuration for better search rankings

## Pages

1. **Home** - Hero section, statistics, features, latest news
2. **About** - School overview, mission, vision, principal's message, core values
3. **Academics** - Curriculum, streams, subjects, facilities
4. **Admissions** - Process, eligibility, documents, dates
5. **Faculty** - Teacher profiles, departments, professional development
6. **Gallery** - Photo gallery with category filters and lightbox
7. **News & Events** - Latest updates, upcoming events, newsletter
8. **Contact** - Contact form, location map, social media links

## Quick Setup

### 1. Customize Your School

Edit `config.js` to customize for your school:

```javascript
export default {
  school: {
    name: "Your School Name",
    tagline: "Your Tagline",
    established: 2020
  },
  branding: {
    logo: "/images/logo.png",
    colors: {
      primary: "#1e40af",    // Main color
      secondary: "#f0f9ff",  // Light background
      accent: "#f59e0b"      // CTA buttons
    }
  },
  contact: {
    phone: "+91-1234567890",
    email: "info@yourschool.com",
    address: "Your Address"
  },
  erpSystem: {
    link: "http://localhost:3000",  // Your ERP URL
    buttonText: "Student/Parent Login"
  }
  // ... more customization options
};
```

### 2. Install Dependencies

```bash
cd school-website
npm install
```

### 3. Run the Website

```bash
npm start
```

The website will open at `http://localhost:3000/school`

### 4. Build for Production

```bash
npm build
```

## Customization Guide

### Colors & Branding

All colors are defined in `config.js`:
- `primary`: Header, footer, main buttons
- `secondary`: Section backgrounds
- `accent`: Call-to-action buttons

### Content

All content is in `config.js`:
- Hero section text and images
- About section (mission, vision, principal's message)
- Statistics (students, teachers, success rate)
- Features list
- Academic information (curriculum, streams, subjects)
- Admission details (dates, process, requirements)
- News and events
- Gallery images
- Footer links

### Images

Place your images in `/public/images/` and update paths in `config.js`:
- Logo: `/images/logo.png`
- Hero background: `/images/hero-bg.jpg`
- About image: `/images/about.jpg`
- Gallery images: `/images/gallery/`

### ERP Integration

Update the ERP link in `config.js`:

```javascript
erpSystem: {
  link: "https://your-erp-domain.com",
  buttonText: "Login to Portal"
}
```

## File Structure

```
school-website/
├── config.js                   # Main configuration file
├── SchoolWebsite.js           # Main app component
├── package.json               # Dependencies
├── components/
│   ├── Header.js              # Header with navigation
│   └── Footer.js              # Footer with links
├── pages/
│   ├── HomePage.js            # Landing page
│   ├── AboutPage.js           # About us
│   ├── AcademicsPage.js       # Academic information
│   ├── AdmissionsPage.js      # Admission process
│   ├── FacultyPage.js         # Faculty profiles
│   ├── GalleryPage.js         # Photo gallery
│   ├── NewsPage.js            # News & events
│   └── ContactPage.js         # Contact form
└── styles/
    ├── Header.css
    ├── Footer.css
    ├── HomePage.css
    ├── AboutPage.css
    ├── AcademicsPage.css
    ├── AdmissionsPage.css
    ├── FacultyPage.css
    ├── GalleryPage.css
    ├── NewsPage.css
    └── ContactPage.css
```

## Deployment

### Option 1: Deploy with ERP System

Copy the `school-website` folder to your main ERP project and integrate routes.

### Option 2: Separate Deployment

Deploy separately and link to ERP:

1. Build the website: `npm run build`
2. Deploy the `build` folder to your hosting
3. Update `config.js` with production ERP URL

## Multi-School Deployment

To deploy for multiple schools:

1. Create separate config files:
   - `config-school1.js`
   - `config-school2.js`
   
2. Import appropriate config based on domain/subdomain
3. Each school gets custom branding while using same codebase

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- Lazy loading for images
- Optimized CSS
- Minimal dependencies
- Fast React rendering

## Support

For questions or issues:
- Email: support@example.com
- Documentation: See inline comments in `config.js`

## License

ISC

---

**Note**: This website is designed to work with the School ERP system. Make sure to configure the ERP link correctly in `config.js`.
