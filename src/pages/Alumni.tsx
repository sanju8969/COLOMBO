import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Search, Users, Mail, Phone, Building } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { alumniSchema, AlumniFormData } from '@/lib/validations';
import { EnhancedForm } from '@/components/forms/EnhancedForm';
import { useOptimisticUpdates } from '@/hooks/useOptimisticUpdates';

interface Alumni {
  id: string;
  name: string;
  graduation_year: number;
  course: string;
  current_position?: string;
  company?: string;
  email?: string;
  phone?: string;
  bio?: string;
  created_at: string;
}

const Alumni = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAlumni, setEditingAlumni] = useState<Alumni | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  const form = useForm<AlumniFormData>({
    resolver: zodResolver(alumniSchema),
    defaultValues: {
      name: '',
      graduation_year: new Date().getFullYear(),
      course: '',
      current_position: '',
      company: '',
      email: '',
      phone: '',
      bio: '',
    },
  });

  const {
    data: alumni,
    loading,
    optimisticCreate,
    optimisticUpdate,
    optimisticDelete,
    setData,
    setLoading,
  } = useOptimisticUpdates<Alumni>([], {
    create: async (data) => {
      const { error } = await supabase.from('alumni').insert([data]);
      if (error) throw error;
      await fetchAlumni();
    },
    update: async (id, updates) => {
      const { error } = await supabase.from('alumni').update(updates).eq('id', id);
      if (error) throw error;
      await fetchAlumni();
    },
    delete: async (id) => {
      const { error } = await supabase.from('alumni').delete().eq('id', id);
      if (error) throw error;
    },
  });

  const fetchAlumni = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('alumni')
        .select('*')
        .order('graduation_year', { ascending: false });

      if (error) throw error;
      setData(data || []);
    } catch (error) {
      console.error('Error fetching alumni:', error);
      toast({
        title: "Error",
        description: "Failed to fetch alumni data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUserRole = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      setUserRole(profile?.role || null);
    } catch (error) {
      console.error('Error fetching user role:', error);
    }
  };

  useEffect(() => {
    fetchAlumni();
    fetchUserRole();
  }, []);

  const handleSubmit = async (data: AlumniFormData) => {
    try {
      if (editingAlumni) {
        await optimisticUpdate(editingAlumni.id, data);
      } else {
        await optimisticCreate(data);
      }
      
      setIsDialogOpen(false);
      form.reset();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const formFields = [
    {
      name: 'name',
      label: 'Name',
      type: 'text' as const,
      placeholder: 'Enter full name',
      required: true,
    },
    {
      name: 'graduation_year',
      label: 'Graduation Year',
      type: 'number' as const,
      placeholder: 'Enter graduation year',
      required: true,
    },
    {
      name: 'course',
      label: 'Course',
      type: 'text' as const,
      placeholder: 'Enter course/degree',
      required: true,
      className: 'md:col-span-2',
    },
    {
      name: 'current_position',
      label: 'Current Position',
      type: 'text' as const,
      placeholder: 'Enter current position',
    },
    {
      name: 'company',
      label: 'Company',
      type: 'text' as const,
      placeholder: 'Enter company name',
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email' as const,
      placeholder: 'Enter email address',
    },
    {
      name: 'phone',
      label: 'Phone',
      type: 'text' as const,
      placeholder: 'Enter phone number',
    },
    {
      name: 'bio',
      label: 'Bio',
      type: 'textarea' as const,
      placeholder: 'Enter brief bio',
      className: 'md:col-span-2',
    },
  ];

  const isAdmin = userRole === 'admin';
  const filteredAlumni = alumni.filter(person =>
    person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (person.company && person.company.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="container-width section-padding">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gradient-academic">
            Alumni Directory
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Connect with our distinguished alumni network
          </p>
        </div>

        {isAdmin && (
          <Card className="mb-8">
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Alumni Management
                </CardTitle>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      Add Alumni
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>
                        {editingAlumni ? 'Edit Alumni' : 'Add New Alumni'}
                      </DialogTitle>
                    </DialogHeader>
                    <EnhancedForm
                      form={form}
                      fields={formFields}
                      onSubmit={handleSubmit}
                      submitText={editingAlumni ? 'Update Alumni' : 'Add Alumni'}
                      isLoading={loading}
                    />
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Input
                placeholder="Search alumni..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-md"
              />
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAlumni.map((person) => (
            <Card key={person.id} className="hover-lift">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                      <Users className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{person.name}</h3>
                      <Badge variant="secondary">Class of {person.graduation_year}</Badge>
                    </div>
                  </div>
                  {isAdmin && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditingAlumni(person);
                          form.reset(person);
                          setIsDialogOpen(true);
                        }}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => optimisticDelete(person.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <p className="font-medium text-primary">{person.course}</p>

                  {person.current_position && (
                    <div className="flex items-center gap-2 text-sm">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {person.current_position}
                        {person.company && ` at ${person.company}`}
                      </span>
                    </div>
                  )}

                  {person.email && (
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <a 
                        href={`mailto:${person.email}`}
                        className="text-primary hover:underline"
                      >
                        {person.email}
                      </a>
                    </div>
                  )}

                  {person.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <a 
                        href={`tel:${person.phone}`}
                        className="text-primary hover:underline"
                      >
                        {person.phone}
                      </a>
                    </div>
                  )}

                  {person.bio && (
                    <p className="text-sm text-muted-foreground mt-3">
                      {person.bio}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Alumni;