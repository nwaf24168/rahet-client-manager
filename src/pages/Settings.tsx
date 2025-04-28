
import { useState } from 'react';
import Layout from '../components/Layout';
import { toast } from 'sonner';
import { User } from '../types';
import { Trash, Edit } from 'lucide-react';

interface UserFormData {
  username: string;
  password: string;
  name: string;
  role: string;
}

const Settings = () => {
  const [users, setUsers] = useState<User[]>([
    { id: '1', username: 'admin', password: 'Alramz2025', name: 'admin', role: 'مدير النظام' },
    { id: '2', username: 'abdukalam', password: 'Alramz2025', name: 'abdukalam', role: 'مدير إدارة راحة العملاء' },
    { id: '3', username: 'ajjawhara', password: 'Alramz2025', name: 'ajjawhara', role: 'موظف إدارة راحة العملاء' },
    { id: '4', username: 'khulood', password: 'Alramz2025', name: 'khulood', role: 'موظف إدارة راحة العملاء' },
    { id: '5', username: 'adnan', password: 'Alramz2025', name: 'adnan', role: 'موظف إدارة راحة العملاء' },
    { id: '6', username: 'lateefa', password: 'Alramz2025', name: 'lateefa', role: 'موظف إدارة راحة العملاء' },
    { id: '7', username: 'nawaf', password: 'Alramz2025', name: 'nawaf', role: 'مدير النظام' },
  ]);
  
  const [newUser, setNewUser] = useState<UserFormData>({
    username: '',
    password: 'Alramz2025',
    name: '',
    role: 'موظف إدارة راحة العملاء'
  });

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Role options
  const roleOptions = [
    'مدير النظام',
    'مدير إدارة راحة العملاء',
    'موظف إدارة راحة العملاء'
  ];

  // Handle adding new user
  const handleAddUser = () => {
    if (!newUser.username || !newUser.name) {
      toast.error('الرجاء إدخال اسم المستخدم والاسم');
      return;
    }

    if (users.some(user => user.username === newUser.username)) {
      toast.error('اسم المستخدم موجود بالفعل');
      return;
    }

    const userToAdd: User = {
      id: `${users.length + 1}`,
      username: newUser.username,
      password: newUser.password,
      name: newUser.name,
      role: newUser.role
    };

    setUsers([...users, userToAdd]);
    toast.success('تم إضافة المستخدم بنجاح');
    
    setNewUser({
      username: '',
      password: 'Alramz2025',
      name: '',
      role: 'موظف إدارة راحة العملاء'
    });
  };

  // Handle editing user
  const handleOpenEditModal = (user: User) => {
    setEditingUser(user);
    setIsEditModalOpen(true);
  };

  const handleUpdateUser = () => {
    if (!editingUser) return;

    setUsers(users.map(user => 
      user.id === editingUser.id ? editingUser : user
    ));
    
    toast.success('تم تحديث المستخدم بنجاح');
    setIsEditModalOpen(false);
    setEditingUser(null);
  };

  // Handle deleting user
  const handleDeleteUser = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا المستخدم؟')) {
      setUsers(users.filter(user => user.id !== id));
      toast.success('تم حذف المستخدم بنجاح');
    }
  };

  return (
    <Layout title="إعدادات النظام">
      <div className="bg-card rounded-md p-6">
        <h2 className="text-xl font-semibold mb-6 text-right">إدارة المستخدمين</h2>
        <p className="text-muted-foreground mb-6 text-right">إضافة وتعديل وحذف مستخدمي النظام</p>
        
        <div className="overflow-x-auto mb-8">
          <table className="w-full table-auto">
            <thead className="border-b border-border">
              <tr className="text-muted-foreground text-right">
                <th className="pb-3">اسم المستخدم</th>
                <th className="pb-3">الصلاحية</th>
                <th className="pb-3">رمز الدخول</th>
                <th className="pb-3 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-border">
                  <td className="py-4 text-right">{user.username}</td>
                  <td className="py-4 text-right">{user.role}</td>
                  <td className="py-4 text-right">********</td>
                  <td className="py-4 flex justify-center gap-2">
                    <button 
                      className="text-foreground hover:text-primary transition-colors"
                      onClick={() => handleOpenEditModal(user)}
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button 
                      className="text-foreground hover:text-destructive transition-colors"
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      <Trash className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="bg-secondary rounded-md p-4">
          <h3 className="font-semibold mb-4 text-right">إضافة مستخدم جديد</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-right">اسم المستخدم</label>
              <input 
                type="text" 
                className="w-full bg-background border border-border rounded-md p-2 text-right" 
                value={newUser.name}
                onChange={(e) => setNewUser({...newUser, name: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1 text-right">الصلاحية</label>
              <select 
                className="w-full bg-background border border-border rounded-md p-2 text-right"
                value={newUser.role}
                onChange={(e) => setNewUser({...newUser, role: e.target.value})}
              >
                {roleOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1 text-right">اسم المستخدم (تسجيل الدخول)</label>
              <input 
                type="text" 
                className="w-full bg-background border border-border rounded-md p-2 text-right" 
                value={newUser.username}
                onChange={(e) => setNewUser({...newUser, username: e.target.value})}
              />
            </div>
          </div>
          
          <div className="flex justify-start">
            <button 
              className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
              onClick={handleAddUser}
            >
              إضافة المستخدم
            </button>
          </div>
        </div>
      </div>

      {/* Edit User Modal */}
      {isEditModalOpen && editingUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card rounded-lg p-6 w-full max-w-lg mx-4">
            <h2 className="text-xl font-bold mb-4 text-right">تعديل المستخدم</h2>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-1 text-right">اسم المستخدم</label>
                <input 
                  type="text" 
                  className="w-full bg-background border border-border rounded-md p-2 text-right" 
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1 text-right">الصلاحية</label>
                <select 
                  className="w-full bg-background border border-border rounded-md p-2 text-right"
                  value={editingUser.role}
                  onChange={(e) => setEditingUser({...editingUser, role: e.target.value})}
                >
                  {roleOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1 text-right">اسم المستخدم للدخول</label>
                <input 
                  type="text" 
                  className="w-full bg-background border border-border rounded-md p-2 text-right" 
                  value={editingUser.username}
                  onChange={(e) => setEditingUser({...editingUser, username: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1 text-right">كلمة المرور</label>
                <input 
                  type="password" 
                  className="w-full bg-background border border-border rounded-md p-2 text-right" 
                  value={editingUser.password}
                  onChange={(e) => setEditingUser({...editingUser, password: e.target.value})}
                />
              </div>
            </div>
            
            <div className="flex justify-start gap-4">
              <button 
                className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                onClick={handleUpdateUser}
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

export default Settings;
