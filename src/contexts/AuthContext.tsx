
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user', error);
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    try {
      // In a real app, this would be an API call
      // For now, simulate checking against a predefined user list
      const defaultUsers = [
        { id: '1', username: 'Alramz2025', password: 'Alramz2025', name: 'nawaf', role: 'مدير النظام' },
        { id: '2', username: 'admin', password: 'Alramz2025', name: 'admin', role: 'مدير النظام' },
        { id: '3', username: 'abdukalam', password: 'Alramz2025', name: 'abdukalam', role: 'مدير إدارة راحة العملاء' },
        { id: '4', username: 'ajjawhara', password: 'Alramz2025', name: 'ajjawhara', role: 'موظف إدارة راحة العملاء' },
        { id: '5', username: 'khulood', password: 'Alramz2025', name: 'khulood', role: 'موظف إدارة راحة العملاء' },
        { id: '6', username: 'adnan', password: 'Alramz2025', name: 'adnan', role: 'موظف إدارة راحة العملاء' },
        { id: '7', username: 'lateefa', password: 'Alramz2025', name: 'lateefa', role: 'موظف إدارة راحة العملاء' },
        { id: '8', username: 'nawaf', password: 'Alramz2025', name: 'nawaf', role: 'مدير النظام' },
      ];

      // Check if a user with the provided username and password exists
      const foundUser = defaultUsers.find(
        u => u.username.toLowerCase() === username.toLowerCase() && u.password === password
      );

      if (foundUser) {
        setUser(foundUser);
        localStorage.setItem('user', JSON.stringify(foundUser));
        return true;
      }
      
      toast.error("اسم المستخدم أو كلمة المرور غير صحيحة");
      return false;
    } catch (error) {
      console.error('Login error:', error);
      toast.error('حدث خطأ أثناء تسجيل الدخول');
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      isAuthenticated: !!user,
      isLoading 
    }}>
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
