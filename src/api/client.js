import axios from 'axios';

const BASE_URL = 'https://dummyjson.com';

// Shared Axios instance — all API calls go through this
export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// Attach auth token to every request if one exists
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle errors and expired sessions in one place
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Let canceled requests pass through quietly
    if (axios.isCancel(error)) {
      return Promise.reject({ isCanceled: true, message: 'Request canceled' });
    }

    const status = error.response?.status || null;
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'Something went wrong. Please try again.';

    // If the server says "unauthorized", clear the session and let the app know
    if (status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      window.dispatchEvent(new Event('auth:unauthorized'));
    }

    return Promise.reject({ status, message, originalError: error });
  }
);

export default apiClient;
