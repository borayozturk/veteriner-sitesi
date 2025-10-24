// API Configuration
export const API_URL = import.meta.env.VITE_API_URL || '${import.meta.env.VITE_API_URL}';
export const API_BASE_URL = `${API_URL}/api`;

export default {
  API_URL,
  API_BASE_URL,
};
