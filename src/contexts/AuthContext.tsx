
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export type UserRole = 'CEO' | 'CCO' | 'Commercial Director' | 'Regional Manager' | 'Marketing Manager' | 'Guest';

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
  voiceLogin: (voiceCommand: string) => Promise<void>;
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
  }
};

// Role hierarchy for permission checking
const ROLE_HIERARCHY: Record<UserRole, number> = {
  'CEO': 100,
  'CCO': 90,
  'Commercial Director': 80,
  'Regional Manager': 70,
  'Marketing Manager': 60,
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
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const lowercasedEmail = email.toLowerCase();
    const user = MOCK_USERS[lowercasedEmail];
    
    if (user && password === 'password') {
      setUser(user);
      localStorage.setItem('auth_user', JSON.stringify(user));
      navigate('/');
    } else {
      throw new Error('Invalid credentials');
    }
    
    setIsLoading(false);
  };
  
  const voiceLogin = async (voiceCommand: string) => {
    setIsLoading(true);
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const command = voiceCommand.toLowerCase();
    
    // Voice recognition logic
    let matchedUser: AuthUser | null = null;
    
    if (command.includes('ceo') || command.includes('alex morgan')) {
      matchedUser = MOCK_USERS['ceo@minyork.com'];
    } else if (command.includes('cco') || command.includes('jamie rivera')) {
      matchedUser = MOCK_USERS['cco@minyork.com'];
    } else if (command.includes('commercial director') || command.includes('taylor chen')) {
      matchedUser = MOCK_USERS['director@minyork.com'];
    } else if (command.includes('regional manager') || command.includes('jordan smith')) {
      matchedUser = MOCK_USERS['regional@minyork.com'];
    } else if (command.includes('marketing manager') || command.includes('casey wong')) {
      matchedUser = MOCK_USERS['marketing@minyork.com'];
    }
    
    if (matchedUser) {
      setUser(matchedUser);
      localStorage.setItem('auth_user', JSON.stringify(matchedUser));
      navigate('/');
      return Promise.resolve();
    } else {
      setIsLoading(false);
      return Promise.reject(new Error('Voice authentication failed'));
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
        voiceLogin, 
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

