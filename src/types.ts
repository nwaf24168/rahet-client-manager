
export interface User {
  id: string;
  username: string;
  password: string;
  name: string;
  role: string;
}

export interface PerformanceMetric {
  id: string;
  name: string;
  value: number;
  target: number;
  change: number;
  isPositive: boolean;
  targetAchieved: boolean;
}

export interface CustomerMetric {
  id: string;
  category: string;
  name: string;
  value: number;
}

export interface CustomerSatisfaction {
  id: string;
  category: string;
  veryPleased: number;
  pleased: number;
  neutral: number;
  displeased: number;
  veryDispleased: number;
  totalScore: number;
}

export interface Complaint {
  id: string;
  number: string;
  date: string;
  customerName: string;
  project: string;
  status: string;
  source: string;
  details: string;
  action: string;
  unitNumber?: string;
}

export interface WeeklyData {
  performanceMetrics: PerformanceMetric[];
  customerMetrics: {
    calls: CustomerMetric[];
    inquiries: CustomerMetric[];
    maintenance: CustomerMetric[];
  };
  customerSatisfaction: CustomerSatisfaction[];
  complaints: Complaint[];
}

export interface AnnualData {
  performanceMetrics: PerformanceMetric[];
  customerMetrics: {
    calls: CustomerMetric[];
    inquiries: CustomerMetric[];
    maintenance: CustomerMetric[];
  };
  customerSatisfaction: CustomerSatisfaction[];
  complaints: Complaint[];
}

export type ViewMode = "weekly" | "annual";
export type DataEntryTab = "performanceMetrics" | "customerService" | "customerSatisfaction";
export type AnalyticsType = "customerSatisfaction" | "customerService" | "nps";
