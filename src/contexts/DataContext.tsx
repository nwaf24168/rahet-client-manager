
import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { 
  ViewMode, 
  Complaint,
  WeeklyData,
  AnnualData,
  PerformanceMetric,
  CustomerMetric,
  CustomerSatisfaction
} from '../types';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface DataContextType {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  weeklyData: WeeklyData;
  annualData: AnnualData;
  isLoading: boolean;
  updateWeeklyData: (data: Partial<WeeklyData>) => void;
  updateAnnualData: (data: Partial<AnnualData>) => void;
  addComplaint: (complaint: Complaint) => Promise<void>;
  updateComplaint: (complaint: Complaint, modifiedBy: string) => Promise<void>;
  deleteComplaint: (id: string, modifiedBy: string) => Promise<void>;
}

const emptyWeeklyData: WeeklyData = {
  performanceMetrics: [],
  customerMetrics: {
    calls: [],
    inquiries: [],
    maintenance: []
  },
  customerSatisfaction: [],
  complaints: []
};

const emptyAnnualData: AnnualData = {
  ...JSON.parse(JSON.stringify(emptyWeeklyData))
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [viewMode, setViewMode] = useState<ViewMode>("weekly");
  const [weeklyData, setWeeklyData] = useState<WeeklyData>(emptyWeeklyData);
  const [annualData, setAnnualData] = useState<AnnualData>(emptyAnnualData);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentUser] = useState('نواف'); // Default user for modifications

  // استرجاع البيانات من قاعدة البيانات عند بدء التشغيل
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      
      try {
        await Promise.all([
          fetchPerformanceMetrics(),
          fetchCustomerMetrics(),
          fetchCustomerSatisfaction(),
          fetchComplaints()
        ]);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('حدث خطأ أثناء استرجاع البيانات');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const fetchPerformanceMetrics = async () => {
    // استرجاع مؤشرات الأداء الأسبوعية
    const { data: weeklyMetrics, error: weeklyError } = await supabase
      .from('performance_metrics')
      .select('*')
      .eq('period_type', 'weekly');

    if (weeklyError) {
      console.error('Error fetching weekly performance metrics:', weeklyError);
      return;
    }

    // استرجاع مؤشرات الأداء السنوية
    const { data: annualMetrics, error: annualError } = await supabase
      .from('performance_metrics')
      .select('*')
      .eq('period_type', 'annual');

    if (annualError) {
      console.error('Error fetching annual performance metrics:', annualError);
      return;
    }

    // في حالة عدم وجود بيانات، إنشاء البيانات الافتراضية
    if (weeklyMetrics?.length === 0) {
      await createDefaultPerformanceMetrics('weekly');
    }

    if (annualMetrics?.length === 0) {
      await createDefaultPerformanceMetrics('annual');
    }

    // إعادة استرجاع البيانات بعد إنشاء البيانات الافتراضية إذا لزم الأمر
    const { data: updatedWeeklyMetrics } = await supabase
      .from('performance_metrics')
      .select('*')
      .eq('period_type', 'weekly');

    const { data: updatedAnnualMetrics } = await supabase
      .from('performance_metrics')
      .select('*')
      .eq('period_type', 'annual');

    setWeeklyData(prev => ({
      ...prev,
      performanceMetrics: mapPerformanceMetrics(updatedWeeklyMetrics || [])
    }));

    setAnnualData(prev => ({
      ...prev,
      performanceMetrics: mapPerformanceMetrics(updatedAnnualMetrics || [])
    }));
  };

  const fetchCustomerMetrics = async () => {
    // استرجاع مقاييس خدمة العملاء الأسبوعية
    const { data: weeklyMetrics, error: weeklyError } = await supabase
      .from('customer_service_metrics')
      .select('*')
      .eq('period_type', 'weekly');

    if (weeklyError) {
      console.error('Error fetching weekly customer metrics:', weeklyError);
      return;
    }

    // استرجاع مقاييس خدمة العملاء السنوية
    const { data: annualMetrics, error: annualError } = await supabase
      .from('customer_service_metrics')
      .select('*')
      .eq('period_type', 'annual');

    if (annualError) {
      console.error('Error fetching annual customer metrics:', annualError);
      return;
    }

    // في حالة عدم وجود بيانات، إنشاء البيانات الافتراضية
    if (weeklyMetrics?.length === 0) {
      await createDefaultCustomerMetrics('weekly');
    }

    if (annualMetrics?.length === 0) {
      await createDefaultCustomerMetrics('annual');
    }

    // إعادة استرجاع البيانات بعد إنشاء البيانات الافتراضية إذا لزم الأمر
    const { data: updatedWeeklyMetrics } = await supabase
      .from('customer_service_metrics')
      .select('*')
      .eq('period_type', 'weekly');

    const { data: updatedAnnualMetrics } = await supabase
      .from('customer_service_metrics')
      .select('*')
      .eq('period_type', 'annual');

    // تحويل البيانات إلى التنسيق المطلوب
    const weeklyCustomerMetrics = mapCustomerMetrics(updatedWeeklyMetrics || []);
    const annualCustomerMetrics = mapCustomerMetrics(updatedAnnualMetrics || []);

    setWeeklyData(prev => ({
      ...prev,
      customerMetrics: weeklyCustomerMetrics
    }));

    setAnnualData(prev => ({
      ...prev,
      customerMetrics: annualCustomerMetrics
    }));
  };

  const fetchCustomerSatisfaction = async () => {
    // استرجاع بيانات رضا العملاء الأسبوعية
    const { data: weeklySatisfaction, error: weeklyError } = await supabase
      .from('customer_satisfaction')
      .select('*')
      .eq('period_type', 'weekly');

    if (weeklyError) {
      console.error('Error fetching weekly customer satisfaction:', weeklyError);
      return;
    }

    // استرجاع بيانات رضا العملاء السنوية
    const { data: annualSatisfaction, error: annualError } = await supabase
      .from('customer_satisfaction')
      .select('*')
      .eq('period_type', 'annual');

    if (annualError) {
      console.error('Error fetching annual customer satisfaction:', annualError);
      return;
    }

    // في حالة عدم وجود بيانات، إنشاء البيانات الافتراضية
    if (weeklySatisfaction?.length === 0) {
      await createDefaultCustomerSatisfaction('weekly');
    }

    if (annualSatisfaction?.length === 0) {
      await createDefaultCustomerSatisfaction('annual');
    }

    // إعادة استرجاع البيانات بعد إنشاء البيانات الافتراضية إذا لزم الأمر
    const { data: updatedWeeklySatisfaction } = await supabase
      .from('customer_satisfaction')
      .select('*')
      .eq('period_type', 'weekly');

    const { data: updatedAnnualSatisfaction } = await supabase
      .from('customer_satisfaction')
      .select('*')
      .eq('period_type', 'annual');

    setWeeklyData(prev => ({
      ...prev,
      customerSatisfaction: mapCustomerSatisfaction(updatedWeeklySatisfaction || [])
    }));

    setAnnualData(prev => ({
      ...prev,
      customerSatisfaction: mapCustomerSatisfaction(updatedAnnualSatisfaction || [])
    }));
  };

  const fetchComplaints = async () => {
    // استرجاع الشكاوى
    const { data, error } = await supabase
      .from('complaints')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching complaints:', error);
      return;
    }

    // في حالة عدم وجود بيانات، إنشاء البيانات الافتراضية
    if (data?.length === 0) {
      await createDefaultComplaints();
    }

    // إعادة استرجاع البيانات بعد إنشاء البيانات الافتراضية إذا لزم الأمر
    const { data: updatedData } = await supabase
      .from('complaints')
      .select('*')
      .order('created_at', { ascending: false });

    const complaints = (updatedData || []).map(item => ({
      id: item.id,
      number: item.number,
      date: item.date,
      customerName: item.customer_name,
      project: item.project || '',
      unitNumber: item.unit_number || '',
      status: item.status,
      source: item.source,
      details: item.details || '',
      action: item.action || ''
    }));

    setWeeklyData(prev => ({ ...prev, complaints }));
    setAnnualData(prev => ({ ...prev, complaints }));
  };

  // دوال مساعدة لتحويل تنسيق البيانات
  const mapPerformanceMetrics = (data: any[]): PerformanceMetric[] => {
    return data.map(item => ({
      id: item.id,
      name: item.metric_name,
      value: item.value,
      target: item.target,
      change: item.change,
      isPositive: item.is_positive,
      targetAchieved: item.target_achieved
    }));
  };

  const mapCustomerMetrics = (data: any[]) => {
    const calls = data.filter(item => item.category === 'calls').map(item => ({
      id: item.id,
      category: item.category,
      name: item.metric_name,
      value: item.value
    }));

    const inquiries = data.filter(item => item.category === 'inquiries').map(item => ({
      id: item.id,
      category: item.category,
      name: item.metric_name,
      value: item.value
    }));

    const maintenance = data.filter(item => item.category === 'maintenance').map(item => ({
      id: item.id,
      category: item.category,
      name: item.metric_name,
      value: item.value
    }));

    return {
      calls,
      inquiries,
      maintenance
    };
  };

  const mapCustomerSatisfaction = (data: any[]): CustomerSatisfaction[] => {
    return data.map(item => ({
      id: item.id,
      category: item.category,
      veryPleased: item.very_pleased,
      pleased: item.pleased,
      neutral: item.neutral,
      displeased: item.displeased,
      veryDispleased: item.very_displeased,
      totalScore: item.total_score
    }));
  };

  // دوال إنشاء البيانات الافتراضية
  const createDefaultPerformanceMetrics = async (periodType: 'weekly' | 'annual') => {
    const defaultMetrics = [
      { name: 'نسبة الترشيح للعملاء الجدد', value: periodType === 'weekly' ? 0 : 0 * 1.2, target: 65, change: 100, is_positive: true, target_achieved: false },
      { name: 'نسبة الترشيح بعد السنة', value: periodType === 'weekly' ? 0 : 0 * 1.2, target: 65, change: 100, is_positive: true, target_achieved: false },
      { name: 'نسبة الترشيح للعملاء القدامى', value: periodType === 'weekly' ? -6.4 : -6.4 * 1.2, target: 30, change: 121.3, is_positive: false, target_achieved: false },
      { name: 'جودة التسليم', value: periodType === 'weekly' ? 85 : 85 * 1.2, target: 100, change: 15, is_positive: false, target_achieved: false },
      { name: 'جودة الصيانة', value: periodType === 'weekly' ? 67 : 67 * 1.2, target: 100, change: 33, is_positive: false, target_achieved: false },
      { name: 'عدد التوالي للرد', value: periodType === 'weekly' ? 19 : 19 * 1.2, target: 3, change: 533.3, is_positive: false, target_achieved: false },
      { name: 'معدل الرد على المكالمات', value: periodType === 'weekly' ? 89 : 89 * 1.2, target: 80, change: 11.3, is_positive: true, target_achieved: true },
      { name: 'راحة العميل (CSAT)', value: periodType === 'weekly' ? 49.10 : 49.10 * 1.2, target: 70, change: 29.9, is_positive: false, target_achieved: false },
      { name: 'سرعة إغلاق طلبات الصيانة', value: periodType === 'weekly' ? 2.09 : 2.09 * 1.2, target: 3, change: 30.3, is_positive: true, target_achieved: true },
      { name: 'عدد إعادة فتح طلب', value: periodType === 'weekly' ? 33 : 33 * 1.2, target: 0, change: 0, is_positive: false, target_achieved: false },
      { name: 'جودة إدارة المرافق', value: periodType === 'weekly' ? 80 : 80 * 1.2, target: 80, change: 1.8, is_positive: true, target_achieved: true },
      { name: 'معدل التحول', value: periodType === 'weekly' ? 2 : 2 * 1.2, target: 2, change: 1.5, is_positive: true, target_achieved: true },
      { name: 'نسبة الرضا عن التسليم', value: periodType === 'weekly' ? 53.37 : 53.37 * 1.2, target: 80, change: 33.3, is_positive: false, target_achieved: false },
      { name: 'عدد العملاء المرشحين', value: periodType === 'weekly' ? 2645 : 2645 * 1.2, target: 584, change: 352.9, is_positive: true, target_achieved: true },
      { name: 'المساهمة في المبيعات', value: periodType === 'weekly' ? 27 : 27 * 1.2, target: 5, change: 440, is_positive: true, target_achieved: true }
    ];

    // إضافة البيانات الافتراضية إلى قاعدة البيانات
    for (const metric of defaultMetrics) {
      try {
        await supabase.from('performance_metrics').insert({
          metric_name: metric.name,
          value: metric.value,
          target: metric.target,
          change: metric.change,
          is_positive: metric.is_positive,
          target_achieved: metric.target_achieved,
          period_type: periodType
        });
      } catch (error) {
        console.error(`Error creating default ${periodType} performance metric:`, error);
      }
    }
  };

  const createDefaultCustomerMetrics = async (periodType: 'weekly' | 'annual') => {
    const defaultCalls = [
      { category: 'calls', name: 'شكاوى', value: 3 },
      { category: 'calls', name: 'طلبات تواصل', value: 12 },
      { category: 'calls', name: 'طلبات صيانة', value: 1 },
      { category: 'calls', name: 'استفسارات', value: 43 },
      { category: 'calls', name: 'مهتمين مكاتب', value: 10 },
      { category: 'calls', name: 'مهتمين مشاريع', value: 10 },
      { category: 'calls', name: 'عملاء مهتمين', value: 117 }
    ];

    const defaultInquiries = [
      { category: 'inquiries', name: 'استفسارات عامة', value: 31 },
      { category: 'inquiries', name: 'طلب وثائق', value: 0 },
      { category: 'inquiries', name: 'استفسارات صكوك', value: 2 },
      { category: 'inquiries', name: 'تأجير شقق', value: 9 },
      { category: 'inquiries', name: 'مشاريع مباعة', value: 4 }
    ];

    const defaultMaintenance = [
      { category: 'maintenance', name: 'منتهية', value: 0 },
      { category: 'maintenance', name: 'منجزة', value: 1 },
      { category: 'maintenance', name: 'قيد المعالجة', value: 1 }
    ];

    const allMetrics = [...defaultCalls, ...defaultInquiries, ...defaultMaintenance];

    // إضافة البيانات الافتراضية إلى قاعدة البيانات
    for (const metric of allMetrics) {
      try {
        await supabase.from('customer_service_metrics').insert({
          category: metric.category,
          metric_name: metric.name,
          value: metric.value,
          period_type: periodType
        });
      } catch (error) {
        console.error(`Error creating default ${periodType} customer metric:`, error);
      }
    }
  };

  const createDefaultCustomerSatisfaction = async (periodType: 'weekly' | 'annual') => {
    const defaultSatisfaction = [
      { 
        category: 'الحل من أول مرة',
        very_pleased: 35,
        pleased: 38,
        neutral: 18,
        displeased: 6,
        very_displeased: 3,
        total_score: 74.0
      },
      { 
        category: 'وقت الإغلاق',
        very_pleased: 25,
        pleased: 45,
        neutral: 20,
        displeased: 7,
        very_displeased: 3,
        total_score: 70.5
      },
      { 
        category: 'جودة الخدمة',
        very_pleased: 30,
        pleased: 40,
        neutral: 20,
        displeased: 8,
        very_displeased: 2,
        total_score: 72.0
      }
    ];

    // إضافة البيانات الافتراضية إلى قاعدة البيانات
    for (const item of defaultSatisfaction) {
      try {
        await supabase.from('customer_satisfaction').insert({
          ...item,
          period_type: periodType
        });
      } catch (error) {
        console.error(`Error creating default ${periodType} customer satisfaction:`, error);
      }
    }
  };

  const createDefaultComplaints = async () => {
    const defaultComplaints = [
      { 
        id: 'comp1', 
        number: '1001', 
        date: '2025-01-01', 
        customer_name: 'أحمد العصيباني', 
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
        customer_name: 'راشد المحنا', 
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
        customer_name: 'نورة المسفر', 
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
        customer_name: 'حمد الحسين', 
        project: 'النخيل', 
        status: 'تحت المعالجة',
        source: 'الهاتف',
        details: 'تسرب مياه في الحمام',
        action: 'جدولة زيارة فني'
      },
      { 
        id: 'comp5', 
        number: '1005', 
        date: '2025-02-17', 
        customer_name: 'تركي السعيد', 
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
        customer_name: 'إيمان السبيعاني', 
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
        customer_name: 'عبدالغني التميمي', 
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
        customer_name: 'سعود العويس', 
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
        customer_name: 'عمر العنبري', 
        project: 'النخيل', 
        status: 'تحت المعالجة',
        source: 'البريد الإلكتروني',
        details: 'مشكلة في التكييف المركزي',
        action: 'تم جدولة زيارة فني مختص'
      },
      { 
        id: 'comp10', 
        number: '1010', 
        date: '2025-03-06', 
        customer_name: 'عبدالرحمن القبيسي', 
        project: 'تل الرمال', 
        status: 'تم حلها',
        source: 'تطبيق الجوال',
        details: 'مشكلة في موقف السيارة',
        action: 'تم حل المشكلة'
      }
    ];

    // إضافة البيانات الافتراضية إلى قاعدة البيانات
    for (const complaint of defaultComplaints) {
      try {
        await supabase.from('complaints').insert(complaint);
        
        // إضافة إجراء إنشاء لكل شكوى
        await supabase.from('complaint_actions').insert({
          complaint_id: complaint.id,
          action_type: 'إنشاء',
          action_details: 'تم إنشاء الشكوى',
          modified_by: currentUser
        });
      } catch (error) {
        console.error('Error creating default complaint:', error);
      }
    }
  };

  const updateWeeklyData = useCallback(async (data: Partial<WeeklyData>) => {
    try {
      // تحديث مؤشرات الأداء
      if (data.performanceMetrics) {
        for (const metric of data.performanceMetrics) {
          // البحث عن المقياس في قاعدة البيانات
          const { data: existingMetrics } = await supabase
            .from('performance_metrics')
            .select('*')
            .eq('metric_name', metric.name)
            .eq('period_type', 'weekly')
            .limit(1);

          const metricData = {
            metric_name: metric.name,
            value: metric.value,
            target: metric.target,
            change: metric.change,
            is_positive: metric.isPositive,
            target_achieved: metric.targetAchieved,
            period_type: 'weekly'
          };

          if (existingMetrics && existingMetrics.length > 0) {
            // تحديث المقياس الموجود
            await supabase
              .from('performance_metrics')
              .update(metricData)
              .eq('id', existingMetrics[0].id);
          } else {
            // إضافة مقياس جديد
            await supabase.from('performance_metrics').insert(metricData);
          }
        }
      }

      // تحديث مقاييس خدمة العملاء
      if (data.customerMetrics) {
        // تحديث المكالمات
        if (data.customerMetrics.calls) {
          await updateCustomerMetricsCategory(data.customerMetrics.calls, 'calls', 'weekly');
        }

        // تحديث الاستفسارات
        if (data.customerMetrics.inquiries) {
          await updateCustomerMetricsCategory(data.customerMetrics.inquiries, 'inquiries', 'weekly');
        }

        // تحديث الصيانة
        if (data.customerMetrics.maintenance) {
          await updateCustomerMetricsCategory(data.customerMetrics.maintenance, 'maintenance', 'weekly');
        }
      }

      // تحديث رضا العملاء
      if (data.customerSatisfaction) {
        for (const item of data.customerSatisfaction) {
          // البحث عن العنصر في قاعدة البيانات
          const { data: existingItems } = await supabase
            .from('customer_satisfaction')
            .select('*')
            .eq('category', item.category)
            .eq('period_type', 'weekly')
            .limit(1);

          const satisfactionData = {
            category: item.category,
            very_pleased: item.veryPleased,
            pleased: item.pleased,
            neutral: item.neutral,
            displeased: item.displeased,
            very_displeased: item.veryDispleased,
            total_score: item.totalScore,
            period_type: 'weekly'
          };

          if (existingItems && existingItems.length > 0) {
            // تحديث العنصر الموجود
            await supabase
              .from('customer_satisfaction')
              .update(satisfactionData)
              .eq('id', existingItems[0].id);
          } else {
            // إضافة عنصر جديد
            await supabase.from('customer_satisfaction').insert(satisfactionData);
          }
        }
      }

      setWeeklyData(prev => ({ ...prev, ...data }));
      toast.success('تم تحديث البيانات بنجاح');
    } catch (error) {
      console.error('Error updating weekly data:', error);
      toast.error('حدث خطأ أثناء تحديث البيانات');
    }
  }, []);

  const updateAnnualData = useCallback(async (data: Partial<AnnualData>) => {
    try {
      // تحديث مؤشرات الأداء
      if (data.performanceMetrics) {
        for (const metric of data.performanceMetrics) {
          // البحث عن المقياس في قاعدة البيانات
          const { data: existingMetrics } = await supabase
            .from('performance_metrics')
            .select('*')
            .eq('metric_name', metric.name)
            .eq('period_type', 'annual')
            .limit(1);

          const metricData = {
            metric_name: metric.name,
            value: metric.value,
            target: metric.target,
            change: metric.change,
            is_positive: metric.isPositive,
            target_achieved: metric.targetAchieved,
            period_type: 'annual'
          };

          if (existingMetrics && existingMetrics.length > 0) {
            // تحديث المقياس الموجود
            await supabase
              .from('performance_metrics')
              .update(metricData)
              .eq('id', existingMetrics[0].id);
          } else {
            // إضافة مقياس جديد
            await supabase.from('performance_metrics').insert(metricData);
          }
        }
      }

      // تحديث مقاييس خدمة العملاء
      if (data.customerMetrics) {
        // تحديث المكالمات
        if (data.customerMetrics.calls) {
          await updateCustomerMetricsCategory(data.customerMetrics.calls, 'calls', 'annual');
        }

        // تحديث الاستفسارات
        if (data.customerMetrics.inquiries) {
          await updateCustomerMetricsCategory(data.customerMetrics.inquiries, 'inquiries', 'annual');
        }

        // تحديث الصيانة
        if (data.customerMetrics.maintenance) {
          await updateCustomerMetricsCategory(data.customerMetrics.maintenance, 'maintenance', 'annual');
        }
      }

      // تحديث رضا العملاء
      if (data.customerSatisfaction) {
        for (const item of data.customerSatisfaction) {
          // البحث عن العنصر في قاعدة البيانات
          const { data: existingItems } = await supabase
            .from('customer_satisfaction')
            .select('*')
            .eq('category', item.category)
            .eq('period_type', 'annual')
            .limit(1);

          const satisfactionData = {
            category: item.category,
            very_pleased: item.veryPleased,
            pleased: item.pleased,
            neutral: item.neutral,
            displeased: item.displeased,
            very_displeased: item.veryDispleased,
            total_score: item.totalScore,
            period_type: 'annual'
          };

          if (existingItems && existingItems.length > 0) {
            // تحديث العنصر الموجود
            await supabase
              .from('customer_satisfaction')
              .update(satisfactionData)
              .eq('id', existingItems[0].id);
          } else {
            // إضافة عنصر جديد
            await supabase.from('customer_satisfaction').insert(satisfactionData);
          }
        }
      }

      setAnnualData(prev => ({ ...prev, ...data }));
      toast.success('تم تحديث البيانات بنجاح');
    } catch (error) {
      console.error('Error updating annual data:', error);
      toast.error('حدث خطأ أثناء تحديث البيانات');
    }
  }, []);

  // دالة مساعدة لتحديث فئة معينة من مقاييس خدمة العملاء
  const updateCustomerMetricsCategory = async (metrics: CustomerMetric[], category: string, periodType: string) => {
    for (const metric of metrics) {
      // البحث عن المقياس في قاعدة البيانات
      const { data: existingMetrics } = await supabase
        .from('customer_service_metrics')
        .select('*')
        .eq('metric_name', metric.name)
        .eq('category', category)
        .eq('period_type', periodType)
        .limit(1);

      const metricData = {
        metric_name: metric.name,
        value: metric.value,
        category: category,
        period_type: periodType
      };

      if (existingMetrics && existingMetrics.length > 0) {
        // تحديث المقياس الموجود
        await supabase
          .from('customer_service_metrics')
          .update(metricData)
          .eq('id', existingMetrics[0].id);
      } else {
        // إضافة مقياس جديد
        await supabase.from('customer_service_metrics').insert(metricData);
      }
    }
  };

  const addComplaint = useCallback(async (complaint: Complaint) => {
    try {
      // إضافة الشكوى إلى قاعدة البيانات
      const { error } = await supabase.from('complaints').insert({
        id: complaint.id,
        number: complaint.number,
        date: complaint.date,
        customer_name: complaint.customerName,
        project: complaint.project,
        unit_number: complaint.unitNumber,
        status: complaint.status,
        source: complaint.source,
        details: complaint.details,
        action: complaint.action
      });

      if (error) throw error;

      // إضافة إجراء "إنشاء" إلى سجل الإجراءات
      await supabase.from('complaint_actions').insert({
        complaint_id: complaint.id,
        action_type: 'إنشاء',
        action_details: 'تم إنشاء الشكوى',
        modified_by: currentUser
      });

      // تحديث البيانات المحلية
      setWeeklyData(prev => ({
        ...prev,
        complaints: [...prev.complaints, complaint]
      }));
      
      setAnnualData(prev => ({
        ...prev,
        complaints: [...prev.complaints, complaint]
      }));
      
      toast.success('تم إضافة الشكوى بنجاح');
    } catch (error) {
      console.error('Error adding complaint:', error);
      toast.error('حدث خطأ أثناء إضافة الشكوى');
    }
  }, [currentUser]);

  const updateComplaint = useCallback(async (updatedComplaint: Complaint, modifiedBy: string) => {
    try {
      const oldComplaint = weeklyData.complaints.find(c => c.id === updatedComplaint.id);
      
      // تحديث الشكوى في قاعدة البيانات
      const { error } = await supabase.from('complaints').update({
        date: updatedComplaint.date,
        customer_name: updatedComplaint.customerName,
        project: updatedComplaint.project,
        unit_number: updatedComplaint.unitNumber,
        status: updatedComplaint.status,
        source: updatedComplaint.source,
        details: updatedComplaint.details,
        action: updatedComplaint.action
      }).eq('id', updatedComplaint.id);

      if (error) throw error;
      
      const changes = [];
      if (oldComplaint) {
        if (oldComplaint.status !== updatedComplaint.status) {
          changes.push(`تم تغيير الحالة من "${oldComplaint.status}" إلى "${updatedComplaint.status}"`);
        }
        if (oldComplaint.action !== updatedComplaint.action) {
          changes.push('تم تحديث الإجراء المتخذ');
        }
        if (oldComplaint.details !== updatedComplaint.details) {
          changes.push('تم تحديث تفاصيل الشكوى');
        }
        // التحقق من التغييرات في الحقول المهمة الأخرى
        if (oldComplaint.customerName !== updatedComplaint.customerName) {
          changes.push(`تم تغيير اسم العميل من "${oldComplaint.customerName}" إلى "${updatedComplaint.customerName}"`);
        }
        if (oldComplaint.project !== updatedComplaint.project) {
          const oldProject = oldComplaint.project || 'غير محدد';
          const newProject = updatedComplaint.project || 'غير محدد';
          changes.push(`تم تغيير المشروع من "${oldProject}" إلى "${newProject}"`);
        }
        if (oldComplaint.unitNumber !== updatedComplaint.unitNumber) {
          const oldUnit = oldComplaint.unitNumber || 'غير محدد';
          const newUnit = updatedComplaint.unitNumber || 'غير محدد';
          changes.push(`تم تغيير رقم الوحدة من "${oldUnit}" إلى "${newUnit}"`);
        }
      }

      const actionDetails = changes.length > 0 
        ? `قام ${modifiedBy} بـ${changes.join(' • ')}`
        : `قام ${modifiedBy} بتحديث الشكوى`;

      // إضافة إجراء "تعديل" إلى سجل الإجراءات
      await supabase.from('complaint_actions').insert({
        complaint_id: updatedComplaint.id,
        action_type: 'تعديل',
        action_details: actionDetails,
        modified_by: modifiedBy
      });

      // تحديث البيانات المحلية
      const updatedComplaints = weeklyData.complaints.map(complaint => 
        complaint.id === updatedComplaint.id ? updatedComplaint : complaint
      );
      
      setWeeklyData(prev => ({
        ...prev,
        complaints: updatedComplaints
      }));
      
      setAnnualData(prev => ({
        ...prev,
        complaints: updatedComplaints
      }));
      
      toast.success('تم تحديث الشكوى بنجاح');
    } catch (error) {
      console.error('Error updating complaint:', error);
      toast.error('حدث خطأ أثناء تحديث الشكوى');
    }
  }, [weeklyData.complaints]);

  const deleteComplaint = useCallback(async (id: string, modifiedBy: string) => {
    try {
      // إضافة إجراء "حذف" إلى سجل الإجراءات قبل حذف الشكوى
      await supabase.from('complaint_actions').insert({
        complaint_id: id,
        action_type: 'حذف',
        action_details: `قام ${modifiedBy} بحذف الشكوى`,
        modified_by: modifiedBy
      });

      // لاحظ أننا لا نحذف الشكوى من قاعدة البيانات، بل نقوم فقط بتحديث البيانات المحلية
      // كي يبقى سجل الإجراءات متاحًا للمراجعة
      
      // تحديث البيانات المحلية
      const updatedComplaints = weeklyData.complaints.filter(complaint => complaint.id !== id);
      
      setWeeklyData(prev => ({
        ...prev,
        complaints: updatedComplaints
      }));
      
      setAnnualData(prev => ({
        ...prev,
        complaints: updatedComplaints
      }));
      
      toast.success('تم حذف الشكوى بنجاح');
    } catch (error) {
      console.error('Error deleting complaint:', error);
      toast.error('حدث خطأ أثناء حذف الشكوى');
    }
  }, [weeklyData.complaints]);

  return (
    <DataContext.Provider value={{ 
      viewMode, 
      setViewMode,
      weeklyData,
      annualData,
      isLoading,
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
