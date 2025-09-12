import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, BookOpen, Calendar } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const assignmentSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  courseId: z.string().min(1, 'Course is required'),
  dueDate: z.string().min(1, 'Due date is required'),
  maxMarks: z.number().min(1, 'Max marks must be at least 1')
});

type AssignmentFormData = z.infer<typeof assignmentSchema>;

interface Assignment {
  id: string;
  title: string;
  description: string;
  course_id: string;
  due_date: string;
  max_marks: number;
  created_at: string;
  courses?: { name: string; code: string };
}

interface Course {
  id: string;
  name: string;
  code: string;
}

interface AssignmentCRUDProps {
  facultyId: string;
}

const AssignmentCRUD: React.FC<AssignmentCRUDProps> = ({ facultyId }) => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<AssignmentFormData>({
    resolver: zodResolver(assignmentSchema)
  });

  const fetchData = async () => {
    try {
      // Fetch assignments with course info
      const { data: assignmentsData, error: assignmentsError } = await supabase
        .from('assignments')
        .select(`
          *,
          courses (
            name,
            code
          )
        `)
        .eq('faculty_id', facultyId)
        .order('created_at', { ascending: false });

      if (assignmentsError) throw assignmentsError;

      // Fetch courses taught by this faculty
      const { data: enrollmentsData, error: enrollmentsError } = await supabase
        .from('enrollments')
        .select(`
          course_id,
          courses (
            id,
            name,
            code
          )
        `)
        .eq('faculty_id', facultyId);

      if (enrollmentsError) throw enrollmentsError;

      const uniqueCourses = enrollmentsData
        ?.map(e => e.courses)
        .filter((course, index, self) => 
          course && self.findIndex(c => c?.id === course.id) === index
        ) as Course[];

      setAssignments(assignmentsData || []);
      setCourses(uniqueCourses || []);
    } catch (error: any) {
      toast({
        title: "Error loading data",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [facultyId]);

  const onSubmit = async (data: AssignmentFormData) => {
    try {
      if (editingAssignment) {
        const { error } = await supabase
          .from('assignments')
          .update({
            title: data.title,
            description: data.description,
            course_id: data.courseId,
            due_date: data.dueDate,
            max_marks: data.maxMarks
          })
          .eq('id', editingAssignment.id);

        if (error) throw error;

        toast({
          title: "Assignment updated successfully"
        });
      } else {
        const { error } = await supabase
          .from('assignments')
          .insert([{
            title: data.title,
            description: data.description,
            course_id: data.courseId,
            faculty_id: facultyId,
            due_date: data.dueDate,
            max_marks: data.maxMarks
          }]);

        if (error) throw error;

        toast({
          title: "Assignment created successfully"
        });
      }

      setIsDialogOpen(false);
      setEditingAssignment(null);
      reset();
      fetchData();
    } catch (error: any) {
      toast({
        title: "Error saving assignment",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleEdit = (assignment: Assignment) => {
    setEditingAssignment(assignment);
    setValue('title', assignment.title);
    setValue('description', assignment.description);
    setValue('courseId', assignment.course_id);
    setValue('dueDate', assignment.due_date.split('T')[0]);
    setValue('maxMarks', assignment.max_marks);
    setIsDialogOpen(true);
  };

  const handleDelete = async (assignmentId: string) => {
    if (!confirm('Are you sure you want to delete this assignment?')) return;

    try {
      const { error } = await supabase
        .from('assignments')
        .delete()
        .eq('id', assignmentId);

      if (error) throw error;

      toast({
        title: "Assignment deleted successfully"
      });

      setAssignments(assignments.filter(a => a.id !== assignmentId));
    } catch (error: any) {
      toast({
        title: "Error deleting assignment",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const openCreateDialog = () => {
    setEditingAssignment(null);
    reset();
    setIsDialogOpen(true);
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
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Assignment Management
          </CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openCreateDialog}>
                <Plus className="w-4 h-4 mr-2" />
                Create Assignment
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingAssignment ? 'Edit Assignment' : 'Create New Assignment'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    {...register('title')}
                    placeholder="Assignment title"
                  />
                  {errors.title && (
                    <p className="text-sm text-destructive mt-1">{errors.title.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    {...register('description')}
                    placeholder="Assignment description"
                    rows={3}
                  />
                  {errors.description && (
                    <p className="text-sm text-destructive mt-1">{errors.description.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="courseId">Course</Label>
                  <select
                    id="courseId"
                    {...register('courseId')}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="">Select a course</option>
                    {courses.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.code} - {course.name}
                      </option>
                    ))}
                  </select>
                  {errors.courseId && (
                    <p className="text-sm text-destructive mt-1">{errors.courseId.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    id="dueDate"
                    type="datetime-local"
                    {...register('dueDate')}
                  />
                  {errors.dueDate && (
                    <p className="text-sm text-destructive mt-1">{errors.dueDate.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="maxMarks">Maximum Marks</Label>
                  <Input
                    id="maxMarks"
                    type="number"
                    {...register('maxMarks', { valueAsNumber: true })}
                    placeholder="100"
                  />
                  {errors.maxMarks && (
                    <p className="text-sm text-destructive mt-1">{errors.maxMarks.message}</p>
                  )}
                </div>

                <Button type="submit" disabled={isSubmitting} className="w-full">
                  {isSubmitting ? 'Saving...' : editingAssignment ? 'Update Assignment' : 'Create Assignment'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      <CardContent>
        {assignments.length === 0 ? (
          <div className="text-center py-8">
            <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No assignments created yet</p>
          </div>
        ) : (
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Max Marks</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assignments.map((assignment) => (
                  <TableRow key={assignment.id}>
                    <TableCell className="font-medium">{assignment.title}</TableCell>
                    <TableCell>
                      {assignment.courses && (
                        <Badge variant="outline">
                          {assignment.courses.code} - {assignment.courses.name}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        {new Date(assignment.due_date).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>{assignment.max_marks}</TableCell>
                    <TableCell>{new Date(assignment.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(assignment)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(assignment.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AssignmentCRUD;