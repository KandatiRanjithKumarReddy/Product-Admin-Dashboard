import apiClient from './client';

export const authApi = {
  // Log in with username and password
  async login({ username, password }) {
    const response = await apiClient.post('/auth/login', {
      username: username.trim(),
      password: password.trim(),
      expiresInMins: 120,
    });
    return response.data;
  },

  // Check who the currently logged-in user is
  async getCurrentUser() {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },
};

export default authApi;
