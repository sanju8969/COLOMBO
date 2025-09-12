import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Users } from 'lucide-react';

interface Faculty {
  id: string;
  employee_id: string;
  designation: string;
  qualification?: string;
  experience_years?: number;
  specialization?: string;
  department_id?: string;
  created_at: string;
  profiles?: {
    email: string;
    full_name: string;
    phone?: string;
  };
  departments?: {
    name: string;
    code: string;
  };
}

interface Department {
  id: string;
  name: string;
  code: string;
}

const FacultyManagement: React.FC = () => {
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState<Faculty | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    phone: '',
    employee_id: '',
    designation: '',
    qualification: '',
    experience_years: '',
    specialization: '',
    department_id: ''
  });

  useEffect(() => {
    fetchFaculty();
    fetchDepartments();
  }, []);

  const fetchFaculty = async () => {
    try {
      const { data, error } = await supabase
        .from('faculty')
        .select(`
          *,
          profiles (email, full_name, phone),
          departments (name, code)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFaculty(data || []);
    } catch (error) {
      console.error('Error fetching faculty:', error);
      toast({
        title: "Error",
        description: "Failed to fetch faculty data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const { data, error } = await supabase
        .from('departments')
        .select('id, name, code')
        .order('name');

      if (error) throw error;
      setDepartments(data || []);
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const handleCreateFaculty = async () => {
    try {
      // First create the user account
      const { data: authData, error: authError } = await supabase.functions.invoke('create-faculty-user', {
        body: {
          email: formData.email,
          password: 'faculty123', // Temporary password
          full_name: formData.full_name,
          role: 'faculty'
        }
      });

      if (authError) throw authError;
      if (!authData || !authData.user) throw new Error('User creation failed');

      // Then create the faculty record
      const { error: facultyError } = await supabase
        .from('faculty')
        .insert({
          id: authData.user.id,
          employee_id: formData.employee_id,
          designation: formData.designation,
          qualification: formData.qualification || null,
          experience_years: formData.experience_years ? parseInt(formData.experience_years) : null,
          specialization: formData.specialization || null,
          department_id: formData.department_id || null
        });

      if (facultyError) throw facultyError;

      toast({
        title: "Success",
        description: "Faculty member created successfully"
      });

      resetForm();
      setIsDialogOpen(false);
      fetchFaculty();
    } catch (error: unknown) {
      console.error('Error creating faculty:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create faculty member",
        variant: "destructive"
      });
    }
  };

  const handleUpdateFaculty = async () => {
    if (!editingFaculty) return;

    try {
      // Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          phone: formData.phone || null
        })
        .eq('id', editingFaculty.id);

      if (profileError) throw profileError;

      // Update faculty record
      const { error: facultyError } = await supabase
        .from('faculty')
        .update({
          employee_id: formData.employee_id,
          designation: formData.designation,
          qualification: formData.qualification || null,
          experience_years: formData.experience_years ? parseInt(formData.experience_years) : null,
          specialization: formData.specialization || null,
          department_id: formData.department_id || null
        })
        .eq('id', editingFaculty.id);

      if (facultyError) throw facultyError;

      toast({
        title: "Success",
        description: "Faculty member updated successfully"
      });

      resetForm();
      setIsDialogOpen(false);
      fetchFaculty();
    } catch (error: unknown) {
      console.error('Error updating faculty:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update faculty member",
        variant: "destructive"
      });
    }
  };

  const handleDeleteFaculty = async (facultyId: string) => {
    if (!confirm('Are you sure you want to delete this faculty member?')) return;

    try {
      // Delete faculty record (this will cascade to delete the user)
      const { error } = await supabase.auth.admin.deleteUser(facultyId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Faculty member deleted successfully"
      });

      fetchFaculty();
    } catch (error: unknown) {
      console.error('Error deleting faculty:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete faculty member",
        variant: "destructive"
      });
    }
  };

  const openEditDialog = (facultyMember: Faculty) => {
    setEditingFaculty(facultyMember);
    setFormData({
      email: facultyMember.profiles?.email || '',
      full_name: facultyMember.profiles?.full_name || '',
      phone: facultyMember.profiles?.phone || '',
      employee_id: facultyMember.employee_id,
      designation: facultyMember.designation,
      qualification: facultyMember.qualification || '',
      experience_years: facultyMember.experience_years?.toString() || '',
      specialization: facultyMember.specialization || '',
      department_id: facultyMember.department_id || ''
    });
    setIsDialogOpen(true);
  };

  const openCreateDialog = () => {
    setEditingFaculty(null);
    resetForm();
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      email: '',
      full_name: '',
      phone: '',
      employee_id: '',
      designation: '',
      qualification: '',
      experience_years: '',
      specialization: '',
      department_id: ''
    });
  };

  const filteredFaculty = faculty.filter(member =>
    member.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.employee_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.departments?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Faculty Management
          </CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openCreateDialog}>
                <Plus className="h-4 w-4 mr-2" />
                Add Faculty
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingFaculty ? 'Edit Faculty Member' : 'Add New Faculty Member'}
                </DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                {!editingFaculty && (
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="faculty@example.com"
                    />
                  </div>
                )}
                <div>
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input
                    id="full_name"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    placeholder="Dr. John Smith"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 9876543210"
                  />
                </div>
                <div>
                  <Label htmlFor="employee_id">Employee ID</Label>
                  <Input
                    id="employee_id"
                    value={formData.employee_id}
                    onChange={(e) => setFormData({ ...formData, employee_id: e.target.value })}
                    placeholder="FAC001"
                  />
                </div>
                <div>
                  <Label htmlFor="designation">Designation</Label>
                  <Select
                    value={formData.designation}
                    onValueChange={(value) => setFormData({ ...formData, designation: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select designation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Professor">Professor</SelectItem>
                      <SelectItem value="Associate Professor">Associate Professor</SelectItem>
                      <SelectItem value="Assistant Professor">Assistant Professor</SelectItem>
                      <SelectItem value="Lecturer">Lecturer</SelectItem>
                      <SelectItem value="HOD">Head of Department</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="department">Department</Label>
                  <Select
                    value={formData.department_id}
                    onValueChange={(value) => setFormData({ ...formData, department_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept.id} value={dept.id}>
                          {dept.name} ({dept.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="qualification">Qualification</Label>
                  <Input
                    id="qualification"
                    value={formData.qualification}
                    onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                    placeholder="Ph.D in Computer Science"
                  />
                </div>
                <div>
                  <Label htmlFor="experience_years">Experience (Years)</Label>
                  <Input
                    id="experience_years"
                    type="number"
                    value={formData.experience_years}
                    onChange={(e) => setFormData({ ...formData, experience_years: e.target.value })}
                    placeholder="5"
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="specialization">Specialization</Label>
                  <Input
                    id="specialization"
                    value={formData.specialization}
                    onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                    placeholder="Machine Learning, Data Science"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={editingFaculty ? handleUpdateFaculty : handleCreateFaculty}>
                  {editingFaculty ? 'Update' : 'Create'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Input
            placeholder="Search faculty..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="text-center py-4">Loading...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Employee ID</TableHead>
                <TableHead>Designation</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Experience</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFaculty.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    No faculty members found
                  </TableCell>
                </TableRow>
              ) : (
                filteredFaculty.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{member.profiles?.full_name}</div>
                        <div className="text-sm text-muted-foreground">{member.profiles?.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>{member.employee_id}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{member.designation}</Badge>
                    </TableCell>
                    <TableCell>{member.departments?.name || 'Not assigned'}</TableCell>
                    <TableCell>{member.experience_years} years</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(member)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteFaculty(member.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default FacultyManagement;