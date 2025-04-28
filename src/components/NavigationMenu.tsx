
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Settings, 
  BarChart, 
  AlertCircle 
} from 'lucide-react';

const NavigationMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const menuItems = [
    { 
      icon: <LayoutDashboard className="h-5 w-5" />, 
      label: 'لوحة التحكم', 
      path: '/', 
      active: isActive('/') 
    },
    { 
      icon: <FileText className="h-5 w-5" />, 
      label: 'إدخال البيانات', 
      path: '/data-entry', 
      active: isActive('/data-entry') 
    },
    { 
      icon: <AlertCircle className="h-5 w-5" />, 
      label: 'الشكاوى', 
      path: '/complaints', 
      active: isActive('/complaints') 
    },
    { 
      icon: <BarChart className="h-5 w-5" />, 
      label: 'التحليلات', 
      path: '/analytics', 
      active: isActive('/analytics') 
    },
    { 
      icon: <Settings className="h-5 w-5" />, 
      label: 'الإعدادات', 
      path: '/settings', 
      active: isActive('/settings') 
    },
  ];

  return (
    <nav className="w-16 bg-secondary border-r border-border flex flex-col items-center py-4 gap-8">
      {menuItems.map((item) => (
        <div 
          key={item.path} 
          className={`flex flex-col items-center cursor-pointer group`}
          onClick={() => navigate(item.path)}
        >
          <div className={`p-2 rounded-md ${
            item.active 
              ? 'bg-primary text-primary-foreground' 
              : 'text-muted-foreground hover:text-foreground'
          }`}>
            {item.icon}
          </div>
          <span className={`text-xs mt-1 ${
            item.active ? 'text-foreground' : 'text-muted-foreground'
          }`}>
            {item.label}
          </span>
        </div>
      ))}
    </nav>
  );
};

export default NavigationMenu;
