import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useDashboard } from '@/hooks/useDashboard';
import { useToast } from '@/hooks/use-toast';
import { Users, BookOpen, UserCheck, FileText, GraduationCap, Building, ArrowLeft } from 'lucide-react';
import UserManagement from '@/components/admin/UserManagement';
import DepartmentManagement from '@/components/admin/DepartmentManagement';
import CourseManagement from '@/components/admin/CourseManagement';
import NoticeManagement from '@/components/admin/NoticeManagement';
import FacultyManagement from '@/components/admin/FacultyManagement';

interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'faculty' | 'student';
  avatar_url?: string;
  phone?: string;
}

interface AdminDashboardProps {
  profile: Profile;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ profile }) => {
  const { stats, loading } = useDashboard();
  const { toast } = useToast();
  const [currentView, setCurrentView] = useState<'dashboard' | 'users' | 'departments' | 'courses' | 'notices' | 'faculty'>('dashboard');

  const handleManageUsers = () => {
    setCurrentView('users');
  };

  const handleManageDepartments = () => {
    setCurrentView('departments');
  };

  const handleManageCourses = () => {
    setCurrentView('courses');
  };

  const handlePublishNotice = () => {
    setCurrentView('notices');
  };

  const handleManageFaculty = () => {
    setCurrentView('faculty');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
  };

  const statCards = [
    {
      title: 'Total Students',
      value: stats.students,
      icon: GraduationCap,
      color: 'text-blue-600'
    },
    {
      title: 'Total Faculty',
      value: stats.faculty,
      icon: Users,
      color: 'text-green-600'
    },
    {
      title: 'Departments',
      value: stats.departments,
      icon: Building,
      color: 'text-purple-600'
    },
    {
      title: 'Courses',
      value: stats.courses,
      icon: BookOpen,
      color: 'text-orange-600'
    },
    {
      title: 'Pending Admissions',
      value: stats.pendingAdmissions,
      icon: UserCheck,
      color: 'text-red-600'
    },
    {
      title: 'Active Notices',
      value: stats.activeNotices,
      icon: FileText,
      color: 'text-indigo-600'
    }
  ];

  // Render management views
  if (currentView !== 'dashboard') {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={handleBackToDashboard}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <Badge variant="secondary">Administrator</Badge>
        </div>
        
        {currentView === 'users' && <UserManagement />}
        {currentView === 'departments' && <DepartmentManagement />}
        {currentView === 'courses' && <CourseManagement />}
        {currentView === 'notices' && <NoticeManagement />}
        {currentView === 'faculty' && <FacultyManagement />}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Admin Dashboard</h2>
        <Badge variant="secondary">Administrator</Badge>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <Button 
              className="h-auto p-4 flex flex-col items-center space-y-2"
              onClick={handleManageUsers}
            >
              <Users className="h-6 w-6" />
              <span>Manage Users</span>
            </Button>
            <Button 
              className="h-auto p-4 flex flex-col items-center space-y-2" 
              variant="outline"
              onClick={handleManageFaculty}
            >
              <UserCheck className="h-6 w-6" />
              <span>Manage Faculty</span>
            </Button>
            <Button 
              className="h-auto p-4 flex flex-col items-center space-y-2" 
              variant="outline"
              onClick={handleManageDepartments}
            >
              <Building className="h-6 w-6" />
              <span>Manage Departments</span>
            </Button>
            <Button 
              className="h-auto p-4 flex flex-col items-center space-y-2" 
              variant="outline"
              onClick={handleManageCourses}
            >
              <BookOpen className="h-6 w-6" />
              <span>Manage Courses</span>
            </Button>
            <Button 
              className="h-auto p-4 flex flex-col items-center space-y-2" 
              variant="outline"
              onClick={handlePublishNotice}
            >
              <FileText className="h-6 w-6" />
              <span>Publish Notice</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">New student registration completed</p>
                <p className="text-xs text-muted-foreground">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Faculty member added to Computer Science</p>
                <p className="text-xs text-muted-foreground">4 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">New course published for Mathematics</p>
                <p className="text-xs text-muted-foreground">1 day ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;