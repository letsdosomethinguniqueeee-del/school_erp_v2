import React, { useState, useEffect } from 'react';
import config from '../config';
import { websiteAPI } from '../services/api';
import '../styles/NewsPage.css';

const NewsPage = () => {
  const [news, setNews] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const [newsResponse, eventsResponse] = await Promise.all([
        websiteAPI.getContentByType('news', { limit: 10 }),
        websiteAPI.getContentByType('event', { limit: 10 })
      ]);

      if (newsResponse.success && newsResponse.data) {
        setNews(newsResponse.data);
      } else {
        setNews(config.news);
      }

      if (eventsResponse.success && eventsResponse.data) {
        setEvents(eventsResponse.data);
      } else {
        setEvents(config.events);
      }
    } catch (error) {
      console.error('Error fetching content:', error);
      setNews(config.news);
      setEvents(config.events);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return 'Recent';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="news-page">
      {/* Page Header */}
      <section className="page-header" style={{ backgroundColor: config.branding.colors.primary }}>
        <div className="container">
          <h1 className="page-title">News & Events</h1>
          <p className="page-subtitle">Stay Updated with Our Latest Activities</p>
        </div>
      </section>

      {/* Featured News */}
      {!loading && news.length > 0 && (
        <section className="featured-news">
          <div className="container">
            <div className="featured-card">
              <div className="featured-image">
                <img src={news[0].image} alt={news[0].title} />
                <div className="featured-badge" style={{ backgroundColor: config.branding.colors.accent }}>
                  Featured
                </div>
              </div>
              <div className="featured-content">
                <div className="news-meta">
                  <span className="news-date">{formatDate(news[0].date || news[0].createdAt)}</span>
                  <span className="news-category" style={{ color: config.branding.colors.primary }}>
                    {news[0].category || 'Latest News'}
                  </span>
                </div>
                <h2>{news[0].title}</h2>
                <p className="featured-excerpt">{news[0].description || news[0].excerpt}</p>
                <button 
                  className="read-more-btn"
                  style={{ backgroundColor: config.branding.colors.primary }}
                >
                  Read Full Story
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* All News */}
      <section className="all-news">
        <div className="container">
          <h2 className="section-title">Latest Updates</h2>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <p>Loading news...</p>
            </div>
          ) : (
            <div className="news-grid">
              {news.slice(1).map((item, index) => (
                <div key={item._id || index} className="news-card">
                  <div className="news-image">
                    <img src={item.image} alt={item.title} />
                    <div className="news-date-badge">{formatDate(item.date || item.createdAt)}</div>
                  </div>
                  <div className="news-content">
                    <h3>{item.title}</h3>
                    <p className="news-excerpt">{item.description || item.excerpt}</p>
                    <a 
                      href="#" 
                      className="news-link"
                      style={{ color: config.branding.colors.primary }}
                    >
                      Read More →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Events Section */}
      <section className="events-section" style={{ backgroundColor: '#f8f9fa' }}>
        <div className="container">
          <h2 className="section-title">Upcoming Events</h2>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <p>Loading events...</p>
            </div>
          ) : (
            <div className="events-list">
              {events.map((event, index) => {
                const eventDate = event.date ? new Date(event.date) : new Date();
                const day = !isNaN(eventDate.getDate()) ? eventDate.getDate() : '??';
                const month = !isNaN(eventDate.getDate()) 
                  ? eventDate.toLocaleDateString('en-US', { month: 'short' })
                  : 'TBA';
                
                return (
                  <div key={event._id || index} className="event-card">
                    <div className="event-date" style={{ backgroundColor: config.branding.colors.primary }}>
                      <div className="event-day">{day}</div>
                      <div className="event-month">{month}</div>
                    </div>
                    <div className="event-details">
                      <h3>{event.title}</h3>
                      <p className="event-description">{event.description || event.content}</p>
                      <div className="event-meta">
                        <span className="event-time">⏰ {event.time || 'TBA'}</span>
                        <span className="event-location">📍 {event.venue || 'School Campus'}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="newsletter-section" style={{ backgroundColor: config.branding.colors.secondary }}>
        <div className="container">
          <div className="newsletter-content">
            <h2>Stay Updated</h2>
            <p>Subscribe to our newsletter to receive the latest news and updates</p>
            <form className="newsletter-form">
              <input 
                type="email" 
                placeholder="Enter your email address" 
                required 
              />
              <button 
                type="submit"
                style={{ backgroundColor: config.branding.colors.primary }}
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Archive */}
      <section className="archive-section">
        <div className="container">
          <h2 className="section-title">Archive</h2>
          <div className="archive-grid">
            <div className="archive-card">
              <h3>2024</h3>
              <ul>
                <li><a href="#">January - March</a></li>
                <li><a href="#">April - June</a></li>
                <li><a href="#">July - September</a></li>
                <li><a href="#">October - December</a></li>
              </ul>
            </div>
            <div className="archive-card">
              <h3>2023</h3>
              <ul>
                <li><a href="#">January - March</a></li>
                <li><a href="#">April - June</a></li>
                <li><a href="#">July - September</a></li>
                <li><a href="#">October - December</a></li>
              </ul>
            </div>
            <div className="archive-card">
              <h3>2022</h3>
              <ul>
                <li><a href="#">January - March</a></li>
                <li><a href="#">April - June</a></li>
                <li><a href="#">July - September</a></li>
                <li><a href="#">October - December</a></li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NewsPage;
