
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Calendar, User } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ComplaintAction {
  id: string;
  complaint_id: string;
  action_type: string;
  action_details: string;
  modified_by: string;
  created_at: string;
}

interface ComplaintActionsProps {
  complaintId: string;
}

const ComplaintActions = ({ complaintId }: ComplaintActionsProps) => {
  const [actions, setActions] = useState<ComplaintAction[]>([]);

  useEffect(() => {
    const fetchActions = async () => {
      const { data, error } = await supabase
        .from('complaint_actions')
        .select('*')
        .eq('complaint_id', complaintId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching complaint actions:', error);
        return;
      }

      setActions(data);
    };

    fetchActions();
  }, [complaintId]);

  if (actions.length === 0) {
    return null;
  }

  return (
    <div className="bg-secondary rounded-md p-4 mb-6">
      <h3 className="text-right mb-4 text-muted-foreground flex items-center justify-end gap-2">
        <span>سجل الإجراءات</span>
      </h3>
      
      <div className="space-y-4">
        {actions.map((action) => (
          <div key={action.id} className="border-b border-border pb-4 last:border-0 last:pb-0">
            <div className="flex justify-between items-start gap-4 mb-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span dir="ltr">{new Date(action.created_at).toLocaleString('ar-SA')}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span>{action.modified_by}</span>
                <User className="h-4 w-4" />
              </div>
            </div>
            <p className="text-right text-sm mt-1">{action.action_details}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ComplaintActions;
