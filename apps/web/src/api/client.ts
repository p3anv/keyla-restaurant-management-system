import axios from 'axios';
import { env } from '@/config/env';
import { useAuthStore } from '@/stores/auth.store';

// Helper to get token from localStorage directly (bypass Zustand hydration issues)
const getTokenFromStorage = (): string | null => {
  try {
    const stored = localStorage.getItem('auth-storage');
    if (!stored) return null;
    const parsed = JSON.parse(stored);
    return parsed.state?.accessToken || null;
  } catch (e) {
    return null;
  }
};

export const apiClient = axios.create({
  baseURL: env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Skip token for public endpoints
    const publicEndpoints = ['/auth/login', '/auth/register', '/auth/refresh'];
    const isPublic = publicEndpoints.some((endpoint) => config.url?.includes(endpoint));

    if (isPublic) {
      console.log(`🔓 Public endpoint: ${config.url} - skipping token`);
      return config;
    }

    // 1. Try Zustand first
    let token = useAuthStore.getState().accessToken;

    // 2. Fallback to localStorage
    if (!token) {
      token = getTokenFromStorage();
      // If we found it in localStorage, update Zustand for future requests
      if (token) {
        console.log('🔑 Token found in localStorage, updating Zustand');
        useAuthStore.setState({ accessToken: token, isAuthenticated: true });
      }
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log(`✅ Token attached to ${config.url}`);
    } else {
      console.warn(`⚠️ No token for ${config.url}`);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor (token refresh)
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Skip refresh if it's a public endpoint or already retried
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      // Try to get refresh token from Zustand or localStorage
      let refreshToken = useAuthStore.getState().refreshToken;
      if (!refreshToken) {
        const stored = localStorage.getItem('auth-storage');
        if (stored) {
          const parsed = JSON.parse(stored);
          refreshToken = parsed.state?.refreshToken || null;
        }
      }

      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      // Call refresh endpoint
      const response = await axios.post(`${env.VITE_API_URL}/api/v1/auth/refresh`, {
        refreshToken,
      });

      const newAccessToken = response.data.data.accessToken;

      // Update both Zustand and localStorage
      useAuthStore.getState().setAccessToken(newAccessToken);

      // Also update localStorage directly to keep it in sync
      try {
        const stored = localStorage.getItem('auth-storage');
        if (stored) {
          const parsed = JSON.parse(stored);
          parsed.state.accessToken = newAccessToken;
          localStorage.setItem('auth-storage', JSON.stringify(parsed));
        }
      } catch (e) {
        console.warn('Failed to update localStorage with new token', e);
      }

      // Retry original request with new token
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return apiClient(originalRequest);
    } catch (refreshError) {
      console.error('Refresh token failed, logging out', refreshError);
      useAuthStore.getState().logout();
      localStorage.removeItem('auth-storage');
      window.location.href = '/login';
      return Promise.reject(refreshError);
    }
  }
);