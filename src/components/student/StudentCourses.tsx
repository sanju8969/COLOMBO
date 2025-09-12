import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { BookOpen, User, Calendar, Award, PlusCircle, MinusCircle } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface Course {
  id: string;
  name: string;
  code: string;
  description: string;
  credits: number;
  semester: number;
}

interface Enrollment {
  id: string;
  status: string;
  grade?: string;
  enrollment_date: string;
  courses: Course;
  faculty?: {
    full_name: string;
  };
}

interface StudentCoursesProps {
  studentId: string;
}

const StudentCourses: React.FC<StudentCoursesProps> = ({ studentId }) => {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [isDropping, setIsDropping] = useState(false);
  const { toast } = useToast();

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch enrolled courses
      const { data: enrolledData, error: enrolledError } = await supabase
        .from('enrollments')
        .select(`
          id,
          status,
          grade,
          enrollment_date,
          courses (
            id,
            name,
            code,
            description,
            credits,
            semester
          ),
          profiles!enrollments_faculty_id_fkey (
            full_name
          )
        `)
        .eq('student_id', studentId)
        .order('enrollment_date', { ascending: false });

      if (enrolledError) throw enrolledError;
      setEnrollments(enrolledData || []);

      const enrolledCourseIds = (enrolledData || []).map(e => e.courses.id);

      // Fetch all courses and filter out enrolled ones
      const { data: allCoursesData, error: allCoursesError } = await supabase
        .from('courses')
        .select('*')
        .order('name', { ascending: true });

      if (allCoursesError) throw allCoursesError;

      const filteredAvailableCourses = (allCoursesData || []).filter(
        course => !enrolledCourseIds.includes(course.id)
      );
      setAvailableCourses(filteredAvailableCourses);

    } catch (error: unknown) {
      toast({
        title: "Error loading courses",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [studentId, toast]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const handleEnroll = async (courseId: string) => {
    setIsEnrolling(true);
    try {
      const { error } = await supabase.from('enrollments').insert({
        student_id: studentId,
        course_id: courseId,
        status: 'enrolled',
        enrollment_date: new Date().toISOString(),
      });

      if (error) throw error;

      toast({
        title: "Course enrolled successfully",
        description: "You have successfully enrolled in the course.",
      });
      fetchCourses(); // Refresh the list
    } catch (error: unknown) {
      toast({
        title: "Error enrolling in course",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsEnrolling(false);
    }
  };

  const handleDrop = async (enrollmentId: string, courseName: string) => {
    setIsDropping(true);
    try {
      const { error } = await supabase
        .from('enrollments')
        .delete()
        .eq('id', enrollmentId);

      if (error) throw error;

      toast({
        title: "Course dropped successfully",
        description: `You have dropped ${courseName}.`,
      });
      fetchCourses(); // Refresh the list
    } catch (error: unknown) {
      toast({
        title: "Error dropping course",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsDropping(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'enrolled':
        return 'default';
      case 'completed':
        return 'secondary';
      case 'withdrawn':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getGradeColor = (grade?: string) => {
    if (!grade) return 'outline';
    
    const gradeValue = grade.toUpperCase();
    if (['A+', 'A'].includes(gradeValue)) return 'default';
    if (['B+', 'B'].includes(gradeValue)) return 'secondary';
    if (['C+', 'C'].includes(gradeValue)) return 'outline';
    return 'destructive';
  };

  const calculateProgress = (status: string, grade?: string) => {
    if (status === 'completed') return 100;
    if (status === 'enrolled') return 60;
    if (status === 'withdrawn') return 25;
    return 0;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            My Enrolled Courses
          </CardTitle>
        </CardHeader>

        <CardContent>
          {enrollments.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No courses enrolled yet</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {enrollments.map((enrollment) => (
                <Card key={enrollment.id} className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">{enrollment.courses.name}</h3>
                      <p className="text-sm text-muted-foreground">{enrollment.courses.code}</p>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant={getStatusColor(enrollment.status)}>
                        {enrollment.status}
                      </Badge>
                      {enrollment.grade && (
                        <Badge variant={getGradeColor(enrollment.grade)}>
                          {enrollment.grade}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4">
                    {enrollment.courses.description}
                  </p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{enrollment.courses.credits} Credits</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">Semester {enrollment.courses.semester}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">
                        {enrollment.faculty?.full_name || 'TBD'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">
                        Enrolled: {new Date(enrollment.enrollment_date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Progress</span>
                      <span className="text-sm font-medium">
                        {calculateProgress(enrollment.status, enrollment.grade)}%
                      </span>
                    </div>
                    <Progress
                      value={calculateProgress(enrollment.status, enrollment.grade)}
                      className="h-2"
                    />
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm">
                      View Assignments
                    </Button>
                    <Button variant="outline" size="sm">
                      View Grades
                    </Button>
                    {enrollment.status === 'enrolled' && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm" disabled={isDropping}>
                            <MinusCircle className="w-4 h-4 mr-2" />
                            Drop Course
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently remove your enrollment from{' '}
                              <span className="font-semibold">{enrollment.courses.name}</span>.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDrop(enrollment.id, enrollment.courses.name)}>
                              Continue
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PlusCircle className="w-5 h-5" />
            Available Courses
          </CardTitle>
        </CardHeader>
        <CardContent>
          {availableCourses.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No new courses available for enrollment.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {availableCourses.map((course) => (
                <Card key={course.id} className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">{course.name}</h3>
                      <p className="text-sm text-muted-foreground">{course.code}</p>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="outline">{course.credits} Credits</Badge>
                      <Badge variant="secondary">Semester {course.semester}</Badge>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    {course.description}
                  </p>
                  <Button
                    onClick={() => handleEnroll(course.id)}
                    disabled={isEnrolling}
                    size="sm"
                  >
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Enroll
                  </Button>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentCourses;