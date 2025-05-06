
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export type UserRole = 'CEO' | 'CCO' | 'Commercial Director' | 'Regional Manager' | 'Marketing Manager' | 'Production Manager' | 'Customer Support' | 'Social Media Manager' | 'Guest';

interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasPermission: (requiredRole: UserRole | UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data with different roles
const MOCK_USERS: Record<string, AuthUser> = {
  'ceo@minyork.com': {
    id: '1',
    name: 'Alex Morgan',
    email: 'ceo@minyork.com',
    role: 'CEO',
    avatar: '/avatar-1.png'
  },
  'cco@minyork.com': {
    id: '2',
    name: 'Jamie Rivera',
    email: 'cco@minyork.com',
    role: 'CCO',
    avatar: '/avatar-2.png'
  },
  'director@minyork.com': {
    id: '3',
    name: 'Taylor Chen',
    email: 'director@minyork.com',
    role: 'Commercial Director',
    avatar: '/avatar-3.png'
  },
  'regional@minyork.com': {
    id: '4',
    name: 'Jordan Smith',
    email: 'regional@minyork.com',
    role: 'Regional Manager',
    avatar: '/avatar-4.png'
  },
  'marketing@minyork.com': {
    id: '5',
    name: 'Casey Wong',
    email: 'marketing@minyork.com',
    role: 'Marketing Manager',
    avatar: '/avatar-5.png'
  },
  'production@minyork.com': {
    id: '6',
    name: 'Morgan Lee',
    email: 'production@minyork.com',
    role: 'Production Manager',
    avatar: '/avatar-6.png'
  },
  'support@minyork.com': {
    id: '7',
    name: 'Riley Johnson',
    email: 'support@minyork.com',
    role: 'Customer Support',
    avatar: '/avatar-7.png'
  },
  'social@minyork.com': {
    id: '8',
    name: 'Avery Garcia',
    email: 'social@minyork.com',
    role: 'Social Media Manager',
    avatar: '/avatar-8.png'
  }
};

// Role hierarchy for permission checking
const ROLE_HIERARCHY: Record<UserRole, number> = {
  'CEO': 100,
  'CCO': 90,
  'Commercial Director': 80,
  'Regional Manager': 70,
  'Marketing Manager': 65,
  'Production Manager': 60,
  'Social Media Manager': 55,
  'Customer Support': 50,
  'Guest': 10
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for stored user in localStorage
    const storedUser = localStorage.getItem('auth_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem('auth_user');
      }
    }
    // Important: Set loading to false after checking localStorage
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const lowercasedEmail = email.toLowerCase();
      const user = MOCK_USERS[lowercasedEmail];
      
      if (user && password === 'password') {
        setUser(user);
        localStorage.setItem('auth_user', JSON.stringify(user));
        navigate('/');
        return Promise.resolve();
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      setIsLoading(false);
      return Promise.reject(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_user');
    navigate('/login');
  };
  
  const hasPermission = (requiredRole: UserRole | UserRole[]) => {
    if (!user) return false;
    
    if (Array.isArray(requiredRole)) {
      return requiredRole.some(role => 
        ROLE_HIERARCHY[user.role] >= ROLE_HIERARCHY[role]
      );
    }
    
    return ROLE_HIERARCHY[user.role] >= ROLE_HIERARCHY[requiredRole];
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAuthenticated: !!user, 
        isLoading, 
        login, 
        logout, 
        hasPermission 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
