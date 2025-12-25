import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

// Public API endpoints
export const websiteAPI = {
  // Get content by type
  getContentByType: async (type, params = {}) => {
    let endpoint;
    switch(type) {
      case 'gallery':
        endpoint = '/website/gallery/published';
        break;
      case 'news':
      case 'event':
        endpoint = '/website/news-events/published';
        params.type = type;
        break;
      case 'teacher':
        endpoint = '/website/faculty';
        break;
      case 'notice':
        endpoint = '/website/notices/active';
        break;
      case 'achievement':
        endpoint = '/website/achievements/published';
        break;
      case 'testimonial':
        endpoint = '/website/testimonials/published';
        break;
      default:
        endpoint = `/website/${type}/published`;
    }
    const response = await api.get(endpoint, { params });
    return response.data;
  },

  // Get single content item
  getContentById: async (id) => {
    const response = await api.get(`/website/content/item/${id}`);
    return response.data;
  },

  // Get director message
  getDirectorMessage: async () => {
    const response = await api.get('/website/director/message');
    return response.data;
  },

  // Submit contact form
  submitContactForm: async (formData) => {
    const response = await api.post('/website/contact/submit', formData);
    return response.data;
  },

  // Admin endpoints (requires authentication)
  admin: {
    getAllContent: async (params = {}) => {
      const response = await api.get('/website/admin/content', { params });
      return response.data;
    },

    createContent: async (data) => {
      const response = await api.post('/website/admin/content', data);
      return response.data;
    },

    updateContent: async (id, data) => {
      const response = await api.put(`/website/admin/content/${id}`, data);
      return response.data;
    },

    deleteContent: async (id) => {
      const response = await api.delete(`/website/admin/content/${id}`);
      return response.data;
    },

    getContactSubmissions: async (params = {}) => {
      const response = await api.get('/website/admin/contact-submissions', { params });
      return response.data;
    },

    updateContactStatus: async (id, status) => {
      const response = await api.put(`/website/admin/contact-submissions/${id}/status`, { status });
      return response.data;
    },

    getStatistics: async () => {
      const response = await api.get('/website/admin/statistics');
      return response.data;
    }
  }
};

export default api;
