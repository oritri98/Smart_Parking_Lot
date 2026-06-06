// authService.ts
// TODO: Implement authentication when backend is deployed (Future Expansion)
// Endpoints: POST /api/v1/auth/login | POST /api/v1/auth/register | POST /api/v1/auth/logout

export const authService = {
  // TODO: axios.post('/api/v1/auth/login', { email, password, role })
  async login(_email: string, _password: string, _role: string): Promise<never> {
    throw new Error('Authentication module not yet deployed. Coming soon.');
  },

  // TODO: axios.post('/api/v1/auth/register', { ...userData })
  async register(_userData: Record<string, unknown>): Promise<never> {
    throw new Error('Registration module not yet deployed. Coming soon.');
  },

  // TODO: axios.post('/api/v1/auth/logout')
  async logout(): Promise<void> {
    return Promise.resolve();
  },

  // TODO: axios.get('/api/v1/auth/me') — get current user profile
  async getCurrentUser(): Promise<null> {
    return null;
  },
};
