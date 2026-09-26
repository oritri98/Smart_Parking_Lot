// authService.ts
// Real API calls to Laravel / PHP Backend
// Endpoints: POST /api/v1/auth/login | POST /api/v1/auth/register | POST /api/v1/auth/logout | GET /api/v1/auth/me

import { apiClient } from './apiClient';

export interface UserProfile {
  id?: string;
  name: string;
  email?: string;
  role: string;
  department?: string;
  institution?: string;
}

export const authService = {
  async login(email: string, password: string, role: string): Promise<{ accessToken: string; user: UserProfile }> {
    const res = await apiClient.post<{ accessToken: string; user: UserProfile }>('/auth/login', {
      email,
      password,
      role,
    });
    return res.data;
  },

  async register(userData: Record<string, unknown>): Promise<{ message: string; status: string }> {
    const res = await apiClient.post<{ message: string; status: string }>('/auth/register', userData);
    return res.data;
  },

  async logout(): Promise<void> {
    await apiClient.post('/auth/logout');
  },

  async getCurrentUser(): Promise<UserProfile | null> {
    try {
      const res = await apiClient.get<UserProfile>('/auth/me');
      return res.data;
    } catch {
      return null;
    }
  },
};
