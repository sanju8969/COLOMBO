import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface DashboardStats {
  students: number;
  faculty: number;
  departments: number;
  courses: number;
  pendingAdmissions: number;
  activeNotices: number;
}

export const useDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    students: 0,
    faculty: 0,
    departments: 0,
    courses: 0,
    pendingAdmissions: 0,
    activeNotices: 0
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchStats = async () => {
    try {
      const [
        studentsResult,
        facultyResult,
        departmentsResult,
        coursesResult,
        admissionsResult,
        noticesResult
      ] = await Promise.all([
        supabase.from('students').select('*', { count: 'exact', head: true }),
        supabase.from('faculty').select('*', { count: 'exact', head: true }),
        supabase.from('departments').select('*', { count: 'exact', head: true }),
        supabase.from('courses').select('*', { count: 'exact', head: true }),
        supabase.from('admissions').select('*', { count: 'exact', head: true }).eq('application_status', 'pending'),
        supabase.from('notices').select('*', { count: 'exact', head: true }).eq('is_published', true)
      ]);

      setStats({
        students: studentsResult.count || 0,
        faculty: facultyResult.count || 0,
        departments: departmentsResult.count || 0,
        courses: coursesResult.count || 0,
        pendingAdmissions: admissionsResult.count || 0,
        activeNotices: noticesResult.count || 0
      });
    } catch (error: any) {
      toast({
        title: "Error loading dashboard stats",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return { stats, loading, refreshStats: fetchStats };
};