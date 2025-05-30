import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false, // Disable sending cookies in cross-origin requests
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    // Note: Auth tokens won't be sent with credentials: false
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Handle token expiration (Note: This logic might not work without credentials)
    // const originalRequest = error.config;
    // if (error.response?.status === 401 && !originalRequest._retry) {
    //   originalRequest._retry = true;
    //   try {
    //     const refreshToken = localStorage.getItem('refreshToken');
    //     if (refreshToken) {
    //       const response = await axios.post('/api/auth/refresh', { refreshToken });
    //       const { token } = response.data;
    //       localStorage.setItem('token', token);
    //       originalRequest.headers.Authorization = `Bearer ${token}`;
    //       return api(originalRequest);
    //     }
    //   } catch (refreshError) {
    //     localStorage.removeItem('token');
    //     localStorage.removeItem('refreshToken');
    //     window.location.href = '/login';
    //   }
    // }

    // Handle CORS errors
    if (error.message === 'Network Error' && !error.response) {
      console.error('CORS Error: Unable to reach the server. Please check if the server is running and CORS is properly configured.');
    }

    return Promise.reject(error);
  }
);

export default api; 