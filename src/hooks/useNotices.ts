import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Notice {
  id: string;
  title: string;
  content: string;
  type: string;
  priority: number;
  author_id: string;
  target_audience: string;
  is_published: boolean;
  publish_date: string;
  expire_date: string;
  attachments: any;
  created_at: string;
  updated_at: string;
}

export const useNotices = () => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchNotices = async () => {
    try {
      const { data, error } = await supabase
        .from('notices')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotices(data as Notice[] || []);
    } catch (error: any) {
      toast({
        title: "Error loading notices",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createNotice = async (noticeData: any) => {
    try {
      const { data, error } = await supabase
        .from('notices')
        .insert(noticeData)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Notice created successfully",
        description: "The notice has been published.",
      });

      await fetchNotices();
      return { success: true, data };
    } catch (error: any) {
      toast({
        title: "Error creating notice",
        description: error.message,
        variant: "destructive"
      });
      return { success: false, error };
    }
  };

  const updateNotice = async (id: string, updates: any) => {
    try {
      const { data, error } = await supabase
        .from('notices')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Notice updated successfully",
        description: "The notice has been updated.",
      });

      await fetchNotices();
      return { success: true, data };
    } catch (error: any) {
      toast({
        title: "Error updating notice",
        description: error.message,
        variant: "destructive"
      });
      return { success: false, error };
    }
  };

  const deleteNotice = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notices')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Notice deleted successfully",
        description: "The notice has been removed.",
      });

      await fetchNotices();
      return { success: true };
    } catch (error: any) {
      toast({
        title: "Error deleting notice",
        description: error.message,
        variant: "destructive"
      });
      return { success: false, error };
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  return {
    notices,
    loading,
    fetchNotices,
    createNotice,
    updateNotice,
    deleteNotice
  };
};