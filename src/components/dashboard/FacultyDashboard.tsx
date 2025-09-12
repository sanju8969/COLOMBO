import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BookOpen, Users, GraduationCap, FileText, Calendar, ClipboardList, ArrowLeft } from 'lucide-react';
import AssignmentManagement from '@/components/faculty/AssignmentManagement';
import AssignmentCRUD from '@/components/faculty/AssignmentCRUD';
import NoticeManagement from '@/components/admin/NoticeManagement';

interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'faculty' | 'student';
  avatar_url?: string;
  phone?: string;
}

interface Department {
  id: string;
  name: string;
}

interface FacultyInfo {
  id: string;
  employee_id: string;
  designation: string;
  experience_years: number;
  qualification?: string;
  specialization?: string;
  department_id: string;
  departments: Department;
}

interface EnrolledStudent {
  id: string;
  full_name: string;
  email: string;
  course_id: string;
  course_name: string;
}

interface Course {
  id: string;
  name: string;
}

interface FacultyDashboardProps {
  profile: Profile;
}

const FacultyDashboard: React.FC<FacultyDashboardProps> = ({ profile }) => {
  const fetchStudentsForFacultyCourses = async (facultyId: string, courseId: string | null = null): Promise<EnrolledStudent[]> => {
    let query = supabase
      .from('enrollments')
      .select('course_id, courses(name), student_id');

    if (courseId) {
      query = query.eq('course_id', courseId);
    } else {
      query = query.eq('faculty_id', facultyId);
    }

    const { data: enrollmentsData, error: enrollmentsError } = await query;

    if (enrollmentsError) {
      console.error('Error fetching enrollments:', enrollmentsError);
      return [];
    }

    const studentCourses: EnrolledStudent[] = [];
    const studentIdsInCourse = new Set<string>();

    for (const enrollment of enrollmentsData) {
      const currentCourseId = enrollment.course_id;
      const courseName = (enrollment.courses as { name: string }).name;
      const studentId = enrollment.student_id;

      if (!studentId) continue; // Skip if student_id is null

      // Check if the student is already added for this course to avoid duplicates
      if (studentIdsInCourse.has(`${studentId}-${currentCourseId}`)) {
        continue;
      }
      studentIdsInCourse.add(`${studentId}-${currentCourseId}`);

      const { data: studentProfile, error: studentProfileError } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .eq('id', studentId)
        .single();

      if (studentProfileError) {
        console.error('Error fetching student profile:', studentProfileError);
        continue;
      }

      if (studentProfile) {
        studentCourses.push({
          id: studentProfile.id,
          full_name: studentProfile.full_name,
          email: studentProfile.email,
          course_id: currentCourseId,
          course_name: courseName,
        });
      }
    }
    return studentCourses;
  };
  const [stats, setStats] = useState({
    myCourses: 0,
    myStudents: 0,
    pendingGrades: 0,
    myNotices: 0
  });

  const [facultyInfo, setFacultyInfo] = useState<FacultyInfo | null>(null);
  const [currentView, setCurrentView] = useState<'dashboard' | 'assignments' | 'notices' | 'student-list' | 'grade-students'>('dashboard');
  const [enrolledStudents, setEnrolledStudents] = useState<EnrolledStudent[]>([]);
  const [grades, setGrades] = useState<{ [studentId: string]: string }>({});
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [facultyCourses, setFacultyCourses] = useState<Array<{ id: string; name: string }>>([]);

  useEffect(() => {
    const fetchFacultyData = async () => {
      try {
        // Fetch faculty profile
        const { data: facultyData } = await supabase
          .from('faculty')
          .select('*, departments(*)')
          .eq('id', profile.id)
          .single();

        setFacultyInfo(facultyData);

        // Fetch faculty courses separately to ensure correct typing
        const { data: facultyCoursesData, error: facultyCoursesError } = await supabase
          .from('courses')
          .select('id, name') as { data: Course[] | null; error: unknown };

        if (facultyCoursesError) {
          console.error('Error fetching faculty courses:', facultyCoursesError);
          setFacultyCourses([]);
        } else {
          setFacultyCourses(facultyCoursesData as Course[] || []);
        }

        // Fetch statistics
        const [coursesRes, enrollmentsRes, noticesRes] = await Promise.all([
          supabase.from('enrollments').select('course_id', { count: 'exact', head: true }).eq('faculty_id', profile.id),
          supabase.from('enrollments').select('*', { count: 'exact', head: true }).eq('faculty_id', profile.id),
          supabase.from('notices').select('*', { count: 'exact', head: true }).eq('author_id', profile.id),
        ]);

        // Get unique courses from the fetched facultyCoursesData
        const uniqueCourseIds = [...new Set(facultyCoursesData?.map(c => c.id))];

        setStats({
          myCourses: uniqueCourseIds.length,
          myStudents: enrollmentsRes.count || 0,
          pendingGrades: 0, // Would need to calculate based on assignments without grades
          myNotices: noticesRes.count || 0
        });
      } catch (error) {
        console.error('Error fetching faculty data:', error);
      }
    };

    fetchFacultyData();
  }, [profile.id]);

  const statCards = [
    {
      title: 'My Courses',
      value: stats.myCourses,
      icon: BookOpen,
      color: 'text-blue-600'
    },
    {
      title: 'My Students',
      value: stats.myStudents,
      icon: Users,
      color: 'text-green-600'
    },
    {
      title: 'Pending Grades',
      value: stats.pendingGrades,
      icon: ClipboardList,
      color: 'text-orange-600'
    },
    {
      title: 'My Notices',
      value: stats.myNotices,
      icon: FileText,
      color: 'text-purple-600'
    }
  ];

  const handleManageAssignments = () => {
    setCurrentView('assignments');
  };

  const handleManageNotices = () => {
    setCurrentView('notices');
  };

  const handleViewStudents = async (courseId: string | null = null) => {
    if (profile.id) {
      const students = await fetchStudentsForFacultyCourses(profile.id, courseId);
      setEnrolledStudents(students);
      setGrades({}); // Clear grades when changing student list view
      setCurrentView('student-list');
    }
  };

  const handleGradeChange = (studentId: string, grade: string) => {
    setGrades(prevGrades => ({
      ...prevGrades,
      [studentId]: grade,
    }));
  };

  const handleGradeSubmission = async (studentId: string, courseId: string) => {
    const grade = grades[studentId];
    if (!grade) {
      alert('Please enter a grade before submitting.');
      return;
    }

    try {
      // In a real application, you'd likely have an 'assignments' or 'grades' table
      // For this example, we'll just log it and simulate a successful submission
      console.log(`Submitting grade ${grade} for student ${studentId} in course ${courseId}`);
      // Example: Insert into a 'grades' table
      // const { error } = await supabase.from('grades').insert([{ student_id: studentId, course_id: courseId, grade: grade }]);
      // if (error) throw error;
      alert(`Grade ${grade} submitted for ${enrolledStudents.find(s => s.id === studentId)?.full_name}`);
      setGrades(prevGrades => {
        const newGrades = { ...prevGrades };
        delete newGrades[studentId]; // Clear grade after submission
        return newGrades;
      });
    } catch (error) {
      console.error('Error submitting grade:', error);
      alert('Failed to submit grade.');
    }
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setEnrolledStudents([]); // Clear students when going back to dashboard
    setGrades({}); // Clear grades
    setSelectedCourseId(null); // Clear selected course
  };

  // Render management views
  if (currentView !== 'dashboard') {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={handleBackToDashboard}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <Badge variant="secondary">Faculty</Badge>
        </div>
        
        {currentView === 'assignments' && <AssignmentCRUD facultyId={profile.id} />}
        {currentView === 'notices' && <NoticeManagement />}
        {currentView === 'student-list' && (
          <Card>
            <CardHeader>
              <CardTitle>Enrolled Students</CardTitle>
            </CardHeader>
            <CardContent>
              {enrolledStudents.length > 0 ? (
                <div className="space-y-4">
                  {enrolledStudents.map((student, index) => (
                    <div key={index} className="border p-4 rounded-md">
                      <p className="font-semibold">{student.full_name}</p>
                      <p className="text-sm text-muted-foreground">{student.email}</p>
                      <p className="text-xs text-muted-foreground">Course: {student.course_name} ({student.course_id})</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No students enrolled in your courses.</p>
              )}
            </CardContent>
          </Card>
        )}

        {currentView === 'grade-students' && (
          <Card>
            <CardHeader>
              <CardTitle>Grade Students</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Select onValueChange={(value) => setSelectedCourseId(value)}>
                  <SelectTrigger className="w-[280px]">
                    <SelectValue placeholder="Select a Course" />
                  </SelectTrigger>
                  <SelectContent>
                    {facultyCourses.map(course => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={() => handleViewStudents(selectedCourseId)} disabled={!selectedCourseId} className="ml-2">
                  Load Students
                </Button>
              </div>

              {selectedCourseId && enrolledStudents.length > 0 ? (
                <div className="space-y-4">
                  {enrolledStudents.map((student) => (
                    <div key={student.id} className="border p-4 rounded-md flex items-center justify-between">
                      <div>
                        <p className="font-semibold">{student.full_name}</p>
                        <p className="text-sm text-muted-foreground">{student.email}</p>
                        <p className="text-xs text-muted-foreground">Course: {student.course_name}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Input
                          type="number"
                          placeholder="Grade"
                          value={grades[student.id] || ''}
                          onChange={(e) => handleGradeChange(student.id, e.target.value)}
                          className="w-24"
                        />
                        <Button onClick={() => handleGradeSubmission(student.id, student.course_id)}>
                          Submit Grade
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : selectedCourseId && enrolledStudents.length === 0 ? (
                <p>No students found for the selected course.</p>
              ) : (
                <p>Please select a course to view students for grading.</p>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Faculty Dashboard</h2>
          {facultyInfo && (
            <p className="text-muted-foreground">
              {facultyInfo.designation} - {facultyInfo.departments?.name}
            </p>
          )}
        </div>
        <Badge variant="secondary">Faculty</Badge>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Faculty Profile Card */}
      {facultyInfo && (
        <Card>
          <CardHeader>
            <CardTitle>My Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Employee ID</p>
                <p className="text-sm">{facultyInfo.employee_id}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Department</p>
                <p className="text-sm">{facultyInfo.departments?.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Designation</p>
                <p className="text-sm">{facultyInfo.designation}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Experience</p>
                <p className="text-sm">{facultyInfo.experience_years} years</p>
              </div>
              {facultyInfo.qualification && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Qualification</p>
                  <p className="text-sm">{facultyInfo.qualification}</p>
                </div>
              )}
              {facultyInfo.specialization && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Specialization</p>
                  <p className="text-sm">{facultyInfo.specialization}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button 
              className="h-auto p-4 flex flex-col items-center space-y-2"
              onClick={handleManageAssignments}
            >
              <ClipboardList className="h-6 w-6" />
              <span>Manage Assignments</span>
            </Button>
            <Button
              className="h-auto p-4 flex flex-col items-center space-y-2"
              onClick={() => handleViewStudents(null)}
            >
              <GraduationCap className="h-6 w-6" />
              <span>Student List</span>
            </Button>
            <Button
              className="h-auto p-4 flex flex-col items-center space-y-2"
              variant="outline"
              onClick={() => setCurrentView('grade-students')}
            >
              <BookOpen className="h-6 w-6" />
              <span>Grade Students</span>
            </Button>
            <Button 
              className="h-auto p-4 flex flex-col items-center space-y-2" 
              variant="outline"
              onClick={handleManageNotices}
            >
              <FileText className="h-6 w-6" />
              <span>Manage Notices</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Graded Assignment 3 for CS101</p>
                <p className="text-xs text-muted-foreground">1 hour ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Published new course material</p>
                <p className="text-xs text-muted-foreground">3 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Updated course syllabus</p>
                <p className="text-xs text-muted-foreground">1 day ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FacultyDashboard;