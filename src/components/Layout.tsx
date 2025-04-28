
import { ReactNode } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';
import NavigationMenu from './NavigationMenu';

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

const Layout = ({ children, title }: LayoutProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border p-4 flex justify-between items-center">
        <div className="flex flex-col items-end">
          <h1 className="text-xl font-bold">شركة الرمز العقارية</h1>
          <p className="text-sm text-muted-foreground">منصة إدارة راحة العملاء</p>
        </div>
        
        <div className="flex items-center gap-4">
          {user && (
            <>
              <div className="flex items-center gap-2">
                <div className="flex flex-col items-end">
                  <span className="font-medium">{user.name}</span>
                  <span className="text-xs text-muted-foreground">{user.role}</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
              </div>
              <button 
                onClick={handleLogout} 
                className="text-destructive hover:text-destructive/80 transition-colors"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1">
        {/* Navigation */}
        <NavigationMenu />
        
        {/* Content */}
        <main className="flex-1 p-4">
          {title && (
            <h1 className="text-2xl font-bold mb-6 text-right">{title}</h1>
          )}
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
