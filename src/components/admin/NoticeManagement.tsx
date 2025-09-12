import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { FileText, Plus, Edit, Trash2, Search, Eye } from 'lucide-react';

interface Notice {
  id: string;
  title: string;
  content: string;
  type: string;
  priority: number;
  target_audience: string;
  is_published: boolean;
  publish_date?: string;
  expire_date?: string;
  author_id?: string;
  created_at: string;
}

const NoticeManagement = () => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'general',
    priority: 1,
    target_audience: 'all',
    is_published: false,
    publish_date: '',
    expire_date: ''
  });

  const noticeTypes = [
    { value: 'general', label: 'General' },
    { value: 'academic', label: 'Academic' },
    { value: 'examination', label: 'Examination' },
    { value: 'admission', label: 'Admission' },
    { value: 'event', label: 'Event' },
    { value: 'urgent', label: 'Urgent' }
  ];

  const targetAudiences = [
    { value: 'all', label: 'All' },
    { value: 'students', label: 'Students' },
    { value: 'faculty', label: 'Faculty' },
    { value: 'staff', label: 'Staff' }
  ];

  const fetchNotices = async () => {
    try {
      const { data, error } = await supabase
        .from('notices')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotices(data || []);
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

  useEffect(() => {
    fetchNotices();
  }, []);

  const getCurrentUserId = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    return user?.id;
  };

  const handleCreateNotice = async () => {
    try {
      const userId = await getCurrentUserId();
      
      const { error } = await supabase
        .from('notices')
        .insert([{
          title: formData.title,
          content: formData.content,
          type: formData.type,
          priority: formData.priority,
          target_audience: formData.target_audience,
          is_published: formData.is_published,
          publish_date: formData.publish_date || null,
          expire_date: formData.expire_date || null,
          author_id: userId
        }]);

      if (error) throw error;

      toast({
        title: "Notice created successfully"
      });

      setIsDialogOpen(false);
      resetForm();
      fetchNotices();
    } catch (error: any) {
      toast({
        title: "Error creating notice",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleUpdateNotice = async () => {
    if (!editingNotice) return;

    try {
      const { error } = await supabase
        .from('notices')
        .update({
          title: formData.title,
          content: formData.content,
          type: formData.type,
          priority: formData.priority,
          target_audience: formData.target_audience,
          is_published: formData.is_published,
          publish_date: formData.publish_date || null,
          expire_date: formData.expire_date || null
        })
        .eq('id', editingNotice.id);

      if (error) throw error;

      toast({
        title: "Notice updated successfully"
      });

      setIsDialogOpen(false);
      setEditingNotice(null);
      resetForm();
      fetchNotices();
    } catch (error: any) {
      toast({
        title: "Error updating notice",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleDeleteNotice = async (noticeId: string) => {
    if (!confirm('Are you sure you want to delete this notice?')) return;

    try {
      const { error } = await supabase
        .from('notices')
        .delete()
        .eq('id', noticeId);

      if (error) throw error;

      toast({
        title: "Notice deleted successfully"
      });

      // Update local state immediately
      setNotices(notices.filter(notice => notice.id !== noticeId));
    } catch (error: any) {
      toast({
        title: "Error deleting notice",
        description: error.message,
        variant: "destructive"
      });
      // Refresh data on error
      fetchNotices();
    }
  };

  const handleTogglePublish = async (notice: Notice) => {
    try {
      const { error } = await supabase
        .from('notices')
        .update({ is_published: !notice.is_published })
        .eq('id', notice.id);

      if (error) throw error;

      toast({
        title: `Notice ${!notice.is_published ? 'published' : 'unpublished'} successfully`
      });

      fetchNotices();
    } catch (error: any) {
      toast({
        title: "Error updating notice",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const filteredNotices = notices.filter(notice => {
    const matchesSearch = notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notice.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || notice.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'published' && notice.is_published) ||
                         (statusFilter === 'draft' && !notice.is_published);
    return matchesSearch && matchesType && matchesStatus;
  });

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      type: 'general',
      priority: 1,
      target_audience: 'all',
      is_published: false,
      publish_date: '',
      expire_date: ''
    });
  };

  const openEditDialog = (notice: Notice) => {
    setEditingNotice(notice);
    setFormData({
      title: notice.title,
      content: notice.content,
      type: notice.type,
      priority: notice.priority,
      target_audience: notice.target_audience,
      is_published: notice.is_published,
      publish_date: notice.publish_date?.split('T')[0] || '',
      expire_date: notice.expire_date?.split('T')[0] || ''
    });
    setIsDialogOpen(true);
  };

  const openCreateDialog = () => {
    setEditingNotice(null);
    resetForm();
    setIsDialogOpen(true);
  };

  const getPriorityBadge = (priority: number) => {
    const variants = {
      1: { variant: 'outline' as const, label: 'Low' },
      2: { variant: 'secondary' as const, label: 'Medium' },
      3: { variant: 'default' as const, label: 'High' }
    };
    const config = variants[priority as keyof typeof variants] || variants[1];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Notice Management
          </CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openCreateDialog}>
                <Plus className="w-4 h-4 mr-2" />
                Create Notice
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingNotice ? 'Edit Notice' : 'Create New Notice'}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Notice title..."
                  />
                </div>
                <div>
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Notice content..."
                    rows={4}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="type">Type</Label>
                    <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {noticeTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="target_audience">Target Audience</Label>
                    <Select value={formData.target_audience} onValueChange={(value) => setFormData({ ...formData, target_audience: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {targetAudiences.map((audience) => (
                          <SelectItem key={audience.value} value={audience.value}>
                            {audience.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={formData.priority.toString()} onValueChange={(value) => setFormData({ ...formData, priority: parseInt(value) })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Low</SelectItem>
                      <SelectItem value="2">Medium</SelectItem>
                      <SelectItem value="3">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="publish_date">Publish Date</Label>
                    <Input
                      id="publish_date"
                      type="date"
                      value={formData.publish_date}
                      onChange={(e) => setFormData({ ...formData, publish_date: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="expire_date">Expire Date</Label>
                    <Input
                      id="expire_date"
                      type="date"
                      value={formData.expire_date}
                      onChange={(e) => setFormData({ ...formData, expire_date: e.target.value })}
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_published"
                    checked={formData.is_published}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_published: checked })}
                  />
                  <Label htmlFor="is_published">Publish immediately</Label>
                </div>
                <Button onClick={editingNotice ? handleUpdateNotice : handleCreateNotice} className="w-full">
                  {editingNotice ? 'Update Notice' : 'Create Notice'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {/* Search and Filters */}
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search notices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {noticeTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Notices Table */}
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Audience</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">Loading...</TableCell>
                </TableRow>
              ) : filteredNotices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">No notices found</TableCell>
                </TableRow>
              ) : (
                filteredNotices.map((notice) => (
                  <TableRow key={notice.id}>
                    <TableCell className="font-medium max-w-xs truncate">{notice.title}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{notice.type}</Badge>
                    </TableCell>
                    <TableCell>{getPriorityBadge(notice.priority)}</TableCell>
                    <TableCell>{notice.target_audience}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge variant={notice.is_published ? 'default' : 'secondary'}>
                          {notice.is_published ? 'Published' : 'Draft'}
                        </Badge>
                        <Switch
                          checked={notice.is_published}
                          onCheckedChange={() => handleTogglePublish(notice)}
                        />
                      </div>
                    </TableCell>
                    <TableCell>{new Date(notice.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(notice)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteNotice(notice.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default NoticeManagement;