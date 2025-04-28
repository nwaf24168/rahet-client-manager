
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ViewMode } from '@/types';

export const useMetrics = (viewMode: ViewMode) => {
  const queryClient = useQueryClient();

  const { data: performanceMetrics, isLoading: isLoadingPerformance } = useQuery({
    queryKey: ['performanceMetrics', viewMode],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('performance_metrics')
        .select('*')
        .eq('period_type', viewMode);
      
      if (error) {
        toast.error('خطأ في تحميل البيانات');
        throw error;
      }
      
      return data;
    }
  });

  const { data: customerServiceMetrics, isLoading: isLoadingService } = useQuery({
    queryKey: ['customerServiceMetrics', viewMode],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('customer_service_metrics')
        .select('*')
        .eq('period_type', viewMode);
      
      if (error) {
        toast.error('خطأ في تحميل البيانات');
        throw error;
      }
      
      return data;
    }
  });

  const { data: customerSatisfaction, isLoading: isLoadingSatisfaction } = useQuery({
    queryKey: ['customerSatisfaction', viewMode],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('customer_satisfaction')
        .select('*')
        .eq('period_type', viewMode);
      
      if (error) {
        toast.error('خطأ في تحميل البيانات');
        throw error;
      }
      
      return data;
    }
  });

  const updateMetric = useMutation({
    mutationFn: async ({ table, data }: { table: string; data: any }) => {
      const { error } = await supabase
        .from(table)
        .upsert(data);
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('تم تحديث البيانات بنجاح');
      queryClient.invalidateQueries({ queryKey: ['performanceMetrics'] });
      queryClient.invalidateQueries({ queryKey: ['customerServiceMetrics'] });
      queryClient.invalidateQueries({ queryKey: ['customerSatisfaction'] });
    },
    onError: () => {
      toast.error('حدث خطأ أثناء تحديث البيانات');
    }
  });

  return {
    performanceMetrics,
    customerServiceMetrics,
    customerSatisfaction,
    isLoading: isLoadingPerformance || isLoadingService || isLoadingSatisfaction,
    updateMetric
  };
};
