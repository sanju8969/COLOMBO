import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Search, Image, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { gallerySchema, GalleryFormData } from '@/lib/validations';
import { EnhancedForm } from '@/components/forms/EnhancedForm';
import { useOptimisticUpdates } from '@/hooks/useOptimisticUpdates';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface GalleryImage {
  id: string;
  title: string;
  description?: string;
  image_url: string;
  created_at: string;
}

const Gallery = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  const form = useForm<GalleryFormData>({
    resolver: zodResolver(gallerySchema),
    defaultValues: {
      title: '',
      description: '',
      image_url: '',
    },
  });

  const {
    data: images,
    loading,
    optimisticCreate,
    optimisticUpdate,
    optimisticDelete,
    setData,
    setLoading,
  } = useOptimisticUpdates<GalleryImage>([], {
    create: async (data) => {
      const { error } = await supabase.from('gallery').insert([data]);
      if (error) throw error;
      await fetchImages();
    },
    update: async (id, updates) => {
      const { error } = await supabase.from('gallery').update(updates).eq('id', id);
      if (error) throw error;
      await fetchImages();
    },
    delete: async (id) => {
      const { error } = await supabase.from('gallery').delete().eq('id', id);
      if (error) throw error;
    },
  });

  const fetchImages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setData(data || []);
    } catch (error) {
      console.error('Error fetching images:', error);
      toast({
        title: "Error",
        description: "Failed to fetch gallery images",
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
    fetchImages();
    fetchUserRole();
  }, []);

  const handleSubmit = async (data: GalleryFormData) => {
    try {
      if (editingImage) {
        await optimisticUpdate(editingImage.id, data);
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
      name: 'title',
      label: 'Title',
      type: 'text' as const,
      placeholder: 'Enter image title',
      required: true,
      className: 'md:col-span-2',
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea' as const,
      placeholder: 'Enter image description',
      className: 'md:col-span-2',
    },
    {
      name: 'image_url',
      label: 'Image URL',
      type: 'text' as const,
      placeholder: 'Enter image URL',
      required: true,
      className: 'md:col-span-2',
    },
  ];

  const isAdmin = userRole === 'admin';
  const filteredImages = images.filter(image =>
    image.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (image.description && image.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="container-width section-padding">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gradient-academic">
            College Gallery
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Explore the beautiful moments and memories of St. Columba's College
          </p>
        </div>

        {isAdmin && (
          <Card className="mb-8">
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <CardTitle className="flex items-center gap-2">
                  <Image className="h-5 w-5" />
                  Gallery Management
                </CardTitle>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      Add Image
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>
                        {editingImage ? 'Edit Image' : 'Add New Image'}
                      </DialogTitle>
                    </DialogHeader>
                    <EnhancedForm
                      form={form}
                      fields={formFields}
                      onSubmit={handleSubmit}
                      submitText={editingImage ? 'Update Image' : 'Add Image'}
                      isLoading={loading}
                    />
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Input
                placeholder="Search images..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-md"
              />
            </CardContent>
          </Card>
        )}

        {!isAdmin && (
          <Card className="mb-8">
            <CardContent className="pt-6">
              <Input
                placeholder="Search images..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-md mx-auto"
              />
            </CardContent>
          </Card>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <Card key={index} className="animate-pulse">
                <div className="aspect-video bg-muted rounded-t-lg"></div>
                <CardContent className="p-4">
                  <div className="h-4 bg-muted rounded mb-2"></div>
                  <div className="h-3 bg-muted rounded w-3/4"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredImages.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Image className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg font-medium mb-2">No images found</p>
              <p className="text-muted-foreground">
                {searchTerm ? 'Try adjusting your search terms' : 'No images available'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredImages.map((image) => (
              <Card key={image.id} className="hover-lift overflow-hidden">
                <div className="aspect-video relative overflow-hidden">
                  <img
                    src={image.image_url}
                    alt={image.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder.svg';
                    }}
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2">{image.title}</h3>
                  {image.description && (
                    <p className="text-sm text-muted-foreground mb-3">
                      {image.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">
                      {new Date(image.created_at).toLocaleDateString()}
                    </Badge>
                    {isAdmin && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingImage(image);
                            form.reset(image);
                            setIsDialogOpen(true);
                          }}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => optimisticDelete(image.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;