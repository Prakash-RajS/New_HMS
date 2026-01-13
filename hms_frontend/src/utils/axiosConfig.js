// hms_frontend/src/utils/axiosConfig.js
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

// Create axios instance
const api = axios.create({
  baseURL: API_BASE,
  timeout: 30000, // Increased timeout for production
  headers: {
    'Content-Type': 'application/json',
  },
});

// Flag to prevent multiple refresh requests
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add timestamp to prevent caching
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        _t: Date.now()
      };
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 and we haven't tried refreshing yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      
      if (isRefreshing) {
        // If already refreshing, add to queue
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }
      
      originalRequest._retry = true;
      isRefreshing = true;
      
      try {
        // Try to refresh the token
        console.log('Token expired, attempting refresh...');
        
        const refreshResponse = await axios.post(
          `${API_BASE}/auth/refresh`,
          {},
          {
            headers: {
              'Content-Type': 'application/json',
            },
            withCredentials: true // Important for cookies
          }
        );
        
        const { access_token } = refreshResponse.data;
        
        if (access_token) {
          // Update stored token
          localStorage.setItem('token', access_token);
          
          // Update the failed request with new token
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          
          // Process queued requests
          processQueue(null, access_token);
          
          // Retry the original request
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        
        // Clear all auth data
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
        localStorage.removeItem('user_id');
        localStorage.removeItem('role');
        localStorage.removeItem('permissions');
        localStorage.removeItem('allowedModules');
        localStorage.removeItem('rememberedUsername');
        
        // Process queue with error
        processQueue(refreshError, null);
        
        // Redirect to login
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    
    // For other errors
    return Promise.reject(error);
  }
);

// Token auto-refresh function (call this periodically)
export const startTokenRefresh = () => {
  const refreshInterval = setInterval(async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    
    try {
      // Decode token to check expiry
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiryTime = payload.exp * 1000;
      const currentTime = Date.now();
      const timeUntilExpiry = expiryTime - currentTime;
      
      // If token expires in less than 10 minutes, refresh it
      if (timeUntilExpiry < 10 * 60 * 1000) {
        console.log('Auto-refreshing token before expiry...');
        
        const response = await axios.post(
          `${API_BASE}/auth/refresh`,
          {},
          { withCredentials: true }
        );
        
        if (response.data.access_token) {
          localStorage.setItem('token', response.data.access_token);
          console.log('Token auto-refreshed successfully');
        }
      }
    } catch (error) {
      console.error('Auto-refresh failed:', error);
    }
  }, 5 * 60 * 1000); // Check every 5 minutes
  
  return refreshInterval;
};

export default api;