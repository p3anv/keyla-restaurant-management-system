import { apiClient } from '../client';

export const authApi = {
  login: (payload: { email: string; password: string }) =>
    apiClient.post('/api/v1/auth/login', payload).then((res) => res.data),
  register: (payload: { email: string; password: string; name: string }) =>
    apiClient.post('/api/v1/auth/register', payload).then((res) => res.data),
  refresh: (refreshToken: string) =>
    apiClient.post('/api/v1/auth/refresh', { refreshToken }).then((res) => res.data),
  me: () => apiClient.get('/api/v1/auth/me').then((res) => res.data),
  logout: () => apiClient.post('/api/v1/auth/logout').then((res) => res.data),
};
