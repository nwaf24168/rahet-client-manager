
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
  const { viewMode, weeklyData, annualData } = useData();
  const [title, setTitle] = useState('لوحة التحكم الرئيسية');

  useEffect(() => {
    document.title = 'لوحة التحكم | شركة الرمز العقارية';
  }, []);

  const data = viewMode === 'weekly' ? weeklyData : annualData;

  // Helper to find a metric by name
  const getMetric = (name: string) => {
    return data.performanceMetrics.find(m => m.name === name);
  };

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
              value={`${getMetric('جودة التسليم')?.value}%`}
              icon={<ShieldCheck className="text-red-500 h-6 w-6" />}
              change={getMetric('جودة التسليم')?.change}
              isPositive={getMetric('جودة التسليم')?.isPositive}
              subtitle={`الهدف: ${getMetric('جودة التسليم')?.target}%`}
              color="red"
              targetAchieved={getMetric('جودة التسليم')?.targetAchieved}
            />
            <StatCard
              title="نسبة الترشيح للعملاء القدامى"
              value={`${getMetric('نسبة الترشيح للعملاء القدامى')?.value}%`}
              icon={<Users className="text-red-500 h-6 w-6" />}
              change={getMetric('نسبة الترشيح للعملاء القدامى')?.change}
              isPositive={getMetric('نسبة الترشيح للعملاء القدامى')?.isPositive}
              subtitle={`الهدف: ${getMetric('نسبة الترشيح للعملاء القدامى')?.target}%`}
              color="red"
              targetAchieved={getMetric('نسبة الترشيح للعملاء القدامى')?.targetAchieved}
            />
            <StatCard
              title="نسبة الترشيح بعد السنة"
              value={`${getMetric('نسبة الترشيح بعد السنة')?.value}%`}
              icon={<UserCheck className="text-red-500 h-6 w-6" />}
              change={getMetric('نسبة الترشيح بعد السنة')?.change}
              isPositive={getMetric('نسبة الترشيح بعد السنة')?.isPositive}
              subtitle={`الهدف: ${getMetric('نسبة الترشيح بعد السنة')?.target}%`}
              color="red"
              targetAchieved={getMetric('نسبة الترشيح بعد السنة')?.targetAchieved}
            />
            <StatCard
              title="نسبة الترشيح للعملاء الجدد"
              value={`${getMetric('نسبة الترشيح للعملاء الجدد')?.value}%`}
              icon={<Users className="text-red-500 h-6 w-6" />}
              change={getMetric('نسبة الترشيح للعملاء الجدد')?.change}
              isPositive={getMetric('نسبة الترشيح للعملاء الجدد')?.isPositive}
              subtitle={`الهدف: ${getMetric('نسبة الترشيح للعملاء الجدد')?.target}%`}
              color="red"
              targetAchieved={getMetric('نسبة الترشيح للعملاء الجدد')?.targetAchieved}
            />
            
            {/* Row 2 */}
            <StatCard
              title="راحة العميل (CSAT)"
              value={`${getMetric('راحة العميل (CSAT)')?.value}%`}
              icon={<Users className="text-red-500 h-6 w-6" />}
              change={getMetric('راحة العميل (CSAT)')?.change}
              isPositive={getMetric('راحة العميل (CSAT)')?.isPositive}
              subtitle={`الهدف: ${getMetric('راحة العميل (CSAT)')?.target}%`}
              color="red"
              targetAchieved={getMetric('راحة العميل (CSAT)')?.targetAchieved}
            />
            <StatCard
              title="معدل الرد على المكالمات"
              value={`${getMetric('معدل الرد على المكالمات')?.value}%`}
              icon={<Phone className="text-green-500 h-6 w-6" />}
              change={getMetric('معدل الرد على المكالمات')?.change}
              isPositive={getMetric('معدل الرد على المكالمات')?.isPositive}
              subtitle={`الهدف: ${getMetric('معدل الرد على المكالمات')?.target}%`}
              color="green"
              targetAchieved={getMetric('معدل الرد على المكالمات')?.targetAchieved}
            />
            <StatCard
              title="عدد التوالي للرد"
              value={getMetric('عدد التوالي للرد')?.value || 0}
              icon={<Activity className="text-red-500 h-6 w-6" />}
              change={getMetric('عدد التوالي للرد')?.change}
              isPositive={getMetric('عدد التوالي للرد')?.isPositive}
              subtitle={`الهدف: ${getMetric('عدد التوالي للرد')?.target} توالي`}
              color="red"
              targetAchieved={getMetric('عدد التوالي للرد')?.targetAchieved}
            />
            <StatCard
              title="جودة الصيانة"
              value={`${getMetric('جودة الصيانة')?.value}%`}
              icon={<ShieldCheck className="text-red-500 h-6 w-6" />}
              change={getMetric('جودة الصيانة')?.change}
              isPositive={getMetric('جودة الصيانة')?.isPositive}
              subtitle={`الهدف: ${getMetric('جودة الصيانة')?.target}%`}
              color="red"
              targetAchieved={getMetric('جودة الصيانة')?.targetAchieved}
            />
            
            {/* Row 3 */}
            <StatCard
              title="معدل التحول"
              value={`${getMetric('معدل التحول')?.value}%`}
              icon={<Percent className="text-green-500 h-6 w-6" />}
              change={getMetric('معدل التحول')?.change}
              isPositive={getMetric('معدل التحول')?.isPositive}
              subtitle={`الهدف: ${getMetric('معدل التحول')?.target}%`}
              color="green"
              targetAchieved={getMetric('معدل التحول')?.targetAchieved}
            />
            <StatCard
              title="جودة إدارة المرافق"
              value={`${getMetric('جودة إدارة المرافق')?.value}%`}
              icon={<Building className="text-green-500 h-6 w-6" />}
              change={getMetric('جودة إدارة المرافق')?.change}
              isPositive={getMetric('جودة إدارة المرافق')?.isPositive}
              subtitle={`الهدف: ${getMetric('جودة إدارة المرافق')?.target}%`}
              color="green"
              targetAchieved={getMetric('جودة إدارة المرافق')?.targetAchieved}
            />
            <StatCard
              title="عدد إعادة فتح طلب"
              value={getMetric('عدد إعادة فتح طلب')?.value || 0}
              icon={<Clock className="text-red-500 h-6 w-6" />}
              change={getMetric('عدد إعادة فتح طلب')?.change}
              isPositive={getMetric('عدد إعادة فتح طلب')?.isPositive}
              subtitle={`الهدف: ${getMetric('عدد إعادة فتح طلب')?.target}`}
              color="red"
              targetAchieved={getMetric('عدد إعادة فتح طلب')?.targetAchieved}
            />
            <StatCard
              title="سرعة إغلاق طلبات الصيانة"
              value={`${getMetric('سرعة إغلاق طلبات الصيانة')?.value}%`}
              icon={<Clock className="text-green-500 h-6 w-6" />}
              change={getMetric('سرعة إغلاق طلبات الصيانة')?.change}
              isPositive={getMetric('سرعة إغلاق طلبات الصيانة')?.isPositive}
              subtitle={`الهدف: ${getMetric('سرعة إغلاق طلبات الصيانة')?.target} أيام`}
              color="green"
              targetAchieved={getMetric('سرعة إغلاق طلبات الصيانة')?.targetAchieved}
            />

            {/* Row 4 */}
            <StatCard
              title="المساهمة في المبيعات"
              value={`${getMetric('المساهمة في المبيعات')?.value}%`}
              icon={<Percent className="text-green-500 h-6 w-6" />}
              change={getMetric('المساهمة في المبيعات')?.change}
              isPositive={getMetric('المساهمة في المبيعات')?.isPositive}
              subtitle={`الهدف: ${getMetric('المساهمة في المبيعات')?.target}%`}
              color="green"
              targetAchieved={getMetric('المساهمة في المبيعات')?.targetAchieved}
            />
            <StatCard
              title="عدد العملاء المرشحين"
              value={getMetric('عدد العملاء المرشحين')?.value || 0}
              icon={<Users className="text-green-500 h-6 w-6" />}
              change={getMetric('عدد العملاء المرشحين')?.change}
              isPositive={getMetric('عدد العملاء المرشحين')?.isPositive}
              subtitle={`الهدف: ${getMetric('عدد العملاء المرشحين')?.target}`}
              color="green"
              targetAchieved={getMetric('عدد العملاء المرشحين')?.targetAchieved}
            />
            <StatCard
              title="نسبة الرضا عن التسليم"
              value={`${getMetric('نسبة الرضا عن التسليم')?.value}%`}
              icon={<UserCheck className="text-red-500 h-6 w-6" />}
              change={getMetric('نسبة الرضا عن التسليم')?.change}
              isPositive={getMetric('نسبة الرضا عن التسليم')?.isPositive}
              subtitle={`الهدف: ${getMetric('نسبة الرضا عن التسليم')?.target}%`}
              color="red"
              targetAchieved={getMetric('نسبة الرضا عن التسليم')?.targetAchieved}
            />
          </div>
        </div>

        <div>
          <h2 className="text-right text-xl font-semibold mb-4">خدمة العملاء {viewMode === 'weekly' ? 'الأسبوعية' : 'السنوية'}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Customer Service Metrics */}
            <div className="bg-card rounded-md p-4">
              <h3 className="text-lg font-semibold mb-4 text-right">المكالمات</h3>
              <div className="space-y-3">
                {data.customerMetrics.calls.map((item) => (
                  <div key={item.id} className="flex justify-between items-center">
                    <span className="text-lg font-semibold">{item.value}</span>
                    <span className="text-muted-foreground">{item.name}</span>
                  </div>
                ))}
                <div className="border-t border-border mt-3 pt-3 flex justify-between items-center">
                  <span className="text-xl font-bold">
                    {data.customerMetrics.calls.reduce((sum, item) => sum + item.value, 0)}
                  </span>
                  <span className="text-lg font-semibold">إجمالي المكالمات</span>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-md p-4">
              <h3 className="text-lg font-semibold mb-4 text-right">الاستفسارات</h3>
              <div className="space-y-3">
                {data.customerMetrics.inquiries.map((item) => (
                  <div key={item.id} className="flex justify-between items-center">
                    <span className="text-lg font-semibold">{item.value}</span>
                    <span className="text-muted-foreground">{item.name}</span>
                  </div>
                ))}
                <div className="border-t border-border mt-3 pt-3 flex justify-between items-center">
                  <span className="text-xl font-bold">
                    {data.customerMetrics.inquiries.reduce((sum, item) => sum + item.value, 0)}
                  </span>
                  <span className="text-lg font-semibold">إجمالي الاستفسارات</span>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-md p-4">
              <h3 className="text-lg font-semibold mb-4 text-right">حالة طلبات الصيانة</h3>
              <div className="space-y-3">
                {data.customerMetrics.maintenance.map((item) => (
                  <div key={item.id} className="flex justify-between items-center">
                    <span className="text-lg font-semibold">{item.value}</span>
                    <span className="text-muted-foreground">{item.name}</span>
                  </div>
                ))}
                <div className="border-t border-border mt-3 pt-3 flex justify-between items-center">
                  <span className="text-xl font-bold">
                    {data.customerMetrics.maintenance.reduce((sum, item) => sum + item.value, 0)}
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
            {data.customerSatisfaction.map((item) => (
              <div key={item.id} className="bg-[#423b1c] rounded-md p-6 text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 bg-[#423b1c] rounded-full flex items-center justify-center">
                    <span className="text-2xl">😐</span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-[#d4b72c] mb-2">{item.totalScore.toFixed(1)}%</h3>
                <p className="text-sm text-[#d4b72c]">{item.category}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Client Comments Section */}
        <div className="mt-8">
          <h2 className="text-right text-xl font-semibold mb-4">ملاحظات العملاء</h2>
          <div className="bg-card rounded-md p-6">
            <textarea
              className="w-full h-32 bg-secondary border border-border rounded-md p-3 text-right"
              placeholder="أضف تعليقاتك هنا..."
            />
            <div className="flex justify-start mt-4">
              <button className="bg-primary text-white px-4 py-2 rounded-md">
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
