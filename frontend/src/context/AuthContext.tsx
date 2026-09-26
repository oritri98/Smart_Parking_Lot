import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export type UserRole = 'admin' | 'proctor' | 'security' | 'student' | 'faculty';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  employeeId?: string;
  studentId?: string;
  phone?: string;
  joinedDate?: string;
  lastLogin?: string;
  avatar?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoggedIn: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoggedIn: false,
  isAdmin: false,
  login: async () => ({ success: false, message: '' }),
  logout: () => {},
  loading: false,
});

// ─── SESSION STORAGE KEYS ───────────────────────────────────────────────────
const SESSION_USER_KEY  = 'aust_ipms_user';
const SESSION_TOKEN_KEY = 'aust_ipms_token';
const SESSION_EXPIRY_KEY = 'aust_ipms_expiry';

// ─── API BASE URL ────────────────────────────────────────────────────────────
// Uses VITE_API_BASE_URL if defined, otherwise defaults to local Laravel backend
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // ─── Restore session from localStorage on mount ──────────────────────────
  useEffect(() => {
    const storedUser  = localStorage.getItem(SESSION_USER_KEY);
    const storedToken = localStorage.getItem(SESSION_TOKEN_KEY);
    const storedExpiry = localStorage.getItem(SESSION_EXPIRY_KEY);

    if (storedUser && storedToken && storedExpiry) {
      try {
        const expiry = parseInt(storedExpiry, 10);
        if (Date.now() < expiry) {
          // Session still valid — restore state
          setUser(JSON.parse(storedUser));
        } else {
          // Session expired — clear everything
          clearSession();
        }
      } catch {
        clearSession();
      }
    }
    setLoading(false);
  }, []);

  const clearSession = () => {
    localStorage.removeItem(SESSION_USER_KEY);
    localStorage.removeItem(SESSION_TOKEN_KEY);
    localStorage.removeItem(SESSION_EXPIRY_KEY);
  };

  // ─── Login via Laravel API ──────────────────────────────────────────────
  const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setLoading(false);
        return {
          success: false,
          message: data?.detail || data?.message || 'Authentication failed. Please try again.',
        };
      }

      // Success — persist session data
      const authedUser: AuthUser = {
        id:          data.user.id,
        name:        data.user.name,
        email:       data.user.email,
        role:        data.user.role as UserRole,
        department:  data.user.department,
        employeeId:  data.user.employeeId,
        phone:       data.user.phone,
        joinedDate:  data.user.joinedDate,
        lastLogin:   data.user.lastLogin,
      };

      // Session expiry = current time + server-reported expiresIn (seconds)
      const expiresInMs  = (data.expiresIn || 7 * 86400) * 1000;
      const expiryTimestamp = Date.now() + expiresInMs;

      setUser(authedUser);
      localStorage.setItem(SESSION_USER_KEY,   JSON.stringify(authedUser));
      localStorage.setItem(SESSION_TOKEN_KEY,  data.accessToken);
      localStorage.setItem(SESSION_EXPIRY_KEY, String(expiryTimestamp));

      setLoading(false);
      return { success: true, message: `Welcome back, ${authedUser.name}!` };

    } catch {
      setLoading(false);
      return {
        success: false,
        message: 'Cannot reach the authentication server. Please ensure the backend is running.',
      };
    }
  };

  // ─── Logout ──────────────────────────────────────────────────────────────
  const logout = () => {
    // Fire-and-forget server logout (invalidate any server-side state)
    const token = localStorage.getItem(SESSION_TOKEN_KEY);
    if (token) {
      fetch(`${API_BASE}/auth/logout`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' },
      }).catch(() => { /* best-effort */ });
    }
    setUser(null);
    clearSession();
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, isAdmin, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

/**
 * Returns the stored Bearer token for authenticated API calls.
 * Use this in services that need to call protected backend routes.
 */
export function getAuthToken(): string | null {
  return localStorage.getItem(SESSION_TOKEN_KEY);
}
