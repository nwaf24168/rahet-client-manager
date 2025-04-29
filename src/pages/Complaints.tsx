
import { useState } from 'react';
import Layout from '../components/Layout';
import { useData } from '../contexts/DataContext';
import { Complaint } from '../types';
import { 
  Eye, 
  Edit, 
  Trash, 
  Plus, 
  Search, 
  Filter, 
  User,
  Users,
  MessageCircle,
  Home,
  Calendar,
  File,
  Check,
  Building,
  Clock
} from 'lucide-react';
import { toast } from 'sonner';
import ComplaintActions from '@/components/ComplaintActions';

const Complaints = () => {
  const { weeklyData, addComplaint, updateComplaint, deleteComplaint } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('جميع الحالات');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [currentUser] = useState('نواف'); // Default user for modifications
  
  const [newComplaint, setNewComplaint] = useState<Partial<Complaint>>({
    customerName: '',
    project: '',
    date: new Date().toISOString().split('T')[0],
    status: 'تم حلها',
    source: '',
    details: '',
    action: '',
    unitNumber: ''
  });

  const filteredComplaints = weeklyData.complaints.filter(complaint => {
    const matchesSearch = 
      complaint.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.number.includes(searchTerm);
    
    const matchesStatus = statusFilter === 'جميع الحالات' || complaint.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const statusOptions = [
    'جميع الحالات',
    'تم حلها',
    'تحت المعالجة',
    'لم يتم حلها'
  ];

  const sourceOptions = [
    'الاستبيان',
    'البريد الإلكتروني',
    'الهاتف',
    'تطبيق الجوال',
    'الموقع الإلكتروني'
  ];

  const projectOptions = [
    'تل الرمال المالية',
    'المعالي',
    'النخيل',
    '19',
    '41'
  ];

  const handleViewComplaint = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
    setIsViewModalOpen(true);
  };

  const handleEditComplaint = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
    setIsEditModalOpen(true);
  };

  const handleDeleteComplaint = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذه الشكوى؟')) {
      deleteComplaint(id, currentUser);
    }
  };

  const handleSaveNewComplaint = () => {
    if (!newComplaint.customerName || !newComplaint.date) {
      toast.error('الرجاء إدخال البيانات المطلوبة');
      return;
    }

    const complaintToAdd: Complaint = {
      id: `comp${weeklyData.complaints.length + 1}`,
      number: `${1011 + weeklyData.complaints.length}`,
      date: newComplaint.date || new Date().toISOString().split('T')[0],
      customerName: newComplaint.customerName || '',
      project: newComplaint.project || '',
      status: newComplaint.status || 'تم حلها',
      source: newComplaint.source || 'الاستبيان',
      details: newComplaint.details || '',
      action: newComplaint.action || '',
      unitNumber: newComplaint.unitNumber
    };

    addComplaint(complaintToAdd);
    setNewComplaint({
      customerName: '',
      project: '',
      date: new Date().toISOString().split('T')[0],
      status: 'تم حلها',
      source: '',
      details: '',
      action: '',
      unitNumber: ''
    });
    setIsAddModalOpen(false);
  };

  const handleSaveEditedComplaint = () => {
    if (!selectedComplaint) return;
    
    updateComplaint(selectedComplaint, currentUser);
    setIsEditModalOpen(false);
  };

  return (
    <Layout title="سجل الشكاوى والطلبات">
      <div className="bg-card rounded-md p-6">
        <div className="flex justify-between items-center mb-6">
          <button
            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
            onClick={() => setIsAddModalOpen(true)}
          >
            <Plus className="h-5 w-5" />
            إضافة شكوى جديدة
          </button>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute top-2.5 left-3 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="بحث عن عميل، مشروع، أو شكوى..."
                className="pl-10 pr-4 py-2 bg-secondary border border-border rounded-md w-64 text-right"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="relative">
              <Filter className="absolute top-2.5 left-3 h-4 w-4 text-muted-foreground" />
              <select
                className="pl-10 pr-4 py-2 bg-secondary border border-border rounded-md appearance-none w-40 text-right"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                {statusOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead className="border-b border-border">
              <tr className="text-muted-foreground text-right">
                <th className="pb-3">رقم الشكوى</th>
                <th className="pb-3">التاريخ</th>
                <th className="pb-3">اسم العميل</th>
                <th className="pb-3">المشروع</th>
                <th className="pb-3">الحالة</th>
                <th className="pb-3 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredComplaints.length > 0 ? (
                filteredComplaints.map((complaint) => (
                  <tr key={complaint.id} className="border-b border-border">
                    <td className="py-4 text-right">{complaint.number}</td>
                    <td className="py-4 text-right">{complaint.date}</td>
                    <td className="py-4 text-right">{complaint.customerName}</td>
                    <td className="py-4 text-right">{complaint.project}</td>
                    <td className="py-4 text-right">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                        complaint.status === 'تم حلها' 
                          ? 'bg-green-950/20 text-green-500' 
                          : complaint.status === 'تحت المعالجة'
                          ? 'bg-yellow-950/20 text-yellow-500'
                          : 'bg-red-950/20 text-red-500'
                      }`}>
                        {complaint.status}
                      </span>
                    </td>
                    <td className="py-4 flex justify-center gap-2">
                      <button 
                        className="text-foreground hover:text-primary transition-colors"
                        onClick={() => handleViewComplaint(complaint)}
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                      <button 
                        className="text-foreground hover:text-primary transition-colors"
                        onClick={() => handleEditComplaint(complaint)}
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button 
                        className="text-foreground hover:text-destructive transition-colors"
                        onClick={() => handleDeleteComplaint(complaint.id)}
                      >
                        <Trash className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-4 text-center text-muted-foreground">
                    لا توجد شكاوى مطابقة للبحث
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card rounded-lg p-6 w-full max-w-3xl mx-4">
            <h2 className="text-xl font-bold mb-4 text-right">إضافة شكوى جديدة</h2>
            <p className="text-muted-foreground mb-6 text-right">أدخل بيانات الشكوى لإضافتها إلى السجل وتعيين رقم تذكرة جديد</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium mb-1 text-right">اسم العميل</label>
                <input 
                  type="text" 
                  className="w-full bg-background border border-border rounded-md p-2 text-right" 
                  value={newComplaint.customerName}
                  onChange={(e) => setNewComplaint({...newComplaint, customerName: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1 text-right">التاريخ</label>
                <input 
                  type="date" 
                  className="w-full bg-background border border-border rounded-md p-2 ltr" 
                  value={newComplaint.date}
                  onChange={(e) => setNewComplaint({...newComplaint, date: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-right">رقم الوحدة / العمارة</label>
                <input 
                  type="text" 
                  className="w-full bg-background border border-border rounded-md p-2 text-right" 
                  value={newComplaint.unitNumber || ''}
                  onChange={(e) => setNewComplaint({...newComplaint, unitNumber: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1 text-right">المشروع</label>
                <select 
                  className="w-full bg-background border border-border rounded-md p-2 text-right"
                  value={newComplaint.project}
                  onChange={(e) => setNewComplaint({...newComplaint, project: e.target.value})}
                >
                  <option value="">اختر المشروع</option>
                  {projectOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1 text-right">مصدر الشكوى</label>
                <select 
                  className="w-full bg-background border border-border rounded-md p-2 text-right"
                  value={newComplaint.source}
                  onChange={(e) => setNewComplaint({...newComplaint, source: e.target.value})}
                >
                  {sourceOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1 text-right">الحالة</label>
                <select 
                  className="w-full bg-background border border-border rounded-md p-2 text-right"
                  value={newComplaint.status}
                  onChange={(e) => setNewComplaint({...newComplaint, status: e.target.value})}
                >
                  {statusOptions.slice(1).map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium mb-1 text-right">تفاصيل الشكوى</label>
              <textarea 
                className="w-full h-24 bg-background border border-border rounded-md p-2 text-right" 
                placeholder="يرجى كتابة تفاصيل الشكوى بشكل واضح ودقيق"
                value={newComplaint.details}
                onChange={(e) => setNewComplaint({...newComplaint, details: e.target.value})}
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium mb-1 text-right">الإجراء المتخذ</label>
              <textarea 
                className="w-full h-24 bg-background border border-border rounded-md p-2 text-right" 
                placeholder="أدخل الإجراء المتخذ (إن وجد)"
                value={newComplaint.action}
                onChange={(e) => setNewComplaint({...newComplaint, action: e.target.value})}
              />
            </div>
            
            <div className="flex justify-start gap-4 mt-6">
              <button 
                className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                onClick={handleSaveNewComplaint}
              >
                إضافة الشكوى
              </button>
              <button 
                className="px-6 py-2 bg-secondary text-foreground rounded-md hover:bg-secondary/80 transition-colors"
                onClick={() => setIsAddModalOpen(false)}
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {isViewModalOpen && selectedComplaint && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card rounded-lg p-6 w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <button 
                onClick={() => setIsViewModalOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                &times;
              </button>
              <h2 className="text-xl font-bold text-right">تفاصيل الشكوى #{selectedComplaint.number}</h2>
            </div>
            
            <div className="flex justify-end mb-4">
              <span className={`inline-block px-3 py-1 rounded-full text-sm ${
                selectedComplaint.status === 'تم حلها' 
                  ? 'bg-green-950/20 text-green-500' 
                  : selectedComplaint.status === 'تحت المعالجة'
                  ? 'bg-yellow-950/20 text-yellow-500'
                  : 'bg-red-950/20 text-red-500'
              }`}>
                {selectedComplaint.status}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-secondary rounded-md p-4">
                <h3 className="text-right mb-4 text-muted-foreground flex items-center justify-end gap-2">
                  <span>معلومات العميل والمشروع</span>
                  <Users className="h-5 w-5" />
                </h3>
                
                <div className="flex flex-col gap-4">
                  <div className="text-right flex items-center justify-end gap-2">
                    <h4 className="font-medium">اسم العميل</h4>
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <p className="text-right">{selectedComplaint.customerName}</p>
                  
                  <div className="text-right flex items-center justify-end gap-2">
                    <h4 className="font-medium">المشروع</h4>
                    <Building className="h-5 w-5 text-primary" />
                  </div>
                  <p className="text-right">{selectedComplaint.project}</p>
                  
                  <div className="text-right flex items-center justify-end gap-2">
                    <h4 className="font-medium">رقم الوحدة</h4>
                    <Home className="h-5 w-5 text-primary" />
                  </div>
                  <p className="text-right">{selectedComplaint.unitNumber || '-'}</p>
                  
                  <div className="text-right flex items-center justify-end gap-2">
                    <h4 className="font-medium">مصدر الشكوى</h4>
                    <MessageCircle className="h-5 w-5 text-primary" />
                  </div>
                  <p className="text-right">{selectedComplaint.source}</p>
                </div>
              </div>

              <div className="bg-secondary rounded-md p-4">
                <h3 className="text-right mb-4 text-muted-foreground flex items-center justify-end gap-2">
                  <span>معلومات الوقت والإنشاء</span>
                  <Clock className="h-5 w-5" />
                </h3>
                
                <div className="flex flex-col gap-4">
                  <div className="text-right flex items-center justify-end gap-2">
                    <h4 className="font-medium">المدة</h4>
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <p className="text-right">0 يوم</p>
                  
                  <div className="text-right flex items-center justify-end gap-2">
                    <h4 className="font-medium">تاريخ الإنشاء</h4>
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <p className="text-right">{selectedComplaint.date}</p>
                  
                  <div className="text-right flex items-center justify-end gap-2">
                    <h4 className="font-medium">تم استلامها بواسطة</h4>
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <p className="text-right">{currentUser}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-secondary rounded-md p-4 mb-6">
              <h3 className="text-right mb-4 text-muted-foreground flex items-center justify-end gap-2">
                <span>تفاصيل الشكوى</span>
                <File className="h-5 w-5" />
              </h3>
              <p className="text-right mb-6">{selectedComplaint.details}</p>
              
              <p className="text-muted-foreground text-sm text-right">
                يرجى كتابة تفاصيل الشكوى بشكل واضح ودقيق
              </p>
            </div>

            <div className="bg-secondary rounded-md p-4 mb-6">
              <h3 className="text-right mb-4 text-muted-foreground flex items-center justify-end gap-2">
                <span>الإجراء المتخذ</span>
                <Check className="h-5 w-5" />
              </h3>
              <p className="text-right mb-6">{selectedComplaint.action}</p>
              
              <p className="text-muted-foreground text-sm text-right">
                يرجى كتابة الإجراءات المتخذة بشكل واضح ودقيق
              </p>
            </div>

            <ComplaintActions complaintId={selectedComplaint.id} />
            
            <div className="flex justify-start">
              <button 
                className="px-6 py-2 bg-secondary text-foreground rounded-md"
                onClick={() => setIsViewModalOpen(false)}
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      {isEditModalOpen && selectedComplaint && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card rounded-lg p-6 w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                &times;
              </button>
              <h2 className="text-xl font-bold text-right">تعديل الشكوى #{selectedComplaint.number}</h2>
            </div>
            <p className="text-muted-foreground mb-6 text-right">قم بتعديل بيانات الشكوى في النموذج أدناه</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium mb-1 text-right">اسم العميل</label>
                <input 
                  type="text" 
                  className="w-full bg-background border border-border rounded-md p-2 text-right" 
                  value={selectedComplaint.customerName}
                  onChange={(e) => setSelectedComplaint({...selectedComplaint, customerName: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1 text-right">التاريخ</label>
                <input 
                  type="date" 
                  className="w-full bg-background border border-border rounded-md p-2 ltr" 
                  value={selectedComplaint.date}
                  onChange={(e) => setSelectedComplaint({...selectedComplaint, date: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-right">رقم الوحدة / العمارة</label>
                <input 
                  type="text" 
                  className="w-full bg-background border border-border rounded-md p-2 text-right" 
                  value={selectedComplaint.unitNumber || ''}
                  onChange={(e) => setSelectedComplaint({...selectedComplaint, unitNumber: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1 text-right">المشروع</label>
                <select 
                  className="w-full bg-background border border-border rounded-md p-2 text-right"
                  value={selectedComplaint.project}
                  onChange={(e) => setSelectedComplaint({...selectedComplaint, project: e.target.value})}
                >
                  <option value="">اختر المشروع</option>
                  {projectOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1 text-right">مصدر الشكوى</label>
                <select 
                  className="w-full bg-background border border-border rounded-md p-2 text-right"
                  value={selectedComplaint.source}
                  onChange={(e) => setSelectedComplaint({...selectedComplaint, source: e.target.value})}
                >
                  {sourceOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1 text-right">الحالة</label>
                <select 
                  className="w-full bg-background border border-border rounded-md p-2 text-right"
                  value={selectedComplaint.status}
                  onChange={(e) => setSelectedComplaint({...selectedComplaint, status: e.target.value})}
                >
                  {statusOptions.slice(1).map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium mb-1 text-right">تفاصيل الشكوى</label>
              <textarea 
                className="w-full h-24 bg-background border border-border rounded-md p-2 text-right" 
                value={selectedComplaint.details}
                onChange={(e) => setSelectedComplaint({...selectedComplaint, details: e.target.value})}
                placeholder="يرجى كتابة تفاصيل الشكوى بشكل واضح ودقيق"
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium mb-1 text-right">الإجراء المتخذ</label>
              <textarea 
                className="w-full h-24 bg-background border border-border rounded-md p-2 text-right" 
                value={selectedComplaint.action}
                onChange={(e) => setSelectedComplaint({...selectedComplaint, action: e.target.value})}
                placeholder="أدخل الإجراء المتخذ (إن وجد)"
              />
            </div>
            
            <div className="flex justify-start gap-4 mt-6">
              <button 
                className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                onClick={handleSaveEditedComplaint}
              >
                حفظ التعديلات
              </button>
              <button 
                className="px-6 py-2 bg-secondary text-foreground rounded-md hover:bg-secondary/80 transition-colors"
                onClick={() => setIsEditModalOpen(false)}
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Complaints;
