
import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { 
  ViewMode,
  WeeklyData,
  AnnualData,
  PerformanceMetric,
  CustomerMetric,
  CustomerSatisfaction,
  Complaint
} from '../types';
import { toast } from 'sonner';

interface DataContextType {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  weeklyData: WeeklyData;
  annualData: AnnualData;
  updateWeeklyData: (data: Partial<WeeklyData>) => void;
  updateAnnualData: (data: Partial<AnnualData>) => void;
  addComplaint: (complaint: Complaint) => void;
  updateComplaint: (complaint: Complaint) => void;
  deleteComplaint: (id: string) => void;
}

const initialWeeklyData: WeeklyData = {
  performanceMetrics: [
    { id: '1', name: 'نسبة الترشيح للعملاء الجدد', value: 0, target: 65, change: 100, isPositive: true, targetAchieved: false },
    { id: '2', name: 'نسبة الترشيح بعد السنة', value: 0, target: 65, change: 100, isPositive: true, targetAchieved: false },
    { id: '3', name: 'نسبة الترشيح للعملاء القدامى', value: -6.4, target: 30, change: 121.3, isPositive: false, targetAchieved: false },
    { id: '4', name: 'جودة التسليم', value: 85, target: 100, change: 15, isPositive: false, targetAchieved: false },
    { id: '5', name: 'جودة الصيانة', value: 67, target: 100, change: 33, isPositive: false, targetAchieved: false },
    { id: '6', name: 'عدد التوالي للرد', value: 19, target: 3, change: 533.3, isPositive: false, targetAchieved: false },
    { id: '7', name: 'معدل الرد على المكالمات', value: 89, target: 80, change: 11.3, isPositive: true, targetAchieved: true },
    { id: '8', name: 'راحة العميل (CSAT)', value: 49.10, target: 70, change: 29.9, isPositive: false, targetAchieved: false },
    { id: '9', name: 'سرعة إغلاق طلبات الصيانة', value: 2.09, target: 3, change: 30.3, isPositive: true, targetAchieved: true },
    { id: '10', name: 'عدد إعادة فتح طلب', value: 33, target: 0, change: 0, isPositive: false, targetAchieved: false },
    { id: '11', name: 'جودة إدارة المرافق', value: 80, target: 80, change: 1.8, isPositive: true, targetAchieved: true },
    { id: '12', name: 'معدل التحول', value: 2, target: 2, change: 1.5, isPositive: true, targetAchieved: true },
    { id: '13', name: 'نسبة الرضا عن التسليم', value: 53.37, target: 80, change: 33.3, isPositive: false, targetAchieved: false },
    { id: '14', name: 'عدد العملاء المرشحين', value: 2645, target: 584, change: 352.9, isPositive: true, targetAchieved: true },
    { id: '15', name: 'المساهمة في المبيعات', value: 27, target: 5, change: 440, isPositive: true, targetAchieved: true },
  ],
  customerMetrics: {
    calls: [
      { id: 'c1', category: 'calls', name: 'شكاوى', value: 3 },
      { id: 'c2', category: 'calls', name: 'طلبات تواصل', value: 12 },
      { id: 'c3', category: 'calls', name: 'طلبات صيانة', value: 1 },
      { id: 'c4', category: 'calls', name: 'استفسارات', value: 43 },
      { id: 'c5', category: 'calls', name: 'مهتمين مكاتب', value: 10 },
      { id: 'c6', category: 'calls', name: 'مهتمين مشاريع', value: 10 },
      { id: 'c7', category: 'calls', name: 'عملاء مهتمين', value: 117 },
    ],
    inquiries: [
      { id: 'i1', category: 'inquiries', name: 'استفسارات عامة', value: 31 },
      { id: 'i2', category: 'inquiries', name: 'طلب وثائق', value: 0 },
      { id: 'i3', category: 'inquiries', name: 'استفسارات صكوك', value: 2 },
      { id: 'i4', category: 'inquiries', name: 'تأجير شقق', value: 9 },
      { id: 'i5', category: 'inquiries', name: 'مشاريع مباعة', value: 4 },
    ],
    maintenance: [
      { id: 'm1', category: 'maintenance', name: 'منتهية', value: 0 },
      { id: 'm2', category: 'maintenance', name: 'منجزة', value: 1 },
      { id: 'm3', category: 'maintenance', name: 'قيد المعالجة', value: 1 },
    ]
  },
  customerSatisfaction: [
    { 
      id: 'cs1', 
      category: 'الحل من أول مرة',
      veryPleased: 35,
      pleased: 38,
      neutral: 18,
      displeased: 6,
      veryDispleased: 3,
      totalScore: 74.0
    },
    { 
      id: 'cs2', 
      category: 'وقت الإغلاق',
      veryPleased: 25,
      pleased: 45,
      neutral: 20,
      displeased: 7,
      veryDispleased: 3,
      totalScore: 70.5
    },
    { 
      id: 'cs3', 
      category: 'جودة الخدمة',
      veryPleased: 30,
      pleased: 40,
      neutral: 20,
      displeased: 8,
      veryDispleased: 2,
      totalScore: 72.0
    },
  ],
  complaints: [
    { 
      id: 'comp1', 
      number: '1001', 
      date: '2025-01-01', 
      customerName: 'أحمد العصيباني', 
      project: 'تل الرمال المالية', 
      status: 'تم حلها',
      source: 'الاستبيان',
      details: 'الشيك مصدر للصندوق ولم نتلق مبلغ الضريبة. تم التواصل مع الصندوق و رد الضريبة للعميل من قبلنا',
      action: 'تم التواصل مع الصندوق'
    },
    { 
      id: 'comp2', 
      number: '1002', 
      date: '2025-02-27', 
      customerName: 'راشد المحنا', 
      project: '19', 
      status: 'تم حلها',
      source: 'الاستبيان',
      details: 'تأخر في تسليم الوحدة',
      action: 'تم التواصل مع العميل وحل المشكلة'
    },
    { 
      id: 'comp3', 
      number: '1003', 
      date: '2025-01-26', 
      customerName: 'نورة المسفر', 
      project: 'المعالي', 
      status: 'تم حلها',
      source: 'البريد الإلكتروني',
      details: 'مشكلة في التكييف',
      action: 'تم إرسال فني صيانة'
    },
    { 
      id: 'comp4', 
      number: '1004', 
      date: '2025-01-28', 
      customerName: 'حمد الحسين', 
      project: 'النخيل', 
      status: 'قرارات قائمة',
      source: 'الهاتف',
      details: 'تسرب مياه في الحمام',
      action: 'جدولة زيارة فني'
    },
    { 
      id: 'comp5', 
      number: '1005', 
      date: '2025-02-17', 
      customerName: 'تركي السعيد', 
      project: 'المعالي', 
      status: 'تم حلها',
      source: 'تطبيق الجوال',
      details: 'مشكلة في الإضاءة',
      action: 'تم الإصلاح'
    },
    { 
      id: 'comp6', 
      number: '1006', 
      date: '2025-01-15', 
      customerName: 'إيمان السبيعاني', 
      project: '', 
      status: 'تم حلها',
      source: 'الموقع الإلكتروني',
      details: 'استفسار عن موعد التسليم',
      action: 'تم الرد على الاستفسار'
    },
    { 
      id: 'comp7', 
      number: '1007', 
      date: '2025-02-16', 
      customerName: 'عبدالغني التميمي', 
      project: '41', 
      status: 'لم يتم حلها',
      source: 'الاستبيان',
      details: 'تأخير في موعد التسليم المتفق عليه',
      action: 'قيد المتابعة مع إدارة المشاريع'
    },
    { 
      id: 'comp8', 
      number: '1008', 
      date: '2025-01-19', 
      customerName: 'سعود العويس', 
      project: '', 
      status: 'تم حلها',
      source: 'الهاتف',
      details: 'مشكلة في فاتورة الصيانة',
      action: 'تم تصحيح الفاتورة'
    },
    { 
      id: 'comp9', 
      number: '1009', 
      date: '2025-02-19', 
      customerName: 'عمر العنبري', 
      project: 'النخيل', 
      status: 'قرارات قائمة',
      source: 'البريد الإلكتروني',
      details: 'مشكلة في التكييف المركزي',
      action: 'تم جدولة زيارة فني مختص'
    },
    { 
      id: 'comp10', 
      number: '1010', 
      date: '2025-03-06', 
      customerName: 'عبدالرحمن القبيسي', 
      project: 'تل الرمال', 
      status: 'تم حلها',
      source: 'تطبيق الجوال',
      details: 'مشكلة في موقف السيارة',
      action: 'تم حل المشكلة'
    },
  ]
};

// Clone the weekly data for the annual data with some modifications
const initialAnnualData: AnnualData = {
  ...JSON.parse(JSON.stringify(initialWeeklyData)),
  performanceMetrics: JSON.parse(JSON.stringify(initialWeeklyData.performanceMetrics)).map(metric => ({
    ...metric,
    value: metric.value * 1.2 // Just some variation for demo purposes
  }))
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [viewMode, setViewMode] = useState<ViewMode>("weekly");
  const [weeklyData, setWeeklyData] = useState<WeeklyData>(initialWeeklyData);
  const [annualData, setAnnualData] = useState<AnnualData>(initialAnnualData);

  const updateWeeklyData = useCallback((data: Partial<WeeklyData>) => {
    setWeeklyData(prev => ({ ...prev, ...data }));
    toast.success('تم تحديث البيانات بنجاح');
  }, []);

  const updateAnnualData = useCallback((data: Partial<AnnualData>) => {
    setAnnualData(prev => ({ ...prev, ...data }));
    toast.success('تم تحديث البيانات بنجاح');
  }, []);

  const addComplaint = useCallback((complaint: Complaint) => {
    setWeeklyData(prev => ({
      ...prev,
      complaints: [...prev.complaints, complaint]
    }));
    toast.success('تم إضافة الشكوى بنجاح');
  }, []);

  const updateComplaint = useCallback((updatedComplaint: Complaint) => {
    setWeeklyData(prev => ({
      ...prev,
      complaints: prev.complaints.map(complaint => 
        complaint.id === updatedComplaint.id ? updatedComplaint : complaint
      )
    }));
    toast.success('تم تحديث الشكوى بنجاح');
  }, []);

  const deleteComplaint = useCallback((id: string) => {
    setWeeklyData(prev => ({
      ...prev,
      complaints: prev.complaints.filter(complaint => complaint.id !== id)
    }));
    toast.success('تم حذف الشكوى بنجاح');
  }, []);

  return (
    <DataContext.Provider value={{ 
      viewMode, 
      setViewMode,
      weeklyData,
      annualData,
      updateWeeklyData,
      updateAnnualData,
      addComplaint,
      updateComplaint,
      deleteComplaint
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
