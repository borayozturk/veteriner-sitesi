import { API_BASE_URL } from '../config/api';

// Helper function for API calls
const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    if (!response.ok) {
      const errorData = await response.text();
      console.error('API Error Response:', errorData);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Handle 204 No Content response (common for DELETE operations)
    if (response.status === 204 || response.headers.get('content-length') === '0') {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

// Veterinarians API
export const veterinariansAPI = {
  getAll: () => apiCall('/veterinarians/'),
  getById: (id) => apiCall(`/veterinarians/${id}/`),
  getActive: () => apiCall('/veterinarians/active/'),
  create: (vetData) =>
    apiCall('/veterinarians/', {
      method: 'POST',
      body: JSON.stringify(vetData),
    }),
  update: (id, vetData) =>
    apiCall(`/veterinarians/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(vetData),
    }),
  delete: (id) =>
    apiCall(`/veterinarians/${id}/`, {
      method: 'DELETE',
    }),
};

// Blog Posts API
export const blogAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/blog/${queryString ? `?${queryString}` : ''}`);
  },
  getById: (id) => apiCall(`/blog/${id}/`),
  getBySlug: (slug) => apiCall(`/blog/${slug}/`),
  getFeatured: () => apiCall('/blog/featured/'),
  getCategories: () => apiCall('/blog/categories/'),
  search: (query) => apiCall(`/blog/?search=${encodeURIComponent(query)}`),
  filterByCategory: (category) => apiCall(`/blog/?category=${encodeURIComponent(category)}`),
  filterByTag: (tag) => apiCall(`/blog/?tag=${encodeURIComponent(tag)}`),
  filterByAuthor: (authorId) => apiCall(`/blog/?author=${authorId}`),
  create: (postData) =>
    apiCall('/blog/', {
      method: 'POST',
      body: JSON.stringify(postData),
    }),
  update: (slug, postData) =>
    apiCall(`/blog/${slug}/`, {
      method: 'PUT',
      body: JSON.stringify(postData),
    }),
  delete: (slug) =>
    apiCall(`/blog/${slug}/`, {
      method: 'DELETE',
    }),
};

// Appointments API
export const appointmentsAPI = {
  create: (appointmentData) =>
    apiCall('/appointments/', {
      method: 'POST',
      body: JSON.stringify(appointmentData),
    }),
  getAvailableSlots: (date, veterinarianId) =>
    apiCall(`/appointments/available_slots/?date=${date}&veterinarian=${veterinarianId}`),
};

// Contact Messages API
export const contactAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/contact/${queryString ? `?${queryString}` : ''}`);
  },
  getById: (id) => apiCall(`/contact/${id}/`),
  create: (messageData) =>
    apiCall('/contact/', {
      method: 'POST',
      body: JSON.stringify(messageData),
    }),
  markRead: (id) =>
    apiCall(`/contact/${id}/mark_read/`, {
      method: 'PATCH',
    }),
  reply: (id, replyData) =>
    apiCall(`/contact/${id}/reply/`, {
      method: 'PATCH',
      body: JSON.stringify(replyData),
    }),
  delete: (id) =>
    apiCall(`/contact/${id}/`, {
      method: 'DELETE',
    }),
};

// Gallery API
export const galleryAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/gallery/${queryString ? `?${queryString}` : ''}`);
  },
  getById: (id) => apiCall(`/gallery/${id}/`),
  getCategories: () => apiCall('/gallery/categories/'),
  filterByCategory: (category) => apiCall(`/gallery/?category=${category}`),
  search: (query) => apiCall(`/gallery/?search=${encodeURIComponent(query)}`),
  create: (imageData) =>
    apiCall('/gallery/', {
      method: 'POST',
      body: JSON.stringify(imageData),
    }),
  update: (id, imageData) =>
    apiCall(`/gallery/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(imageData),
    }),
  delete: (id) =>
    apiCall(`/gallery/${id}/`, {
      method: 'DELETE',
    }),
};

// Page Content API
export const pageAPI = {
  getAll: () => apiCall('/pages/'),
  getByName: (pageName) => apiCall(`/pages/${pageName}/`),
};

// About Page API
export const aboutPageAPI = {
  get: () => apiCall('/about-page/'),
  update: (data) =>
    apiCall('/about-page/1/', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};

// Contact Page API
export const contactPageAPI = {
  get: () => apiCall('/contact-page/'),
  update: (data) =>
    apiCall('/contact-page/1/', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};

// Services API
export const servicesAPI = {
  getAll: () => apiCall('/services/'),
  getById: (id) => apiCall(`/services/${id}/`),
  create: (serviceData) =>
    apiCall('/services/', {
      method: 'POST',
      body: JSON.stringify(serviceData),
    }),
  update: (id, serviceData) =>
    apiCall(`/services/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(serviceData),
    }),
  delete: (id) =>
    apiCall(`/services/${id}/`, {
      method: 'DELETE',
    }),
};

export default {
  vets: veterinariansAPI,
  veterinarians: veterinariansAPI,
  blog: blogAPI,
  appointments: appointmentsAPI,
  contact: contactAPI,
  gallery: galleryAPI,
  pages: pageAPI,
  aboutPage: aboutPageAPI,
  contactPage: contactPageAPI,
  services: servicesAPI,
};
