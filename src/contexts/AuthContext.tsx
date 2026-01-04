import React, { createContext, useContext, useState, useCallback } from 'react';

interface User {
  id: string;
  email: string;
  username: string;
  isAdmin: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  signup: (email: string, password: string, username: string) => Promise<{ error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Placeholder for actual auth - will be replaced with Supabase
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Demo: Admin check
      const isAdmin = email.toLowerCase() === 'kulkat11@admin.com';
      
      setUser({
        id: '1',
        email,
        username: email.split('@')[0],
        isAdmin,
      });
      
      return {};
    } catch (error) {
      return { error: 'Login failed' };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signup = useCallback(async (email: string, password: string, username: string) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setUser({
        id: '1',
        email,
        username,
        isAdmin: false,
      });
      
      return {};
    } catch (error) {
      return { error: 'Signup failed' };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.isAdmin ?? false,
        isLoading,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
