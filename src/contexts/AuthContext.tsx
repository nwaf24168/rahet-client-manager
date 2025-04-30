
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

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
    const checkLocalStorage = async () => {
      setIsLoading(true);
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          
          // التحقق من صحة بيانات المستخدم في قاعدة البيانات
          const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('username', parsedUser.username)
            .eq('password', parsedUser.password)
            .single();
          
          if (error) {
            console.error('خطأ في التحقق من بيانات المستخدم:', error);
            localStorage.removeItem('user');
          } else if (data) {
            setUser({
              id: data.id,
              username: data.username,
              name: data.name,
              role: data.role,
              password: data.password
            });
          } else {
            localStorage.removeItem('user');
          }
        } catch (error) {
          console.error('فشل في قراءة بيانات المستخدم المخزنة', error);
          localStorage.removeItem('user');
        }
      }
      setIsLoading(false);
    };

    checkLocalStorage();
  }, []);

  const login = async (username: string, password: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username.toLowerCase())
        .eq('password', password)
        .single();

      if (error) {
        console.error('خطأ في تسجيل الدخول:', error);
        toast.error("اسم المستخدم أو كلمة المرور غير صحيحة");
        setIsLoading(false);
        return false;
      }

      if (data) {
        const foundUser: User = {
          id: data.id,
          username: data.username,
          name: data.name,
          role: data.role,
          password: data.password
        };

        setUser(foundUser);
        localStorage.setItem('user', JSON.stringify(foundUser));
        setIsLoading(false);
        return true;
      }
      
      toast.error("اسم المستخدم أو كلمة المرور غير صحيحة");
      setIsLoading(false);
      return false;
    } catch (error) {
      console.error('خطأ في تسجيل الدخول:', error);
      toast.error('حدث خطأ أثناء تسجيل الدخول');
      setIsLoading(false);
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
