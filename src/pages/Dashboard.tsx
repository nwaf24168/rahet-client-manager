import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import StatCard from '../components/StatCard';
import ViewToggle from '../components/ViewToggle';
import { useData } from '../contexts/DataContext';
import { 
  Users, 
  UserCheck, 
  Clock, 
  ShieldCheck, 
  Phone, 
  BarChart, 
  Percent, 
  Building, 
  Briefcase, 
  Activity 
} from 'lucide-react';

const Dashboard = () => {
  const { viewMode, performanceMetrics, customerServiceMetrics, customerSatisfaction, isLoading } = useData();
  const [title, setTitle] = useState('لوحة التحكم الرئيسية');

  useEffect(() => {
    document.title = 'لوحة التحكم | شركة الرمز العقارية';
  }, []);

  // Helper to find a metric by name
  const getMetric = (name: string) => {
    if (!performanceMetrics) return null;
    return performanceMetrics.find(m => m.metric_name === name);
  };

  // Group customer service metrics by category
  const customerMetrics = {
    calls: customerServiceMetrics?.filter(m => m.category === 'calls') || [],
    inquiries: customerServiceMetrics?.filter(m => m.category === 'inquiries') || [],
    maintenance: customerServiceMetrics?.filter(m => m.category === 'maintenance') || []
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <p className="mt-4 text-lg">جاري تحميل البيانات...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center mb-6">
          <ViewToggle />
          <h1 className="text-2xl font-bold">{title}</h1>
        </div>

        <div className="mb-8">
          <h2 className="text-right text-xl font-semibold mb-4">مؤشرات الأداء الرئيسية {viewMode === 'weekly' ? 'الأسبوعية' : 'السنوية'}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Row 1 */}
            <StatCard
              title="جودة التسليم"
              value={`${getMetric('جودة التسليم')?.value || 0}%`}
              icon={<ShieldCheck className="text-red-500 h-6 w-6" />}
              change={getMetric('جودة التسليم')?.change || 0}
              isPositive={getMetric('جودة التسليم')?.is_positive}
              subtitle={`الهدف: ${getMetric('جودة التسليم')?.target || 0}%`}
              color="red"
              targetAchieved={getMetric('جودة التسليم')?.target_achieved}
            />
            <StatCard
              title="نسبة الترشيح للعملاء القدامى"
              value={`${getMetric('نسبة الترشيح للعملاء القدامى')?.value || 0}%`}
              icon={<Users className="text-red-500 h-6 w-6" />}
              change={getMetric('نسبة الترشيح للعملاء القدامى')?.change || 0}
              isPositive={getMetric('نسبة الترشيح للعملاء القدامى')?.is_positive}
              subtitle={`الهدف: ${getMetric('نسبة الترشيح للعملاء القدامى')?.target || 0}%`}
              color="red"
              targetAchieved={getMetric('نسبة الترشيح للعملاء القدامى')?.target_achieved}
            />
            <StatCard
              title="نسبة الترشيح بعد السنة"
              value={`${getMetric('نسبة الترشيح بعد السنة')?.value || 0}%`}
              icon={<UserCheck className="text-red-500 h-6 w-6" />}
              change={getMetric('نسبة الترشيح بعد السنة')?.change || 0}
              isPositive={getMetric('نسبة الترشيح بعد السنة')?.is_positive}
              subtitle={`الهدف: ${getMetric('نسبة الترشيح بعد السنة')?.target || 0}%`}
              color="red"
              targetAchieved={getMetric('نسبة الترشيح بعد السنة')?.target_achieved}
            />
            <StatCard
              title="نسبة الترشيح للعملاء الجدد"
              value={`${getMetric('نسبة الترشيح للعملاء الجدد')?.value || 0}%`}
              icon={<Users className="text-red-500 h-6 w-6" />}
              change={getMetric('نسبة الترشيح للعملاء الجدد')?.change || 0}
              isPositive={getMetric('نسبة الترشيح للعملاء الجدد')?.is_positive}
              subtitle={`الهدف: ${getMetric('نسبة الترشيح للعملاء الجدد')?.target || 0}%`}
              color="red"
              targetAchieved={getMetric('نسبة الترشيح للعملاء الجدد')?.target_achieved}
            />
            
            {/* Row 2 */}
            <StatCard
              title="راحة العميل (CSAT)"
              value={`${getMetric('راحة العميل (CSAT)')?.value || 0}%`}
              icon={<Users className="text-red-500 h-6 w-6" />}
              change={getMetric('راحة العميل (CSAT)')?.change || 0}
              isPositive={getMetric('راحة العميل (CSAT)')?.is_positive}
              subtitle={`الهدف: ${getMetric('راحة العميل (CSAT)')?.target || 0}%`}
              color="red"
              targetAchieved={getMetric('راحة العميل (CSAT)')?.target_achieved}
            />
            <StatCard
              title="معدل الرد على المكالمات"
              value={`${getMetric('معدل الرد على المكالمات')?.value || 0}%`}
              icon={<Phone className="text-green-500 h-6 w-6" />}
              change={getMetric('معدل الرد على المكالمات')?.change || 0}
              isPositive={getMetric('معدل الرد على المكالمات')?.is_positive}
              subtitle={`الهدف: ${getMetric('معدل الرد على المكالمات')?.target || 0}%`}
              color="green"
              targetAchieved={getMetric('معدل الرد على المكالمات')?.target_achieved}
            />
            <StatCard
              title="عدد التوالي للرد"
              value={getMetric('عدد التوالي للرد')?.value || 0}
              icon={<Activity className="text-red-500 h-6 w-6" />}
              change={getMetric('عدد التوالي للرد')?.change || 0}
              isPositive={getMetric('عدد التوالي للرد')?.is_positive}
              subtitle={`الهدف: ${getMetric('عدد التوالي للرد')?.target || 0} توالي`}
              color="red"
              targetAchieved={getMetric('عدد التوالي للرد')?.target_achieved}
            />
            <StatCard
              title="جودة الصيانة"
              value={`${getMetric('جودة الصيانة')?.value || 0}%`}
              icon={<ShieldCheck className="text-red-500 h-6 w-6" />}
              change={getMetric('جودة الصيانة')?.change || 0}
              isPositive={getMetric('جودة الصيانة')?.is_positive}
              subtitle={`الهدف: ${getMetric('جودة الصيانة')?.target || 0}%`}
              color="red"
              targetAchieved={getMetric('جودة الصيانة')?.target_achieved}
            />
            
            {/* Row 3 */}
            <StatCard
              title="معدل التحول"
              value={`${getMetric('معدل التحول')?.value || 0}%`}
              icon={<Percent className="text-green-500 h-6 w-6" />}
              change={getMetric('معدل التحول')?.change || 0}
              isPositive={getMetric('معدل التحول')?.is_positive}
              subtitle={`الهدف: ${getMetric('معدل التحول')?.target || 0}%`}
              color="green"
              targetAchieved={getMetric('معدل التحول')?.target_achieved}
            />
            <StatCard
              title="جودة إدارة المرافق"
              value={`${getMetric('جودة إدارة المرافق')?.value || 0}%`}
              icon={<Building className="text-green-500 h-6 w-6" />}
              change={getMetric('جودة إدارة المرافق')?.change || 0}
              isPositive={getMetric('جودة إدارة المرافق')?.is_positive}
              subtitle={`الهدف: ${getMetric('جودة إدارة المرافق')?.target || 0}%`}
              color="green"
              targetAchieved={getMetric('جودة إدارة المرافق')?.target_achieved}
            />
            <StatCard
              title="عدد إعادة فتح طلب"
              value={getMetric('عدد إعادة فتح طلب')?.value || 0}
              icon={<Clock className="text-red-500 h-6 w-6" />}
              change={getMetric('عدد إعادة فتح طلب')?.change || 0}
              isPositive={getMetric('عدد إعادة فتح طلب')?.is_positive}
              subtitle={`الهدف: ${getMetric('عدد إعادة فتح طلب')?.target || 0}`}
              color="red"
              targetAchieved={getMetric('عدد إعادة فتح طلب')?.target_achieved}
            />
            <StatCard
              title="سرعة إغلاق طلبات الصيانة"
              value={`${getMetric('سرعة إغلاق طلبات الصيانة')?.value || 0}%`}
              icon={<Clock className="text-green-500 h-6 w-6" />}
              change={getMetric('سرعة إغلاق طلبات الصيانة')?.change || 0}
              isPositive={getMetric('سرعة إغلاق طلبات الصيانة')?.is_positive}
              subtitle={`الهدف: ${getMetric('سرعة إغلاق طلبات الصيانة')?.target || 0} أيام`}
              color="green"
              targetAchieved={getMetric('سرعة إغلاق طلبات الصيانة')?.target_achieved}
            />

            {/* Row 4 */}
            <StatCard
              title="المساهمة في المبيعات"
              value={`${getMetric('المساهمة في المبيعات')?.value || 0}%`}
              icon={<Percent className="text-green-500 h-6 w-6" />}
              change={getMetric('المساهمة في المبيعات')?.change || 0}
              isPositive={getMetric('المساهمة في المبيعات')?.is_positive}
              subtitle={`الهدف: ${getMetric('المساهمة في المبيعات')?.target || 0}%`}
              color="green"
              targetAchieved={getMetric('المساهمة في المبيعات')?.target_achieved}
            />
            <StatCard
              title="عدد العملاء المرشحين"
              value={getMetric('عدد العملاء المرشحين')?.value || 0}
              icon={<Users className="text-green-500 h-6 w-6" />}
              change={getMetric('عدد العملاء المرشحين')?.change || 0}
              isPositive={getMetric('عدد العملاء المرشحين')?.is_positive}
              subtitle={`الهدف: ${getMetric('عدد العملاء المرشحين')?.target || 0}`}
              color="green"
              targetAchieved={getMetric('عدد العملاء المرشحين')?.target_achieved}
            />
            <StatCard
              title="نسبة الرضا عن التسليم"
              value={`${getMetric('نسبة الرضا عن التسليم')?.value || 0}%`}
              icon={<UserCheck className="text-red-500 h-6 w-6" />}
              change={getMetric('نسبة الرضا عن التسليم')?.change || 0}
              isPositive={getMetric('نسبة الرضا عن التسليم')?.is_positive}
              subtitle={`الهدف: ${getMetric('نسبة الرضا عن التسليم')?.target || 0}%`}
              color="red"
              targetAchieved={getMetric('نسبة الرضا عن التسليم')?.target_achieved}
            />
          </div>
        </div>

        <div>
          <h2 className="text-right text-xl font-semibold mb-4">خدمة العملاء {viewMode === 'weekly' ? 'الأسبوعية' : 'السنوية'}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Customer Service Metrics */}
            <div className="bg-card rounded-md p-4 shadow-md hover:shadow-lg transition-all duration-300">
              <h3 className="text-lg font-semibold mb-4 text-right">المكالمات</h3>
              <div className="space-y-3">
                {customerMetrics.calls.map((item) => (
                  <div key={item.id} className="flex justify-between items-center">
                    <span className="text-lg font-semibold">{item.value}</span>
                    <span className="text-muted-foreground">{item.metric_name}</span>
                  </div>
                ))}
                <div className="border-t border-border mt-3 pt-3 flex justify-between items-center">
                  <span className="text-xl font-bold">
                    {customerMetrics.calls.reduce((sum, item) => sum + item.value, 0)}
                  </span>
                  <span className="text-lg font-semibold">إجمالي المكالمات</span>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-md p-4 shadow-md hover:shadow-lg transition-all duration-300">
              <h3 className="text-lg font-semibold mb-4 text-right">الاستفسارات</h3>
              <div className="space-y-3">
                {customerMetrics.inquiries.map((item) => (
                  <div key={item.id} className="flex justify-between items-center">
                    <span className="text-lg font-semibold">{item.value}</span>
                    <span className="text-muted-foreground">{item.metric_name}</span>
                  </div>
                ))}
                <div className="border-t border-border mt-3 pt-3 flex justify-between items-center">
                  <span className="text-xl font-bold">
                    {customerMetrics.inquiries.reduce((sum, item) => sum + item.value, 0)}
                  </span>
                  <span className="text-lg font-semibold">إجمالي الاستفسارات</span>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-md p-4 shadow-md hover:shadow-lg transition-all duration-300">
              <h3 className="text-lg font-semibold mb-4 text-right">حالة طلبات الصيانة</h3>
              <div className="space-y-3">
                {customerMetrics.maintenance.map((item) => (
                  <div key={item.id} className="flex justify-between items-center">
                    <span className="text-lg font-semibold">{item.value}</span>
                    <span className="text-muted-foreground">{item.metric_name}</span>
                  </div>
                ))}
                <div className="border-t border-border mt-3 pt-3 flex justify-between items-center">
                  <span className="text-xl font-bold">
                    {customerMetrics.maintenance.reduce((sum, item) => sum + item.value, 0)}
                  </span>
                  <span className="text-lg font-semibold">إجمالي طلبات الصيانة</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Satisfaction Section */}
        <div className="mt-8">
          <h2 className="text-right text-xl font-semibold mb-4">رضا العملاء عن الخدمات</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {customerSatisfaction && customerSatisfaction.map((item) => (
              <div key={item.id} className="bg-gradient-to-br from-amber-900/30 to-amber-700/10 rounded-md p-6 text-center shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-amber-800/20 rounded-full flex items-center justify-center">
                    <span className="text-3xl">{item.total_score >= 80 ? '😊' : item.total_score >= 50 ? '😐' : '☹️'}</span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-amber-500 mb-2">{item.total_score.toFixed(1)}%</h3>
                <p className="text-sm text-amber-400">{item.category}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Client Comments Section */}
        <div className="mt-8">
          <h2 className="text-right text-xl font-semibold mb-4">ملاحظات العملاء</h2>
          <div className="bg-card rounded-md p-6 shadow-md">
            <textarea
              className="w-full h-32 bg-secondary border border-border rounded-md p-3 text-right"
              placeholder="أضف تعليقاتك هنا..."
            />
            <div className="flex justify-start mt-4">
              <button className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/80 transition-colors">
                تسجيل
              </button>
            </div>
          </div>
        </div>

        {/* Log Out Button */}
        <div className="mt-8 flex justify-end">
          <button className="bg-destructive text-white px-4 py-2 rounded-md hover:bg-destructive/80 transition-colors">
            تسجيل الخروج
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
