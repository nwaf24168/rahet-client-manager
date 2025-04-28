
import { ArrowUp, ArrowDown } from 'lucide-react';
import { Card, CardContent } from './ui/card';

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
  
  const getColors = () => {
    switch (color) {
      case 'red':
        return {
          bg: 'bg-red-950/10 hover:bg-red-950/20',
          text: 'text-red-500',
          border: 'border-red-900/20'
        };
      case 'green':
        return {
          bg: 'bg-green-950/10 hover:bg-green-950/20',
          text: 'text-green-500',
          border: 'border-green-900/20'
        };
      default:
        return {
          bg: 'bg-card hover:bg-accent/50',
          text: 'text-foreground',
          border: 'border-border'
        };
    }
  };

  const colors = getColors();

  return (
    <Card className={`
      transition-all duration-300 ease-in-out
      transform hover:scale-[1.02]
      ${colors.bg} 
      ${colors.border}
      border 
      ${className}
    `}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="text-right flex-1">
            <h3 className={`text-sm font-semibold mb-2 ${colors.text}`}>
              {title}
            </h3>
            <div className="flex items-baseline gap-2">
              <p className={`text-3xl font-bold ${colors.text}`}>
                {value}
              </p>
              {change !== undefined && (
                <div className={`flex items-center gap-1 text-sm ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                  {isPositive ? (
                    <ArrowUp className="w-4 h-4" />
                  ) : (
                    <ArrowDown className="w-4 h-4" />
                  )}
                  <span>{Math.abs(change)}%</span>
                </div>
              )}
            </div>
            {subtitle && (
              <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
            )}
            {targetAchieved !== undefined && (
              <p className={`text-xs mt-2 ${targetAchieved ? 'text-green-500' : 'text-red-500'}`}>
                {targetAchieved ? 'تم تحقيق الهدف' : 'لم يتم تحقيق الهدف'}
              </p>
            )}
          </div>
          {icon && (
            <div className={`p-2 rounded-full ${colors.bg} ${colors.text}`}>
              {icon}
            </div>
          )}
        </div>
        {target !== undefined && (
          <div className="mt-4 w-full bg-secondary rounded-full h-1.5">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                targetAchieved ? 'bg-green-500' : 'bg-red-500'
              }`}
              style={{ 
                width: `${Math.min(100, (Number(value) / Number(target)) * 100)}%`
              }}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;
