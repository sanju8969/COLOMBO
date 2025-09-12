import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { FileText, Calendar, BookOpen } from 'lucide-react';

interface AssignmentManagementProps {
  facultyId: string;
}

const AssignmentManagement: React.FC<AssignmentManagementProps> = ({ facultyId }) => {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchFacultyCourses();
  }, [facultyId]);

  const fetchFacultyCourses = async () => {
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      
      const { data: enrollmentData } = await supabase
        .from('enrollments')
        .select(`
          course_id,
          courses (id, name, code)
        `)
        .eq('faculty_id', facultyId);

      if (!enrollmentData) {
        setCourses([]);
        return;
      }

      const uniqueCourses = enrollmentData
        .filter((item, index, self) => 
          index === self.findIndex(t => t.course_id === item.course_id)
        )
        .map(item => item.courses)
        .filter(Boolean);

      setCourses(uniqueCourses);
    } catch (error) {
      console.error('Error fetching faculty courses:', error);
      toast({
        title: "Error",
        description: "Failed to fetch courses",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAssignment = () => {
    toast({
      title: "Assignment Feature",
      description: "Assignment creation functionality will be available soon!"
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Assignment Management
          </CardTitle>
          <Button onClick={handleCreateAssignment}>
            Create Assignment
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">My Courses</h3>
            {loading ? (
              <div className="text-center py-4">Loading courses...</div>
            ) : courses.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <BookOpen className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No courses assigned yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {courses.map((course) => (
                  <Card key={course.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{course.name}</CardTitle>
                          <Badge variant="outline" className="mt-1">
                            {course.code}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={handleCreateAssignment}
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          Create Assignment
                        </Button>
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => toast({
                            title: "Coming Soon",
                            description: "Grade management feature will be available soon!"
                          })}
                        >
                          <Calendar className="h-4 w-4 mr-2" />
                          View Grades
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                variant="outline" 
                className="h-auto p-4 flex flex-col items-center space-y-2"
                onClick={handleCreateAssignment}
              >
                <FileText className="h-6 w-6" />
                <span>Create Assignment</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-auto p-4 flex flex-col items-center space-y-2"
                onClick={() => toast({
                  title: "Coming Soon",
                  description: "Student management feature will be available soon!"
                })}
              >
                <BookOpen className="h-6 w-6" />
                <span>Manage Students</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-auto p-4 flex flex-col items-center space-y-2"
                onClick={() => toast({
                  title: "Coming Soon", 
                  description: "Grade management feature will be available soon!"
                })}
              >
                <Calendar className="h-6 w-6" />
                <span>Grade Students</span>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AssignmentManagement;