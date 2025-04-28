
import { createContext, useContext, useState, ReactNode } from 'react';
import { ViewMode } from '../types';
import { useMetrics } from '../hooks/useMetrics';

interface DataContextType {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  performanceMetrics: any[];
  customerServiceMetrics: any[];
  customerSatisfaction: any[];
  isLoading: boolean;
  updateMetric: (params: { table: string; data: any }) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [viewMode, setViewMode] = useState<ViewMode>("weekly");
  const { 
    performanceMetrics = [], 
    customerServiceMetrics = [], 
    customerSatisfaction = [],
    isLoading,
    updateMetric
  } = useMetrics(viewMode);

  return (
    <DataContext.Provider value={{ 
      viewMode, 
      setViewMode,
      performanceMetrics,
      customerServiceMetrics,
      customerSatisfaction,
      isLoading,
      updateMetric
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
