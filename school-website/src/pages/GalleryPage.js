import React, { useState, useEffect } from 'react';
import config from '../config';
import { websiteAPI } from '../services/api';
import '../styles/GalleryPage.css';

const GalleryPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedImage, setSelectedImage] = useState(null);
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      const response = await websiteAPI.getContentByType('gallery', { limit: 50 });
      console.log('Gallery API Response:', response);
      if (response.success && response.data) {
        // Flatten the gallery items - each gallery item has multiple images
        const flattenedImages = response.data.flatMap(gallery => 
          gallery.images.map(img => ({
            _id: img._id,
            title: gallery.title,
            description: img.caption || gallery.description,
            image: img.url,
            url: img.url,
            category: gallery.category
          }))
        );
        setGalleryItems(flattenedImages);
      } else {
        // Fallback to config data
        const configGallery = config.gallery.flatMap(cat => 
          cat.images.map(img => ({ ...img, category: cat.category.toLowerCase() }))
        );
        setGalleryItems(configGallery);
      }
    } catch (error) {
      console.error('Error fetching gallery:', error);
      const configGallery = config.gallery.flatMap(cat => 
        cat.images.map(img => ({ ...img, category: cat.category.toLowerCase() }))
      );
      setGalleryItems(configGallery);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'campus', label: 'Campus' },
    { id: 'events', label: 'Events' },
    { id: 'sports', label: 'Sports' },
    { id: 'academic', label: 'Academic' },
    { id: 'cultural', label: 'Cultural' }
  ];

  const filteredImages = selectedCategory === 'all' 
    ? galleryItems 
    : galleryItems.filter(img => img.category?.toLowerCase() === selectedCategory);

  return (
    <div className="gallery-page">
      {/* Page Header */}
      <section className="page-header" style={{ backgroundColor: config.branding.colors.primary }}>
        <div className="container">
          <h1 className="page-title">Gallery</h1>
          <p className="page-subtitle">Moments That Matter</p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="filter-section">
        <div className="container">
          <div className="filter-buttons">
            {categories.map(cat => (
              <button
                key={cat.id}
                className={`filter-btn ${selectedCategory === cat.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat.id)}
                style={{
                  backgroundColor: selectedCategory === cat.id ? config.branding.colors.primary : 'transparent',
                  color: selectedCategory === cat.id ? '#fff' : config.branding.colors.primary
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="gallery-grid-section">
        <div className="container">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <p style={{ fontSize: '1.2rem', color: config.branding.colors.primary }}>Loading gallery...</p>
            </div>
          ) : filteredImages.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <p style={{ fontSize: '1.2rem', color: '#666' }}>No images found in this category.</p>
            </div>
          ) : (
            <div className="gallery-grid">
              {filteredImages.map((image, index) => {
                const categoryIcons = {
                  'campus': '🏫',
                  'events': '🎉',
                  'sports': '⚽',
                  'cultural': '🎭',
                  'academic': '📚'
                };
                const icon = categoryIcons[image.category] || '📸';
                
                return (
                  <div 
                    key={image._id || index} 
                    className="gallery-item"
                    onClick={() => setSelectedImage(image)}
                  >
                  <div className="gallery-image">
                    <img src={image.image || image.url} alt={image.title} />
                    <div className="gallery-overlay">
                        <h3>{image.title}</h3>
                        <p>{image.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div className="lightbox" onClick={() => setSelectedImage(null)}>
          <div className="lightbox-content" onClick={e => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setSelectedImage(null)}>×</button>
            <img src={selectedImage.image || selectedImage.url} alt={selectedImage.title} />
            <div className="lightbox-info">
              <h3>{selectedImage.title}</h3>
              <p>{selectedImage.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryPage;
