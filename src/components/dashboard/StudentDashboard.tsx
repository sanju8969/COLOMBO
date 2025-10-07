import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { BookOpen, Calendar, GraduationCap, Bell, User as UserIcon } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import StudentProfile from '@/components/student/StudentProfile';
import StudentCourses from '@/components/student/StudentCourses';

import { Database } from '@/integrations/supabase/types';

type ProfileRow = Database['public']['Tables']['profiles']['Row'];
type StudentRow = Database['public']['Tables']['students']['Row'];
type DepartmentRow = Database['public']['Tables']['departments']['Row'];
type CourseRow = Database['public']['Tables']['courses']['Row'];
type AssignmentRow = Database['public']['Tables']['assignments']['Row'];
type GradeRow = Database['public']['Tables']['grades']['Row'];
type NoticeRow = Database['public']['Tables']['notices']['Row'];
type EnrollmentRow = Database['public']['Tables']['enrollments']['Row'];

interface StudentProfileData extends ProfileRow {
  student_id: string | null; // Can be null if not found in students table
  departments?: Pick<DepartmentRow, 'name' | 'code'>[] | null; // Changed to array again
  current_semester: number | null;
}

interface CourseEnrollment extends EnrollmentRow {
  courses?: Pick<CourseRow, 'name' | 'code' | 'credits'> | null;
}

interface Assignment extends AssignmentRow {
  courses?: Pick<CourseRow, 'name'> | null;
}

interface GradeEnrollmentData {
  student_id: string;
  courses?: Pick<CourseRow, 'name'> | null;
}

interface Grade extends GradeRow {
  enrollments?: GradeEnrollmentData | null;
}


const StudentDashboard: React.FC = () => {
  const [profile, setProfile] = useState<StudentProfileData | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [enrollments, setEnrollments] = useState<CourseEnrollment[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [notices, setNotices] = useState<NoticeRow[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchCoreDashboardData();
  }, []);

  const fetchCoreDashboardData = async () => {
    setLoading(true);
    try {
      const user = await supabase.auth.getUser();
      if (!user.data.user) {
        throw new Error('User not authenticated');
      }
      const currentUserId = user.data.user.id;
      setUserId(currentUserId);

      // Fetch student profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select(`
          *,
          departments (name, code)
        `)
        .eq('id', currentUserId)
        .single();

      if (profileError) throw profileError;

      const { data: studentData, error: studentError } = await supabase
        .from('students')
        .select('student_id, current_semester')
        .eq('id', currentUserId)
        .single();

      if (studentError && studentError.code !== 'PGRST116') {
        // If it's an error other than "No rows found", throw it
        throw studentError;
      }

      setProfile({ ...profileData, student_id: studentData?.student_id || null, current_semester: studentData?.current_semester || null });

      // Fetch course enrollments (for dashboard overview)
      const { data: enrollmentsData, error: enrollmentsError } = await supabase
        .from('enrollments')
        .select(`
          *,
          courses (name, code, credits)
        `)
        .eq('student_id', currentUserId);

      if (enrollmentsError) throw enrollmentsError;
      setEnrollments(enrollmentsData || []);

      // Fetch assignments for enrolled courses (for dashboard overview)
      const enrolledCourseIds = enrollmentsData?.map(e => e.course_id) || [];
      if (enrolledCourseIds.length > 0) {
        const { data: assignmentsData, error: assignmentsError } = await supabase
          .from('assignments')
          .select(`
            *,
            courses (name)
          `)
          .in('course_id', enrolledCourseIds)
          .order('due_date', { ascending: true });

        if (assignmentsError) throw assignmentsError;
        setAssignments(assignmentsData || []);
      }

      // Fetch grades for the student (for dashboard overview)
      const { data: gradesData, error: gradesError } = await supabase
        .from('grades')
        .select(`
          *,
          enrollments!grades_enrollment_id_fkey(
            student_id,
            courses (name)
          )
        `)
        .in('enrollments.student_id', [currentUserId]); // Filter by student_id through enrollments

      if (gradesError) throw gradesError;
      setGrades(gradesData || []);

      // Fetch notices (for dashboard overview)
      const { data: noticesData, error: noticesError } = await supabase
        .from('notices')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5); // Show latest 5 notices

      if (noticesError) throw noticesError;
      setNotices(noticesData || []);

    } catch (error: unknown) {
      console.error('Error fetching student dashboard data:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch dashboard data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6 animate-pulse">Loading Student Dashboard...</h1>
        <div className="space-y-4">
          <div className="h-4 bg-gray-300 rounded w-3/4 animate-pulse"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2 animate-pulse"></div>
          <div className="h-4 bg-gray-300 rounded w-1/3 animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (!profile || !userId) {
    return <div className="text-center py-8 text-destructive">Error: Student profile not found or user not authenticated.</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Student Dashboard</h1>
      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          {/* <TabsTrigger value="courses">Courses</TabsTrigger> */}
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
          <TabsTrigger value="grades">Grades</TabsTrigger>
          <TabsTrigger value="notices">Notices</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Welcome, {profile.full_name}!
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p><strong>Student ID:</strong> {profile.student_id}</p>
              <p><strong>Email:</strong> {profile.email}</p>
              <p><strong>Department:</strong> {profile.departments?.[0]?.name || 'N/A'} ({profile.departments?.[0]?.code || 'N/A'})</p>
              <p><strong>Semester:</strong> {profile.current_semester || 'N/A'}</p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Enrolled Courses
                </CardTitle>
              </CardHeader>
              <CardContent>
                {enrollments.length === 0 ? (
                  <p className="text-muted-foreground">No courses enrolled.</p>
                ) : (
                  <ul className="space-y-2">
                    {enrollments.map(enrollment => (
                      <li key={enrollment.id} className="flex items-center justify-between">
                        <span>{enrollment.courses?.name} ({enrollment.courses?.code})</span>
                        <Badge variant="secondary">{enrollment.courses?.credits} Credits</Badge>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Upcoming Assignments
                </CardTitle>
              </CardHeader>
              <CardContent>
                {assignments.length === 0 ? (
                  <p className="text-muted-foreground">No upcoming assignments.</p>
                ) : (
                  <ul className="space-y-2">
                    {assignments.map(assignment => (
                      <li key={assignment.id} className="flex flex-col">
                        <span className="font-medium">{assignment.title}</span>
                        <span className="text-sm text-muted-foreground">
                          Due: {new Date(assignment.due_date).toLocaleDateString()} ({assignment.courses?.name})
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Grades
                </CardTitle>
              </CardHeader>
              <CardContent>
                {grades.length === 0 ? (
                  <p className="text-muted-foreground">No grades recorded.</p>
                ) : (
                  <ul className="space-y-2">
                    {grades.map(grade => (
                      <li key={grade.id} className="flex items-center justify-between">
                        <span>Grade for {grade.enrollments?.courses?.name || 'N/A'}</span>
                        <Badge variant="outline">{grade.grade}/100</Badge>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Latest Announcements
              </CardTitle>
            </CardHeader>
            <CardContent>
              {notices.length === 0 ? (
                <p className="text-muted-foreground">No recent announcements.</p>
              ) : (
                <ul className="space-y-4">
                  {notices.map(notice => (
                    <li key={notice.id}>
                      <h4 className="font-semibold">{notice.title}</h4>
                      <p className="text-sm text-muted-foreground">{notice.content}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(notice.created_at).toLocaleDateString()}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profile" className="mt-6">
          {userId && <StudentProfile studentId={userId} />}
        </TabsContent>

        <TabsContent value="courses" className="mt-6">
          {userId && <StudentCourses studentId={userId} />}
        </TabsContent>

        <TabsContent value="assignments" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                All Assignments
              </CardTitle>
            </CardHeader>
            <CardContent>
              {assignments.length === 0 ? (
                <p className="text-muted-foreground">No assignments found.</p>
              ) : (
                <ul className="space-y-2">
                  {assignments.map(assignment => (
                    <li key={assignment.id} className="flex flex-col">
                      <span className="font-medium">{assignment.title}</span>
                      <span className="text-sm text-muted-foreground">
                        Due: {new Date(assignment.due_date).toLocaleDateString()} ({assignment.courses?.name})
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="grades" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                All Grades
              </CardTitle>
            </CardHeader>
            <CardContent>
              {grades.length === 0 ? (
                <p className="text-muted-foreground">No grades recorded.</p>
              ) : (
                <ul className="space-y-2">
                  {grades.map(grade => (
                    <li key={grade.id} className="flex items-center justify-between">
                      <span>Grade for {grade.enrollments?.courses?.name || 'N/A'}</span>
                      <Badge variant="outline">{grade.grade}/100</Badge>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notices" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                All Announcements
              </CardTitle>
            </CardHeader>
            <CardContent>
              {notices.length === 0 ? (
                <p className="text-muted-foreground">No announcements.</p>
              ) : (
                <ul className="space-y-4">
                  {notices.map(notice => (
                    <li key={notice.id}>
                      <h4 className="font-semibold">{notice.title}</h4>
                      <p className="text-sm text-muted-foreground">{notice.content}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(notice.created_at).toLocaleDateString()}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentDashboard;