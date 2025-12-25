import React, { useState, useEffect } from 'react';
import config from '../config';
import { websiteAPI } from '../services/api';
import '../styles/HomePage.css';

const HomePage = () => {
  const [news, setNews] = useState([]);
  const [sliderImages, setSliderImages] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNews();
    fetchSliderImages();
    fetchTestimonials();
  }, []);

  useEffect(() => {
    if (sliderImages.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
      }, 5000); // Change slide every 5 seconds
      return () => clearInterval(interval);
    }
  }, [sliderImages]);

  const fetchNews = async () => {
    try {
      const response = await websiteAPI.getContentByType('news', { limit: 3 });
      if (response.success && response.data) {
        setNews(response.data);
      } else {
        setNews(config.news.slice(0, 3));
      }
    } catch (error) {
      console.error('Error fetching news:', error);
      setNews(config.news.slice(0, 3));
    } finally {
      setLoading(false);
    }
  };

  const fetchSliderImages = async () => {
    try {
      const response = await websiteAPI.getContentByType('gallery', { limit: 5 });
      if (response.success && response.data) {
        // Flatten gallery items and get first image from each
        const sliderData = response.data.flatMap(gallery => 
          gallery.images.slice(0, 1).map(img => ({
            image: img.url,
            title: gallery.title,
            description: gallery.description
          }))
        );
        setSliderImages(sliderData);
      } else {
        // Fallback images
        setSliderImages([
          { image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200', title: 'Campus Life' },
          { image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1200', title: 'Modern Facilities' },
          { image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1200', title: 'Quality Education' }
        ]);
      }
    } catch (error) {
      console.error('Error fetching slider images:', error);
      setSliderImages([
        { image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200', title: 'Campus Life' },
        { image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1200', title: 'Modern Facilities' },
        { image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1200', title: 'Quality Education' }
      ]);
    }
  };

  const fetchTestimonials = async () => {
    try {
      const response = await websiteAPI.getContentByType('testimonial', { limit: 6 });
      if (response.success && response.data) {
        setTestimonials(response.data);
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    }
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + sliderImages.length) % sliderImages.length);
  };

  return (
    <div className="home-page">
      {/* Image Slider Section */}
      <section className="hero-slider">
        <div className="slider-container">
          {sliderImages.length > 0 && (
            <>
              {sliderImages.map((slide, index) => (
                <div
                  key={index}
                  className={`slide ${index === currentSlide ? 'active' : ''}`}
                  style={{
                    backgroundImage: `linear-gradient(rgba(99, 102, 241, 0.7), rgba(236, 72, 153, 0.7)), url(${slide.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    display: index === currentSlide ? 'flex' : 'none'
                  }}
                >
                  <div className="slide-content">
                    <h1 className="hero-title">{slide.title || config.hero.title}</h1>
                    <p className="hero-subtitle">{slide.description || config.hero.subtitle}</p>
                    <div className="hero-buttons">
                      <a 
                        href={config.hero.primaryButton.link} 
                        className="btn btn-primary"
                        style={{ backgroundColor: config.branding.colors.accent }}
                      >
                        {config.hero.primaryButton.text}
                      </a>
                      <a 
                        href={config.hero.secondaryButton.link} 
                        className="btn btn-secondary"
                      >
                        {config.hero.secondaryButton.text}
                      </a>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Slider Controls */}
              <button className="slider-btn prev" onClick={prevSlide}>
                ‹
              </button>
              <button className="slider-btn next" onClick={nextSlide}>
                ›
              </button>
              
              {/* Slider Dots */}
              <div className="slider-dots">
                {sliderImages.map((_, index) => (
                  <span
                    key={index}
                    className={`dot ${index === currentSlide ? 'active' : ''}`}
                    onClick={() => goToSlide(index)}
                  ></span>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Statistics Section */}
      <section className="stats-section" style={{ backgroundColor: config.branding.colors.secondary }}>
        <div className="container">
          <div className="stats-grid">
            {config.statistics.map((stat, index) => (
              <div key={index} className="stat-card">
                <div className="stat-icon">{stat.icon}</div>
                <div className="stat-value" style={{ color: config.branding.colors.primary }}>{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Preview Section */}
      <section className="about-preview-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Welcome to {config.school.name}</h2>
            <div className="section-divider" style={{ backgroundColor: config.branding.colors.accent }}></div>
          </div>
          <div className="about-preview-content">
            <div className="about-preview-text">
              <p className="about-description">{config.about.description}</p>
              <div className="mission-vision-preview">
                <div className="mv-preview-card" style={{ borderLeftColor: config.branding.colors.primary }}>
                  <h3>Our Mission</h3>
                  <p>{config.about.mission}</p>
                </div>
                <div className="mv-preview-card" style={{ borderLeftColor: config.branding.colors.accent }}>
                  <h3>Our Vision</h3>
                  <p>{config.about.vision}</p>
                </div>
              </div>
              <a href="/about" className="btn" style={{ backgroundColor: config.branding.colors.primary, color: 'white', marginTop: '2rem' }}>
                Learn More About Us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section" style={{ backgroundColor: '#f8f9fa' }}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Why Choose Us</h2>
            <div className="section-divider" style={{ backgroundColor: config.branding.colors.accent }}></div>
          </div>
          <div className="features-grid">
            {config.features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon" style={{ color: config.branding.colors.primary }}>
                  {feature.icon}
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest News Section */}
      <section className="news-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Latest Updates</h2>
            <div className="section-divider" style={{ backgroundColor: config.branding.colors.accent }}></div>
          </div>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <p>Loading news...</p>
            </div>
          ) : (
            <div className="news-grid">
              {news.map((item, index) => (
                <div key={item._id || index} className="news-card">
                  <div className="news-image">
                    <img src={item.image} alt={item.title} />
                  </div>
                  <div className="news-content">
                    <div className="news-date">
                      {item.date ? new Date(item.date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      }) : item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      }) : 'Recent'}
                    </div>
                    <h3 className="news-title">{item.title}</h3>
                    <p className="news-excerpt">{item.description || item.excerpt}</p>
                    <a href="/news" className="news-link" style={{ color: config.branding.colors.primary }}>
                      Read More →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Testimonials Section */}
      {testimonials.length > 0 && (
        <section className="testimonials-section" style={{ backgroundColor: '#f8f9fa' }}>
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">What Parents Say</h2>
              <div className="section-divider" style={{ backgroundColor: config.branding.colors.accent }}></div>
            </div>
            <div className="testimonials-grid">
              {testimonials.map((testimonial, index) => (
                <div key={testimonial._id || index} className="testimonial-card">
                  <div className="testimonial-quote">"</div>
                  <p className="testimonial-text">{testimonial.content || testimonial.message}</p>
                  <div className="testimonial-author">
                    <div className="author-avatar" style={{ backgroundColor: config.branding.colors.primary }}>
                      {testimonial.name?.charAt(0) || 'A'}
                    </div>
                    <div className="author-info">
                      <h4>{testimonial.name}</h4>
                      <p>{testimonial.designation || 'Parent'}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section 
        className="cta-section" 
        style={{ background: `linear-gradient(135deg, ${config.branding.colors.primary} 0%, #3b82f6 100%)` }}
      >
        <div className="container">
          <h2 className="cta-title">Ready to Join Our School Family?</h2>
          <p className="cta-text">Start your child's journey to excellence today</p>
          <a 
            href="/admissions" 
            className="btn btn-cta"
            style={{ backgroundColor: config.branding.colors.accent }}
          >
            Apply Now
          </a>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
