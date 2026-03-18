

// // hms_frontend/src/utils/axiosConfig.js
// import axios from 'axios';

// // ==========================================================
// // CONFIGURATION
// // ==========================================================
// const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
// const isDevelopment = import.meta.env.DEV;

// console.log('API Base URL:', API_BASE);

// // ==========================================================
// // API INSTANCES
// // ==========================================================

// // MAIN API INSTANCE
// const api = axios.create({
//   baseURL: API_BASE,
//   timeout: 30000,
//   withCredentials: true,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // MEDIA API INSTANCE
// export const mediaApi = axios.create({
//   baseURL: API_BASE,
//   timeout: 60000,
//   withCredentials: true,
// });

// // PUBLIC API INSTANCE
// export const publicApi = axios.create({
//   baseURL: API_BASE,
//   timeout: 30000,
//   withCredentials: true,
// });

// // ==========================================================
// // GLOBAL STATE
// // ==========================================================

// // Flag to prevent multiple refresh requests
// let isRefreshing = false;
// let failedQueue = [];

// // Inactivity timer
// let inactivityTimer;
// let activityHandler;

// const processQueue = (error) => {
//   failedQueue.forEach(({ resolve, reject }) => {
//     if (error) {
//       reject(error);
//     } else {
//       resolve();
//     }
//   });
//   failedQueue = [];
// };

// // ==========================================================
// // HELPER FUNCTIONS
// // ==========================================================

// export const getMediaUrl = (relativePath) => {
//   if (!relativePath || relativePath === 'null' || relativePath === 'undefined') {
//     return null;
//   }
  
//   if (isDevelopment) {
//     console.log('getMediaUrl input:', relativePath);
//   }
  
//   if (
//     relativePath.startsWith('http://') || 
//     relativePath.startsWith('https://') || 
//     relativePath.startsWith('data:') ||
//     relativePath.startsWith('blob:')
//   ) {
//     return relativePath;
//   }
  
//   let cleanPath = relativePath;
//   if (cleanPath.startsWith('/')) {
//     cleanPath = cleanPath.substring(1);
//   }
  
//   if (cleanPath.startsWith('media/')) {
//     return `${API_BASE}/${cleanPath}`;
//   }
  
//   return `${API_BASE}/media/${cleanPath}`;
// };

// /**
//  * Check if a URL is accessible (HEAD request)
//  * @param {string} url - URL to check
//  * @returns {Promise<boolean>} True if accessible
//  */
// export const checkUrlAccessible = async (url) => {
//   if (!url) return false;
  
//   try {
//     const response = await fetch(url, { 
//       method: 'HEAD',
//       mode: 'cors',
//       cache: 'no-cache'
//     });
//     return response.ok;
//   } catch (error) {
//     if (isDevelopment) {
//       console.warn('URL not accessible:', url, error);
//     }
//     return false;
//   }
// };

// /**
//  * Preload an image to ensure it's cached and accessible
//  * @param {string} url - Image URL
//  * @returns {Promise<boolean>} True if image loads successfully
//  */
// export const preloadImage = (url) => {
//   return new Promise((resolve) => {
//     if (!url) {
//       resolve(false);
//       return;
//     }
    
//     const img = new Image();
//     img.onload = () => {
//       if (isDevelopment) {
//         console.log('Image loaded successfully:', url);
//       }
//       resolve(true);
//     };
//     img.onerror = () => {
//       if (isDevelopment) {
//         console.error('Failed to load image:', url);
//       }
//       resolve(false);
//     };
//     img.src = url;
//   });
// };

// // ==========================================================
// // FILE UPLOAD UTILITIES
// // ==========================================================

// /**
//  * Upload a file with progress tracking
//  * @param {string} url - Upload endpoint
//  * @param {File} file - File to upload
//  * @param {Function} onProgress - Progress callback
//  * @param {Object} additionalData - Additional form data
//  * @returns {Promise} Axios response
//  */
// export const uploadFile = async (url, file, onProgress = null, additionalData = {}) => {
//   const formData = new FormData();
//   formData.append('file', file);
  
//   // Add additional data to formData
//   Object.entries(additionalData).forEach(([key, value]) => {
//     if (value !== undefined && value !== null) {
//       formData.append(key, value);
//     }
//   });
  
//   const config = {
//     headers: {
//       'Content-Type': 'multipart/form-data',
//     },
//     onUploadProgress: onProgress ? (progressEvent) => {
//       const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
//       onProgress(percentCompleted);
//     } : undefined,
//   };
  
//   return mediaApi.post(url, formData, config);
// };

// /**
//  * Download a file
//  * @param {string} url - File URL
//  * @param {string} filename - Desired filename
//  */
// export const downloadFile = async (url, filename = 'download') => {
//   try {
//     const response = await mediaApi.get(url, {
//       responseType: 'blob',
//     });
    
//     // Create download link
//     const blob = new Blob([response.data]);
//     const downloadUrl = window.URL.createObjectURL(blob);
//     const link = document.createElement('a');
//     link.href = downloadUrl;
//     link.download = filename;
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
    
//     // Clean up
//     window.URL.revokeObjectURL(downloadUrl);
//   } catch (error) {
//     if (isDevelopment) {
//       console.error('Error downloading file:', error);
//     }
//     throw error;
//   }
// };

// // ==========================================================
// // REQUEST INTERCEPTORS
// // ==========================================================

// const addAuthHeader = (config) => {
//   if (isDevelopment) {
//     console.log(`🌐 ${config.method?.toUpperCase()} ${config.url}`);
//   }
  
//   // Add cache busting for GET requests
//   if (config.method === 'get') {
//     config.params = {
//       ...config.params,
//       _t: Date.now()
//     };
//   }
  
//   return config;
// };

// const handleRequestError = (error) => {
//   if (isDevelopment) {
//     console.error('❌ Request error:', error);
//   }
//   return Promise.reject(error);
// };

// api.interceptors.request.use(addAuthHeader, handleRequestError);
// mediaApi.interceptors.request.use(addAuthHeader, handleRequestError);

// // ==========================================================
// // RESPONSE INTERCEPTORS - FIXED (Issue #1)
// // ==========================================================

// const createResponseInterceptor = (axiosInstance) => {
//   axiosInstance.interceptors.response.use(
//     (response) => {
//       if (isDevelopment) {
//         console.log(`✅ ${response.status} ${response.config.url}`);
//       }
//       return response;
//     },
//     async (error) => {
//       const originalRequest = error.config;
      
//       if (isDevelopment) {
//         console.error(`❌ ${error.response?.status || 'Network'} Error:`, {
//           url: originalRequest.url,
//           status: error.response?.status,
//           data: error.response?.data,
//         });
//       }
      
//       // Special handling for login endpoint
//       if (originalRequest.url?.includes('/auth/login')) {
//         const errorData = error.response?.data;
//         if (error.response?.status === 401) {
//           const errorMessage = errorData?.detail || "Invalid username or password";
//           error.response.data = { ...errorData, detail: errorMessage };
//         } else if (error.response?.status === 404) {
//           const errorMessage = errorData?.detail || "Username not found";
//           error.response.data = { ...errorData, detail: errorMessage };
//         }
//         return Promise.reject(error);
//       }
      
//       // If error is 401 and we haven't tried refreshing yet
//       if (error.response?.status === 401 && !originalRequest._retry) {
        
//         if (isRefreshing) {
//           return new Promise((resolve, reject) => {
//             failedQueue.push({ resolve, reject });
//           })
//             .then(() => {
//               return axiosInstance(originalRequest);
//             })
//             .catch((err) => {
//               return Promise.reject(err);
//             });
//         }
        
//         originalRequest._retry = true;
//         isRefreshing = true;
        
//         try {
//           if (isDevelopment) {
//             console.log('🔑 Access token expired, attempting refresh...');
//           }
          
//           // Refresh the access token
//           await publicApi.post('/auth/refresh', {}, {
//             withCredentials: true
//           });
          
//           if (isDevelopment) {
//             console.log('✅ Token refreshed successfully');
//           }
          
//           // Process queued requests
//           processQueue(null);
          
//           // Retry the original request
//           return axiosInstance(originalRequest);
          
//         } catch (refreshError) {
//           if (isDevelopment) {
//             console.error('❌ Token refresh failed:', refreshError);
//           }
          
//           // ONLY HERE WE LOGOUT - refresh failed
//           clearAuthData();
//           processQueue(refreshError);
          
//           // Redirect to login if not already there
//           if (!isLoginPage()) {
//             redirectToLogin();
//           }
          
//           return Promise.reject(refreshError);
//         } finally {
//           isRefreshing = false;
//         }
//       }
      
//       // REMOVED THE DANGEROUS 401 LOGOUT BLOCK - Issue #1 Fixed
      
//       return Promise.reject(error);
//     }
//   );
// };

// createResponseInterceptor(api);
// createResponseInterceptor(mediaApi);

// // ==========================================================
// // AUTH UTILITIES
// // ==========================================================

// export const clearAuthData = () => {
//   const itemsToRemove = [
//     'userData',
//     'user_id',
//     'role',
//     'permissions',
//     'allowedModules',
//   ];
  
//   itemsToRemove.forEach(item => localStorage.removeItem(item));
//   sessionStorage.clear();
  
//   if (isDevelopment) {
//     console.log('User data cleared');
//   }
// };

// export const isLoginPage = () => {
//   const currentPath = window.location.pathname;
//   return currentPath === '/' || currentPath === '/login';
// };

// export const redirectToLogin = () => {
//   if (!isLoginPage()) {
//     if (isDevelopment) {
//       console.log('Redirecting to login...');
//     }
//     window.location.href = '/';
//   }
// };

// // Fixed authentication check - Issue #4
// export const isAuthenticated = () => {
//   return localStorage.getItem('auth_initialized') === 'true';
// };

// export const setAuthenticated = (status) => {
//   if (status) {
//     localStorage.setItem('auth_initialized', 'true');
//   } else {
//     localStorage.removeItem('auth_initialized');
//     clearAuthData();
//   }
// };

// export const getCurrentUser = () => {
//   try {
//     const userData = localStorage.getItem('userData');
//     return userData ? JSON.parse(userData) : null;
//   } catch (error) {
//     if (isDevelopment) {
//       console.error('Error parsing user data:', error);
//     }
//     return null;
//   }
// };

// // ==========================================================
// // SESSION MANAGEMENT - FIXED (Issue #2)
// // ==========================================================

// export const startSessionMonitor = () => {
//   if (isDevelopment) {
//     console.log('🔄 Starting session monitor...');
//   }
  
//   const monitorInterval = setInterval(async () => {
//     try {
//       if (isLoginPage()) {
//         return;
//       }
      
//       // Check session health
//       await api.get("/auth/health");
      
//     } catch (error) {
//       if (error.response?.status === 401) {
//         if (isDevelopment) {
//           console.log('Session health check failed, attempting refresh...');
//         }
        
//         try {
//           // Session monitor MUST attempt refresh before logging out - Issue #2 Fixed
//           await publicApi.post("/auth/refresh", {}, { withCredentials: true });
          
//           if (isDevelopment) {
//             console.log('✅ Session monitor refreshed token');
//           }
//         } catch (refreshError) {
//           if (isDevelopment) {
//             console.log('Session monitor refresh failed, logging out...');
//           }
          
//           setAuthenticated(false);
          
//           if (!isLoginPage()) {
//             redirectToLogin();
//           }
//         }
//       }
//     }
//   }, 2 * 60 * 1000); // Check every 2 minutes

//   return monitorInterval;
// };

// export const stopSessionMonitor = (intervalId) => {
//   if (intervalId) {
//     clearInterval(intervalId);
//     if (isDevelopment) {
//       console.log('Session monitor stopped');
//     }
//   }
// };

// // ==========================================================
// // INACTIVITY TIMER - FIXED (Issue #3)
// // ==========================================================

// export const startInactivityTimer = (timeoutMinutes = 5) => {
//   if (isDevelopment) {
//     console.log(`⏰ Starting inactivity timer (${timeoutMinutes} minutes)`);
//   }
  
//   resetInactivityTimer(timeoutMinutes);
  
//   // Define handler once for proper removal - Issue #3 Fixed
//   activityHandler = () => resetInactivityTimer(timeoutMinutes);
  
//   const events = ['mousedown', 'keydown', 'touchstart', 'scroll', 'click'];
  
//   events.forEach(event => {
//     document.addEventListener(event, activityHandler, true);
//   });
  
//   return () => {
//     if (inactivityTimer) {
//       clearTimeout(inactivityTimer);
//     }
    
//     if (activityHandler) {
//       events.forEach(event => {
//         document.removeEventListener(event, activityHandler, true);
//       });
//     }
//   };
// };

// const resetInactivityTimer = (timeoutMinutes) => {
//   if (inactivityTimer) {
//     clearTimeout(inactivityTimer);
//   }
  
//   inactivityTimer = setTimeout(() => {
//     if (isDevelopment) {
//       console.log('User inactive, logging out...');
//     }
    
//     // Call logout endpoint
//     api.post('/auth/logout', {}, { withCredentials: true })
//       .catch(() => {})
//       .finally(() => {
//         setAuthenticated(false);
        
//         if (!isLoginPage()) {
//           redirectToLogin();
//         }
//       });
      
//   }, timeoutMinutes * 60 * 1000);
// };

// // ==========================================================
// // AUTH INITIALIZATION - FIXED (Issue #4)
// // ==========================================================

// /**
//  * Initialize authentication on app start
//  * Verifies if user has valid cookies
//  */
// export const initializeAuth = async () => {
//   try {
//     // Try to refresh token to check if cookies are valid
//     await publicApi.post('/auth/refresh', {}, { withCredentials: true });
    
//     // If successful, user is authenticated
//     setAuthenticated(true);
    
//     if (isDevelopment) {
//       console.log('✅ User authenticated from cookies');
//     }
    
//     return true;
//   } catch (error) {
//     // Not authenticated or cookies expired
//     setAuthenticated(false);
    
//     if (isDevelopment) {
//       console.log('User not authenticated from cookies');
//     }
    
//     return false;
//   }
// };

// // ==========================================================
// // LOGIN/LOGOUT FUNCTIONS
// // ==========================================================

// export const login = async (username, password) => {
//   try {
//     const response = await publicApi.post('/auth/login', {
//       username,
//       password
//     }, {
//       withCredentials: true
//     });
    
//     if (response.data.user) {
//       localStorage.setItem('userData', JSON.stringify(response.data.user));
//     }
    
//     setAuthenticated(true);
    
//     return response.data;
//   } catch (error) {
//     setAuthenticated(false);
//     throw error;
//   }
// };

// export const logout = async () => {
//   try {
//     await api.post('/auth/logout', {}, { withCredentials: true });
//   } catch (error) {
//     if (isDevelopment) {
//       console.error('Logout error:', error);
//     }
//   } finally {
//     setAuthenticated(false);
//     clearAuthData();
//     redirectToLogin();
//   }
// };

// // ==========================================================
// // API HEALTH CHECK
// // ==========================================================

// /**
//  * Check if API is accessible
//  * @returns {Promise<boolean>} True if API is accessible
//  */
// export const checkApiHealth = async () => {
//   try {
//     const response = await publicApi.get('/health', { timeout: 5000 });
//     return response.status === 200;
//   } catch (error) {
//     if (isDevelopment) {
//       console.warn('API health check failed:', error.message);
//     }
//     return false;
//   }
// };

// /**
//  * Check if media server is accessible
//  * @returns {Promise<boolean>} True if media is accessible
//  */
// export const checkMediaAccessible = async () => {
//   try {
//     const testUrl = `${API_BASE}/media/test.txt`;
//     const response = await fetch(testUrl, { method: 'HEAD', mode: 'cors' });
//     return response.ok;
//   } catch (error) {
//     if (isDevelopment) {
//       console.warn('Media server check failed:', error.message);
//     }
//     return false;
//   }
// };

// // ==========================================================
// // TOKEN AUTO-REFRESH (Legacy - not needed with cookies)
// // ==========================================================

// /**
//  * @deprecated Not needed with HTTP-only cookies
//  */
// export const startTokenRefresh = () => {
//   if (isDevelopment) {
//     console.log('🔄 Token auto-refresh not needed with cookies');
//   }
//   return null;
// };

// /**
//  * @deprecated Not needed with HTTP-only cookies
//  */
// export const stopTokenRefresh = (intervalId) => {
//   // No-op
// };

// // ==========================================================
// // MULTI-TAB LOGOUT SYNC
// // ==========================================================
// if (typeof window !== 'undefined') {
//   window.addEventListener("storage", (event) => {
//     if (event.key === "auth_initialized" && !event.newValue) {
//       if (!isLoginPage()) {
//         redirectToLogin();
//       }
//     }
//   });
// }

// // ==========================================================
// // DEFAULT EXPORT
// // ==========================================================

// export default api;

// hms_frontend/src/utils/axiosConfig.js
import axios from 'axios';

// ==========================================================
// CONFIGURATION
// ==========================================================
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const isDevelopment = import.meta.env.DEV;

console.log('API Base URL:', API_BASE);

// ==========================================================
// API INSTANCES
// ==========================================================

// MAIN API INSTANCE
const api = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// MEDIA API INSTANCE
export const mediaApi = axios.create({
  baseURL: API_BASE,
  timeout: 60000,
  withCredentials: true,
});

// PUBLIC API INSTANCE
export const publicApi = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
  withCredentials: true,
});

// ==========================================================
// GLOBAL STATE
// ==========================================================

// Flag to prevent multiple refresh requests
let isRefreshing = false;
let failedQueue = [];

// Inactivity timer
let inactivityTimer;
let activityHandler;

const processQueue = (error) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve();
    }
  });
  failedQueue = [];
};

// ==========================================================
// HELPER FUNCTIONS
// ==========================================================

export const getMediaUrl = (relativePath) => {
  if (!relativePath || relativePath === 'null' || relativePath === 'undefined') {
    return null;
  }
  
  if (isDevelopment) {
    console.log('getMediaUrl input:', relativePath);
  }
  
  if (
    relativePath.startsWith('http://') || 
    relativePath.startsWith('https://') || 
    relativePath.startsWith('data:') ||
    relativePath.startsWith('blob:')
  ) {
    return relativePath;
  }
  
  let cleanPath = relativePath;
  if (cleanPath.startsWith('/')) {
    cleanPath = cleanPath.substring(1);
  }
  
  if (cleanPath.startsWith('media/')) {
    return `${API_BASE}/${cleanPath}`;
  }
  
  return `${API_BASE}/media/${cleanPath}`;
};

/**
 * Check if a URL is accessible (HEAD request)
 * @param {string} url - URL to check
 * @returns {Promise<boolean>} True if accessible
 */
export const checkUrlAccessible = async (url) => {
  if (!url) return false;
  
  try {
    const response = await fetch(url, { 
      method: 'HEAD',
      mode: 'cors',
      cache: 'no-cache'
    });
    return response.ok;
  } catch (error) {
    if (isDevelopment) {
      console.warn('URL not accessible:', url, error);
    }
    return false;
  }
};

/**
 * Preload an image to ensure it's cached and accessible
 * @param {string} url - Image URL
 * @returns {Promise<boolean>} True if image loads successfully
 */
export const preloadImage = (url) => {
  return new Promise((resolve) => {
    if (!url) {
      resolve(false);
      return;
    }
    
    const img = new Image();
    img.onload = () => {
      if (isDevelopment) {
        console.log('Image loaded successfully:', url);
      }
      resolve(true);
    };
    img.onerror = () => {
      if (isDevelopment) {
        console.error('Failed to load image:', url);
      }
      resolve(false);
    };
    img.src = url;
  });
};

// ==========================================================
// FILE UPLOAD UTILITIES
// ==========================================================

/**
 * Upload a file with progress tracking
 * @param {string} url - Upload endpoint
 * @param {File} file - File to upload
 * @param {Function} onProgress - Progress callback
 * @param {Object} additionalData - Additional form data
 * @returns {Promise} Axios response
 */
export const uploadFile = async (url, file, onProgress = null, additionalData = {}) => {
  const formData = new FormData();
  formData.append('file', file);
  
  // Add additional data to formData
  Object.entries(additionalData).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value);
    }
  });
  
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: onProgress ? (progressEvent) => {
      const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      onProgress(percentCompleted);
    } : undefined,
  };
  
  return mediaApi.post(url, formData, config);
};

/**
 * Download a file
 * @param {string} url - File URL
 * @param {string} filename - Desired filename
 */
export const downloadFile = async (url, filename = 'download') => {
  try {
    const response = await mediaApi.get(url, {
      responseType: 'blob',
    });
    
    // Create download link
    const blob = new Blob([response.data]);
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up
    window.URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    if (isDevelopment) {
      console.error('Error downloading file:', error);
    }
    throw error;
  }
};

// ==========================================================
// REQUEST INTERCEPTORS
// ==========================================================

const addAuthHeader = (config) => {
  if (isDevelopment) {
    console.log(`🌐 ${config.method?.toUpperCase()} ${config.url}`);
  }
  
  // Add cache busting for GET requests
  if (config.method === 'get') {
    config.params = {
      ...config.params,
      _t: Date.now()
    };
  }
  
  return config;
};

const handleRequestError = (error) => {
  if (isDevelopment) {
    console.error('❌ Request error:', error);
  }
  return Promise.reject(error);
};

api.interceptors.request.use(addAuthHeader, handleRequestError);
mediaApi.interceptors.request.use(addAuthHeader, handleRequestError);

// ==========================================================
// RESPONSE INTERCEPTORS - FIXED (Issue #1)
// ==========================================================

const createResponseInterceptor = (axiosInstance) => {
  axiosInstance.interceptors.response.use(
    (response) => {
      if (isDevelopment) {
        console.log(`✅ ${response.status} ${response.config.url}`);
      }
      return response;
    },
    async (error) => {
      const originalRequest = error.config;
      
      if (isDevelopment) {
        console.error(`❌ ${error.response?.status || 'Network'} Error:`, {
          url: originalRequest.url,
          status: error.response?.status,
          data: error.response?.data,
        });
      }
      
      // Special handling for login endpoint
      if (originalRequest.url?.includes('/auth/login')) {
        const errorData = error.response?.data;
        if (error.response?.status === 401) {
          const errorMessage = errorData?.detail || "Invalid username or password";
          error.response.data = { ...errorData, detail: errorMessage };
        } else if (error.response?.status === 404) {
          const errorMessage = errorData?.detail || "Username not found";
          error.response.data = { ...errorData, detail: errorMessage };
        }
        return Promise.reject(error);
      }
      
      // If error is 401 and we haven't tried refreshing yet
      if (
  error.response?.status === 401 &&
  !originalRequest._retry &&
  !originalRequest.url?.includes('/auth/refresh') &&
  !originalRequest.url?.includes('/auth/login')
) {

  if (isRefreshing) {
    return new Promise((resolve, reject) => {
      failedQueue.push({ resolve, reject });
    })
      .then(() => axiosInstance(originalRequest))
      .catch((err) => Promise.reject(err));
  }

  originalRequest._retry = true;
  isRefreshing = true;

  try {
    console.log('🔑 Access token expired, attempting refresh...');

    await publicApi.post('/auth/refresh', {}, { withCredentials: true });

    console.log('✅ Token refreshed successfully');

    processQueue(null);

    return axiosInstance(originalRequest);

  } catch (refreshError) {

    console.error('❌ Token refresh failed:', refreshError);

    clearAuthData();
    processQueue(refreshError);

    if (!isLoginPage()) {
      redirectToLogin();
    }

    return Promise.reject(refreshError);

  } finally {
    isRefreshing = false;
  }
}
      
      // REMOVED THE DANGEROUS 401 LOGOUT BLOCK - Issue #1 Fixed
      
      return Promise.reject(error);
    }
  );
};

createResponseInterceptor(api);
createResponseInterceptor(mediaApi);

// ==========================================================
// AUTH UTILITIES
// ==========================================================

export const clearAuthData = () => {
  const itemsToRemove = [
    'userData',
    'user_id',
    'role',
    'permissions',
    'allowedModules',
  ];
  
  itemsToRemove.forEach(item => localStorage.removeItem(item));
  sessionStorage.clear();
  
  if (isDevelopment) {
    console.log('User data cleared');
  }
};

export const isLoginPage = () => {
  const currentPath = window.location.pathname;
  return currentPath === '/' || currentPath === '/login';
};

export const redirectToLogin = () => {
  if (!isLoginPage()) {
    if (isDevelopment) {
      console.log('Redirecting to login...');
    }
    window.location.href = '/';
  }
};

// Fixed authentication check - Issue #4
export const isAuthenticated = () => {
  return localStorage.getItem('auth_initialized') === 'true';
};

export const setAuthenticated = (status) => {
  if (status) {
    localStorage.setItem('auth_initialized', 'true');
  } else {
    localStorage.removeItem('auth_initialized');
    clearAuthData();
  }
};

export const getCurrentUser = () => {
  try {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    if (isDevelopment) {
      console.error('Error parsing user data:', error);
    }
    return null;
  }
};

// ==========================================================
// SESSION MANAGEMENT - FIXED (Issue #2)
// ==========================================================

export const startSessionMonitor = () => {
  if (isDevelopment) {
    console.log('🔄 Starting session monitor...');
  }
  
  const monitorInterval = setInterval(async () => {
    try {
      if (isLoginPage()) {
        return;
      }
      
      // Check session health
      await api.get("/auth/health");
      
    } catch (error) {
      if (error.response?.status === 401) {
        if (isDevelopment) {
          console.log('Session health check failed, attempting refresh...');
        }
        
        try {
          // Session monitor MUST attempt refresh before logging out - Issue #2 Fixed
          await publicApi.post("/auth/refresh", {}, { withCredentials: true });
          
          if (isDevelopment) {
            console.log('✅ Session monitor refreshed token');
          }
        } catch (refreshError) {
          if (isDevelopment) {
            console.log('Session monitor refresh failed, logging out...');
          }
          
          setAuthenticated(false);
          
          if (!isLoginPage()) {
            redirectToLogin();
          }
        }
      }
    }
  }, 2 * 60 * 1000); // Check every 2 minutes

  return monitorInterval;
};

export const stopSessionMonitor = (intervalId) => {
  if (intervalId) {
    clearInterval(intervalId);
    if (isDevelopment) {
      console.log('Session monitor stopped');
    }
  }
};

// ==========================================================
// INACTIVITY TIMER - UPDATED FOR 5 MINUTES AUTO LOGOUT
// ==========================================================

export const startInactivityTimer = (timeoutMinutes = 10) => { // Changed from 15 to 5
  if (isDevelopment) {
    console.log(`⏰ Starting inactivity timer (${timeoutMinutes} minutes)`);
  }
  
  resetInactivityTimer(timeoutMinutes);
  
  // Define handler once for proper removal - Issue #3 Fixed
  activityHandler = () => resetInactivityTimer(timeoutMinutes);
  
  const events = ['mousedown', 'keydown', 'touchstart', 'scroll', 'click'];
  
  events.forEach(event => {
    document.addEventListener(event, activityHandler, true);
  });
  
  return () => {
    if (inactivityTimer) {
      clearTimeout(inactivityTimer);
    }
    
    if (activityHandler) {
      events.forEach(event => {
        document.removeEventListener(event, activityHandler, true);
      });
    }
  };
};

const resetInactivityTimer = (timeoutMinutes) => {
  if (inactivityTimer) {
    clearTimeout(inactivityTimer);
  }
  
  inactivityTimer = setTimeout(() => {
    if (isDevelopment) {
      console.log('User inactive, logging out...');
    }
    
    // Call logout endpoint - UPDATED to use logout() function directly
    logout(); // Using the logout function instead of manual API call
      
  }, timeoutMinutes * 60 * 1000);
};

// ==========================================================
// AUTH INITIALIZATION - FIXED (Issue #4)
// ==========================================================

/**
 * Initialize authentication on app start
 * Verifies if user has valid cookies
 */
export const initializeAuth = async () => {
  try {
    // Try to refresh token to check if cookies are valid
    await publicApi.post('/auth/refresh', {}, { withCredentials: true });
    
    // If successful, user is authenticated
    setAuthenticated(true);
    
    if (isDevelopment) {
      console.log('✅ User authenticated from cookies');
    }
    
    return true;
  } catch (error) {
    // Not authenticated or cookies expired
    setAuthenticated(false);
    
    if (isDevelopment) {
      console.log('User not authenticated from cookies');
    }
    
    return false;
  }
};

// ==========================================================
// LOGIN/LOGOUT FUNCTIONS
// ==========================================================

export const login = async (username, password) => {

  const formData = new FormData();
  formData.append("username", username);
  formData.append("password", password);

  const response = await publicApi.post(
    "/auth/login",
    formData,
    {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  if (response.data.user) {
    localStorage.setItem("userData", JSON.stringify(response.data.user));
  }

  setAuthenticated(true);

  return response.data;
};

export const logout = async () => {
  try {
    await api.post('/auth/logout', {}, { withCredentials: true });
  } catch (error) {
    if (isDevelopment) {
      console.error('Logout error:', error);
    }
  } finally {
    setAuthenticated(false);
    clearAuthData();
    redirectToLogin();
  }
};

// ==========================================================
// API HEALTH CHECK
// ==========================================================

/**
 * Check if API is accessible
 * @returns {Promise<boolean>} True if API is accessible
 */
export const checkApiHealth = async () => {
  try {
    const response = await publicApi.get('/health', { timeout: 5000 });
    return response.status === 200;
  } catch (error) {
    if (isDevelopment) {
      console.warn('API health check failed:', error.message);
    }
    return false;
  }
};

/**
 * Check if media server is accessible
 * @returns {Promise<boolean>} True if media is accessible
 */
export const checkMediaAccessible = async () => {
  try {
    const testUrl = `${API_BASE}/media/test.txt`;
    const response = await fetch(testUrl, { method: 'HEAD', mode: 'cors' });
    return response.ok;
  } catch (error) {
    if (isDevelopment) {
      console.warn('Media server check failed:', error.message);
    }
    return false;
  }
};

// ==========================================================
// TOKEN AUTO-REFRESH (Legacy - not needed with cookies)
// ==========================================================

/**
 * @deprecated Not needed with HTTP-only cookies
 */
export const startTokenRefresh = () => {
  if (isDevelopment) {
    console.log('🔄 Token auto-refresh not needed with cookies');
  }
  return null;
};

/**
 * @deprecated Not needed with HTTP-only cookies
 */
export const stopTokenRefresh = (intervalId) => {
  // No-op
};

// ==========================================================
// MULTI-TAB LOGOUT SYNC
// ==========================================================
if (typeof window !== 'undefined') {
  window.addEventListener("storage", (event) => {
    if (event.key === "auth_initialized" && !event.newValue) {
      if (!isLoginPage()) {
        redirectToLogin();
      }
    }
  });
}

// ==========================================================
// DEFAULT EXPORT
// ==========================================================

export default api;