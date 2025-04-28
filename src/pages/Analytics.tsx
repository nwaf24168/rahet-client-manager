
import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Layout from '../components/Layout';
import ViewToggle from '../components/ViewToggle';
import { useData } from '../contexts/DataContext';
import { AnalyticsType } from '../types';

const Analytics = () => {
  const { viewMode } = useData();
  const [activeTab, setActiveTab] = useState<AnalyticsType>('customerSatisfaction');

  // Mock data for NPS
  const npsData = {
    new: { weekly: 63.8, annual: 70.2 },
    afterYear: { weekly: 64.8, annual: 67.5 },
    old: { weekly: 33.8, annual: 42.3 },
  };

  // Mock data for weekly trend chart
  const weeklyTrendData = [
    { week: 'الأسبوع 1', new: 60, afterYear: 61, old: 30, average: 50 },
    { week: 'الأسبوع 2', new: 62, afterYear: 63, old: 32, average: 52 },
    { week: 'الأسبوع 3', new: 65, afterYear: 64, old: 36, average: 55 },
    { week: 'الأسبوع 4', new: 68, afterYear: 67, old: 37, average: 57 },
  ];

  return (
    <Layout title="تحليلات الأداء والنتائج">
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center mb-6">
          <ViewToggle />
        </div>

        <div className="bg-card rounded-md p-4 mb-6">
          <div className="flex justify-center items-center border-b border-border mb-6">
            <button 
              className={`px-6 py-3 text-center ${activeTab === 'customerSatisfaction' ? 'border-b-2 border-primary' : ''}`}
              onClick={() => setActiveTab('customerSatisfaction')}
            >
              تحليلات رضا العملاء
            </button>
            <button 
              className={`px-6 py-3 text-center ${activeTab === 'customerService' ? 'border-b-2 border-primary' : ''}`}
              onClick={() => setActiveTab('customerService')}
            >
              تحليلات خدمة العملاء
            </button>
            <button 
              className={`px-6 py-3 text-center ${activeTab === 'nps' ? 'border-b-2 border-primary' : ''}`}
              onClick={() => setActiveTab('nps')}
            >
              مؤشرات NPS والتوجيه
            </button>
          </div>

          {/* NPS Analytics */}
          {activeTab === 'nps' && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-secondary rounded-md p-6">
                  <h3 className="text-center text-lg mb-4">عملاء جدد - NPS متوسط</h3>
                  <p className="text-center text-3xl font-bold text-green-500">
                    {npsData.new[viewMode]}%
                  </p>
                </div>
                
                <div className="bg-secondary rounded-md p-6">
                  <h3 className="text-center text-lg mb-4">بعد السنة - NPS متوسط</h3>
                  <p className="text-center text-3xl font-bold text-blue-500">
                    {npsData.afterYear[viewMode]}%
                  </p>
                </div>
                
                <div className="bg-secondary rounded-md p-6">
                  <h3 className="text-center text-lg mb-4">عملاء قدامى - NPS متوسط</h3>
                  <p className="text-center text-3xl font-bold text-purple-500">
                    {npsData.old[viewMode]}%
                  </p>
                </div>
              </div>

              <div className="bg-secondary rounded-md p-6 mb-10">
                <h3 className="text-right text-lg mb-6">أسبوعي - NPS تطور مؤشر</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={weeklyTrendData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="week" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="average" stroke="#8884d8" name="المتوسط" />
                      <Line type="monotone" dataKey="new" stroke="#4ade80" name="عملاء جدد" />
                      <Line type="monotone" dataKey="afterYear" stroke="#3b82f6" name="بعد السنة الأولى" />
                      <Line type="monotone" dataKey="old" stroke="#a855f7" name="عملاء قدامى" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-secondary rounded-md p-6">
                <h3 className="text-right text-lg mb-6">تحليل الجودة الشامل - أسبوعي</h3>
                <div className="h-64 flex items-center justify-center">
                  <p className="text-muted-foreground">البيانات غير متوفرة حالياً</p>
                </div>
              </div>
            </div>
          )}

          {/* Customer Satisfaction Analytics */}
          {activeTab === 'customerSatisfaction' && (
            <div>
              <div className="bg-secondary rounded-md p-6 mb-6">
                <h3 className="text-right text-lg mb-6">تحليل مستوى رضا العملاء</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="text-center mb-4">الحل من أول مرة</h4>
                    <div className="bg-[#423b1c] rounded-md p-6">
                      <div className="flex flex-col items-center">
                        <span className="text-2xl mb-2">😐</span>
                        <span className="text-2xl font-bold text-[#d4b72c]">74.0%</span>
                      </div>
                      <div className="mt-4 space-y-2">
                        <div className="flex justify-between">
                          <span>35%</span>
                          <span>راضي جداً</span>
                        </div>
                        <div className="flex justify-between">
                          <span>38%</span>
                          <span>راضي</span>
                        </div>
                        <div className="flex justify-between">
                          <span>18%</span>
                          <span>محايد</span>
                        </div>
                        <div className="flex justify-between">
                          <span>6%</span>
                          <span>غير راضي</span>
                        </div>
                        <div className="flex justify-between">
                          <span>3%</span>
                          <span>غير راضي جداً</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-center mb-4">وقت الإغلاق</h4>
                    <div className="bg-[#423b1c] rounded-md p-6">
                      <div className="flex flex-col items-center">
                        <span className="text-2xl mb-2">😐</span>
                        <span className="text-2xl font-bold text-[#d4b72c]">70.5%</span>
                      </div>
                      <div className="mt-4 space-y-2">
                        <div className="flex justify-between">
                          <span>25%</span>
                          <span>راضي جداً</span>
                        </div>
                        <div className="flex justify-between">
                          <span>45%</span>
                          <span>راضي</span>
                        </div>
                        <div className="flex justify-between">
                          <span>20%</span>
                          <span>محايد</span>
                        </div>
                        <div className="flex justify-between">
                          <span>7%</span>
                          <span>غير راضي</span>
                        </div>
                        <div className="flex justify-between">
                          <span>3%</span>
                          <span>غير راضي جداً</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-center mb-4">جودة الخدمة</h4>
                    <div className="bg-[#423b1c] rounded-md p-6">
                      <div className="flex flex-col items-center">
                        <span className="text-2xl mb-2">😐</span>
                        <span className="text-2xl font-bold text-[#d4b72c]">72.0%</span>
                      </div>
                      <div className="mt-4 space-y-2">
                        <div className="flex justify-between">
                          <span>30%</span>
                          <span>راضي جداً</span>
                        </div>
                        <div className="flex justify-between">
                          <span>40%</span>
                          <span>راضي</span>
                        </div>
                        <div className="flex justify-between">
                          <span>20%</span>
                          <span>محايد</span>
                        </div>
                        <div className="flex justify-between">
                          <span>8%</span>
                          <span>غير راضي</span>
                        </div>
                        <div className="flex justify-between">
                          <span>2%</span>
                          <span>غير راضي جداً</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-secondary rounded-md p-6">
                <h3 className="text-right text-lg mb-6">تطور مستوى رضا العملاء</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={[
                        { month: 'يناير', satisfaction: 68 },
                        { month: 'فبراير', satisfaction: 70 },
                        { month: 'مارس', satisfaction: 72 },
                        { month: 'أبريل', satisfaction: 74 },
                      ]}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="satisfaction" stroke="#d4b72c" name="مستوى الرضا %" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* Customer Service Analytics */}
          {activeTab === 'customerService' && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-secondary rounded-md p-6">
                  <h3 className="text-right text-lg mb-6">توزيع المكالمات</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={[
                          { day: 'السبت', calls: 25 },
                          { day: 'الأحد', calls: 40 },
                          { day: 'الإثنين', calls: 35 },
                          { day: 'الثلاثاء', calls: 28 },
                          { day: 'الأربعاء', calls: 32 },
                          { day: 'الخميس', calls: 20 },
                          { day: 'الجمعة', calls: 15 },
                        ]}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="calls" stroke="#3b82f6" name="عدد المكالمات" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-secondary rounded-md p-6">
                  <h3 className="text-right text-lg mb-6">نوع الاستفسارات</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={[
                          { type: 'عامة', count: 31 },
                          { type: 'وثائق', count: 0 },
                          { type: 'صكوك', count: 2 },
                          { type: 'تأجير', count: 9 },
                          { type: 'مشاريع', count: 4 },
                        ]}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="type" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="count" stroke="#4ade80" name="عدد الاستفسارات" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              <div className="bg-secondary rounded-md p-6">
                <h3 className="text-right text-lg mb-6">معدل الاستجابة للطلبات (أيام)</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={[
                        { week: 'الأسبوع 1', response: 2.5 },
                        { week: 'الأسبوع 2', response: 2.3 },
                        { week: 'الأسبوع 3', response: 2.1 },
                        { week: 'الأسبوع 4', response: 2.0 },
                      ]}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="week" />
                      <YAxis domain={[0, 5]} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="response" stroke="#a855f7" name="معدل الاستجابة (أيام)" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Analytics;
