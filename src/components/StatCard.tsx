
import { ArrowUp, ArrowDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  change?: number;
  target?: string | number;
  isPositive?: boolean;
  className?: string;
  color?: 'red' | 'green' | 'default';
  targetAchieved?: boolean;
}

const StatCard = ({ 
  title, 
  value, 
  subtitle, 
  icon, 
  change, 
  target,
  isPositive = true,
  className = "",
  color = 'default',
  targetAchieved
}: StatCardProps) => {
  
  let bgColor = '';
  let textColor = '';
  
  switch (color) {
    case 'red':
      bgColor = 'bg-red-950/30';
      textColor = 'text-red-500';
      break;
    case 'green':
      bgColor = 'bg-green-950/30';
      textColor = 'text-green-500';
      break;
    default:
      bgColor = 'bg-card';
      textColor = 'text-foreground';
      break;
  }

  return (
    <div className={`${bgColor} rounded-md p-4 ${className}`}>
      <div className="flex justify-between items-start">
        <div className="text-right">
          <h3 className={`text-sm font-medium mb-2 ${textColor}`}>{title}</h3>
          <p className={`text-3xl font-bold ${textColor}`}>{value}</p>
          {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
          {targetAchieved !== undefined && (
            <p className={`text-xs mt-1 ${targetAchieved ? 'text-positive' : 'text-negative'}`}>
              {targetAchieved ? 'تم تحقيق الهدف' : 'لم يتم تحقيق الهدف'}
            </p>
          )}
        </div>
        <div className="flex flex-col items-end">
          {icon}
          {change !== undefined && (
            <div className={`flex items-center gap-1 mt-2 text-sm ${isPositive ? 'text-positive' : 'text-negative'}`}>
              {isPositive ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
              <span>{Math.abs(change)}%</span>
            </div>
          )}
          {target !== undefined && <p className="text-xs text-muted-foreground mt-1">الهدف: {target}</p>}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
