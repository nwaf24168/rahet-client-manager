
import { useState } from 'react';
import Layout from '../components/Layout';
import ViewToggle from '../components/ViewToggle';
import { useData } from '../contexts/DataContext';
import { DataEntryTab } from '../types';
import { toast } from 'sonner';

const DataEntry = () => {
  const { viewMode, performanceMetrics, customerServiceMetrics, customerSatisfaction, updateMetric } = useData();
  const [activeTab, setActiveTab] = useState<DataEntryTab>('performanceMetrics');
  const [notes, setNotes] = useState('');

  // Performance Metrics Data Entry
  const [performanceMetricsForm, setPerformanceMetricsForm] = useState(() => {
    return (performanceMetrics || []).reduce((acc, metric) => {
      acc[metric.id] = metric.value;
      return acc;
    }, {} as Record<string, number>);
  });

  // Customer Service Data Entry
  const [customerServiceForm, setCustomerServiceForm] = useState(() => {
    const calls = customerServiceMetrics?.filter(m => m.category === 'calls') || [];
    const inquiries = customerServiceMetrics?.filter(m => m.category === 'inquiries') || [];
    const maintenance = customerServiceMetrics?.filter(m => m.category === 'maintenance') || [];
    
    return {
      calls: calls.reduce((acc, metric) => {
        acc[metric.id] = metric.value;
        return acc;
      }, {} as Record<string, number>),
      inquiries: inquiries.reduce((acc, metric) => {
        acc[metric.id] = metric.value;
        return acc;
      }, {} as Record<string, number>),
      maintenance: maintenance.reduce((acc, metric) => {
        acc[metric.id] = metric.value;
        return acc;
      }, {} as Record<string, number>),
    };
  });

  // Customer Satisfaction Data Entry
  const [customerSatisfactionForm, setCustomerSatisfactionForm] = useState(() => {
    return (customerSatisfaction || []).reduce((acc, item) => {
      acc[item.id] = {
        veryPleased: item.very_pleased,
        pleased: item.pleased,
        neutral: item.neutral,
        displeased: item.displeased,
        veryDispleased: item.very_displeased,
      };
      return acc;
    }, {} as Record<string, any>);
  });

  const handleUpdatePerformanceMetrics = () => {
    const updatedMetrics = performanceMetrics.map(metric => {
      const newValue = performanceMetricsForm[metric.id];
      
      // Calculate if target is achieved based on metric name
      const targetAchieved = 
        metric.metric_name === 'عدد التوالي للرد' || metric.metric_name === 'عدد إعادة فتح طلب' 
          ? newValue <= metric.target
          : newValue >= metric.target;
      
      return {
        ...metric,
        value: newValue,
        target_achieved: targetAchieved
      };
    });

    updatedMetrics.forEach(metric => {
      updateMetric({ 
        table: 'performance_metrics', 
        data: metric
      });
    });
    
    toast.success('تم تحديث مؤشرات الأداء بنجاح');
  };

  const handleUpdateCustomerService = () => {
    const categories = ['calls', 'inquiries', 'maintenance'];
    categories.forEach(category => {
      const metrics = customerServiceMetrics.filter(m => m.category === category);
      
      metrics.forEach(metric => {
        const updatedMetric = {
          ...metric,
          value: customerServiceForm[category][metric.id]
        };
        
        updateMetric({
          table: 'customer_service_metrics',
          data: updatedMetric
        });
      });
    });
    
    toast.success('تم تحديث بيانات خدمة العملاء بنجاح');
  };

  const handleUpdateCustomerSatisfaction = () => {
    customerSatisfaction.forEach(item => {
      const formData = customerSatisfactionForm[item.id];
      const total = formData.veryPleased + formData.pleased + formData.neutral + formData.displeased + formData.veryDispleased;
      
      // Calculate score - weighted average
      const score = total > 0 
        ? ((formData.veryPleased * 100) + (formData.pleased * 75) + (formData.neutral * 50) + (formData.displeased * 25)) / total 
        : 0;
      
      const updatedItem = {
        ...item,
        very_pleased: formData.veryPleased,
        pleased: formData.pleased,
        neutral: formData.neutral,
        displeased: formData.displeased,
        very_displeased: formData.veryDispleased,
        total_score: Math.round(score * 100) / 100
      };
      
      updateMetric({
        table: 'customer_satisfaction',
        data: updatedItem
      });
    });
    
    toast.success('تم تحديث بيانات رضا العملاء بنجاح');
  };

  const handleSubmitNotes = () => {
    if (notes.trim()) {
      updateMetric({
        table: 'notes',
        data: { content: notes }
      });
      
      toast.success('تم حفظ الملاحظات بنجاح');
      setNotes('');
    } else {
      toast.error('الرجاء إدخال ملاحظات قبل الحفظ');
    }
  };

  return (
    <Layout title="إدخال البيانات">
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center mb-6">
          <ViewToggle />
        </div>

        <div className="bg-card rounded-md p-4 mb-6">
          <div className="flex justify-center items-center border-b border-border mb-4">
            <button 
              className={`px-6 py-3 text-center ${activeTab === 'performanceMetrics' ? 'border-b-2 border-primary' : ''}`}
              onClick={() => setActiveTab('performanceMetrics')}
            >
              مؤشرات الأداء
            </button>
            <button 
              className={`px-6 py-3 text-center ${activeTab === 'customerService' ? 'border-b-2 border-primary' : ''}`}
              onClick={() => setActiveTab('customerService')}
            >
              خدمة العملاء
            </button>
            <button 
              className={`px-6 py-3 text-center ${activeTab === 'customerSatisfaction' ? 'border-b-2 border-primary' : ''}`}
              onClick={() => setActiveTab('customerSatisfaction')}
            >
              رضا العملاء
            </button>
          </div>

          {/* Performance Metrics Tab */}
          {activeTab === 'performanceMetrics' && (
            <div>
              <h3 className="text-xl font-semibold mb-4 text-right">مؤشرات الأداء الرئيسية - {viewMode === 'weekly' ? 'أسبوعي' : 'سنوي'}</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {performanceMetrics && performanceMetrics.map(metric => (
                  <div key={metric.id} className="bg-secondary rounded-md p-4">
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <span className="text-sm text-muted-foreground">{`${metric.change}% :التغيير`}</span>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">{`${metric.target} :الهدف`}</span>
                      </div>
                    </div>
                    
                    <div className="text-right mb-2">
                      <h4 className="font-medium">{metric.metric_name}</h4>
                    </div>

                    <input 
                      type="number" 
                      className="w-full bg-background border border-border rounded-md p-2 text-right" 
                      value={performanceMetricsForm[metric.id] || 0}
                      onChange={(e) => {
                        setPerformanceMetricsForm({
                          ...performanceMetricsForm,
                          [metric.id]: parseFloat(e.target.value) || 0
                        });
                      }}
                    />

                    <div className="mt-2 text-right">
                      <p className={`text-xs ${
                        metric.metric_name === 'عدد التوالي للرد' || metric.metric_name === 'عدد إعادة فتح طلب' 
                          ? (performanceMetricsForm[metric.id] || 0) <= metric.target ? 'text-positive' : 'text-negative'
                          : (performanceMetricsForm[metric.id] || 0) >= metric.target ? 'text-positive' : 'text-negative'
                      }`}>
                        {
                          metric.metric_name === 'عدد التوالي للرد' || metric.metric_name === 'عدد إعادة فتح طلب' 
                            ? (performanceMetricsForm[metric.id] || 0) <= metric.target ? 'تم تحقيق الهدف' : 'لم يتم تحقيق الهدف'
                            : (performanceMetricsForm[metric.id] || 0) >= metric.target ? 'تم تحقيق الهدف' : 'لم يتم تحقيق الهدف'
                        }
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-start">
                <button 
                  className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90 transition-colors"
                  onClick={handleUpdatePerformanceMetrics}
                >
                  حفظ التغييرات
                </button>
              </div>
            </div>
          )}

          {/* Customer Service Tab */}
          {activeTab === 'customerService' && (
            <div>
              <h3 className="text-xl font-semibold mb-4 text-right">خدمة العملاء</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-secondary rounded-md p-4">
                  <h4 className="font-medium mb-4 text-right">المكالمات</h4>
                  <div className="space-y-4">
                    {customerServiceMetrics && customerServiceMetrics
                      .filter(metric => metric.category === 'calls')
                      .map(metric => (
                      <div key={metric.id} className="flex justify-between items-center">
                        <input 
                          type="number" 
                          className="w-24 bg-background border border-border rounded-md p-2 text-right" 
                          value={customerServiceForm.calls[metric.id] || 0}
                          onChange={(e) => {
                            setCustomerServiceForm({
                              ...customerServiceForm,
                              calls: {
                                ...customerServiceForm.calls,
                                [metric.id]: parseInt(e.target.value) || 0
                              }
                            });
                          }}
                        />
                        <span className="text-muted-foreground">{metric.metric_name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-secondary rounded-md p-4">
                  <h4 className="font-medium mb-4 text-right">الاستفسارات</h4>
                  <div className="space-y-4">
                    {customerServiceMetrics && customerServiceMetrics
                      .filter(metric => metric.category === 'inquiries')
                      .map(metric => (
                      <div key={metric.id} className="flex justify-between items-center">
                        <input 
                          type="number" 
                          className="w-24 bg-background border border-border rounded-md p-2 text-right" 
                          value={customerServiceForm.inquiries[metric.id] || 0}
                          onChange={(e) => {
                            setCustomerServiceForm({
                              ...customerServiceForm,
                              inquiries: {
                                ...customerServiceForm.inquiries,
                                [metric.id]: parseInt(e.target.value) || 0
                              }
                            });
                          }}
                        />
                        <span className="text-muted-foreground">{metric.metric_name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-secondary rounded-md p-4">
                  <h4 className="font-medium mb-4 text-right">طلبات الصيانة</h4>
                  <div className="space-y-4">
                    {customerServiceMetrics && customerServiceMetrics
                      .filter(metric => metric.category === 'maintenance')
                      .map(metric => (
                      <div key={metric.id} className="flex justify-between items-center">
                        <input 
                          type="number" 
                          className="w-24 bg-background border border-border rounded-md p-2 text-right" 
                          value={customerServiceForm.maintenance[metric.id] || 0}
                          onChange={(e) => {
                            setCustomerServiceForm({
                              ...customerServiceForm,
                              maintenance: {
                                ...customerServiceForm.maintenance,
                                [metric.id]: parseInt(e.target.value) || 0
                              }
                            });
                          }}
                        />
                        <span className="text-muted-foreground">{metric.metric_name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-start">
                <button 
                  className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90 transition-colors"
                  onClick={handleUpdateCustomerService}
                >
                  حفظ التغييرات
                </button>
              </div>
            </div>
          )}

          {/* Customer Satisfaction Tab */}
          {activeTab === 'customerSatisfaction' && (
            <div>
              <h3 className="text-xl font-semibold mb-4 text-right">رضا العملاء</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {customerSatisfaction && customerSatisfaction.map(item => (
                  <div key={item.id} className="bg-secondary rounded-md p-4">
                    <h4 className="font-medium mb-4 text-right">{item.category}</h4>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <input 
                          type="number" 
                          className="w-24 bg-background border border-border rounded-md p-2 text-right" 
                          value={customerSatisfactionForm[item.id]?.veryPleased || 0}
                          onChange={(e) => {
                            setCustomerSatisfactionForm({
                              ...customerSatisfactionForm,
                              [item.id]: {
                                ...customerSatisfactionForm[item.id],
                                veryPleased: parseInt(e.target.value) || 0
                              }
                            });
                          }}
                        />
                        <span className="text-muted-foreground">راضي جداً</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <input 
                          type="number" 
                          className="w-24 bg-background border border-border rounded-md p-2 text-right" 
                          value={customerSatisfactionForm[item.id]?.pleased || 0}
                          onChange={(e) => {
                            setCustomerSatisfactionForm({
                              ...customerSatisfactionForm,
                              [item.id]: {
                                ...customerSatisfactionForm[item.id],
                                pleased: parseInt(e.target.value) || 0
                              }
                            });
                          }}
                        />
                        <span className="text-muted-foreground">راضي</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <input 
                          type="number" 
                          className="w-24 bg-background border border-border rounded-md p-2 text-right" 
                          value={customerSatisfactionForm[item.id]?.neutral || 0}
                          onChange={(e) => {
                            setCustomerSatisfactionForm({
                              ...customerSatisfactionForm,
                              [item.id]: {
                                ...customerSatisfactionForm[item.id],
                                neutral: parseInt(e.target.value) || 0
                              }
                            });
                          }}
                        />
                        <span className="text-muted-foreground">محايد</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <input 
                          type="number" 
                          className="w-24 bg-background border border-border rounded-md p-2 text-right" 
                          value={customerSatisfactionForm[item.id]?.displeased || 0}
                          onChange={(e) => {
                            setCustomerSatisfactionForm({
                              ...customerSatisfactionForm,
                              [item.id]: {
                                ...customerSatisfactionForm[item.id],
                                displeased: parseInt(e.target.value) || 0
                              }
                            });
                          }}
                        />
                        <span className="text-muted-foreground">غير راضي</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <input 
                          type="number" 
                          className="w-24 bg-background border border-border rounded-md p-2 text-right" 
                          value={customerSatisfactionForm[item.id]?.veryDispleased || 0}
                          onChange={(e) => {
                            setCustomerSatisfactionForm({
                              ...customerSatisfactionForm,
                              [item.id]: {
                                ...customerSatisfactionForm[item.id],
                                veryDispleased: parseInt(e.target.value) || 0
                              }
                            });
                          }}
                        />
                        <span className="text-muted-foreground">غير راضي جداً</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-start">
                <button 
                  className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90 transition-colors"
                  onClick={handleUpdateCustomerSatisfaction}
                >
                  حفظ التغييرات
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Notes Section */}
        <div className="mt-8">
          <h2 className="text-right text-xl font-semibold mb-4">ملاحظات</h2>
          <div className="bg-card rounded-md p-6">
            <textarea
              className="w-full h-32 bg-secondary border border-border rounded-md p-3 text-right"
              placeholder="أضف تعليقاتك هنا..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
            <div className="flex justify-start mt-4">
              <button 
                className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
                onClick={handleSubmitNotes}
              >
                تسجيل
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DataEntry;
