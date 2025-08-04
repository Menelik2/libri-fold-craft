import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Calendar, FolderOpen, Plus, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  // Mock data - in a real app, this would come from your database
  const stats = {
    totalBooks: 247,
    poetry: 68,
    tradition: 45,
    reading: 89,
    drama: 32,
    folding: 13,
    recentlyAdded: 12
  };

  const categories = [
    { name: 'Poetry', count: stats.poetry, icon: BookOpen, color: 'text-blue-600', url: '/admin/books/poetry' },
    { name: 'Tradition', count: stats.tradition, icon: BookOpen, color: 'text-green-600', url: '/admin/books/tradition' },
    { name: 'Reading', count: stats.reading, icon: BookOpen, color: 'text-purple-600', url: '/admin/books/reading' },
    { name: 'Drama', count: stats.drama, icon: BookOpen, color: 'text-red-600', url: '/admin/books/drama' },
    { name: 'Folding', count: stats.folding, icon: FolderOpen, color: 'text-orange-600', url: '/admin/books/folding' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to your digital library management system
          </p>
        </div>
        <Button onClick={() => navigate('/admin/books/new')} className="gap-2">
          <Plus className="h-4 w-4" />
          Add New Book
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Books</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBooks}</div>
            <p className="text-xs text-muted-foreground">
              Across all categories
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recently Added</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.recentlyAdded}</div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">
              Active categories
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Year</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2024</div>
            <p className="text-xs text-muted-foreground">
              Current year focus
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Categories Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <Card 
            key={category.name} 
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => navigate(category.url)}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{category.name}</CardTitle>
              <category.icon className={`h-4 w-4 ${category.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{category.count}</div>
              <p className="text-xs text-muted-foreground">
                {category.count === 1 ? 'book' : 'books'} in collection
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common tasks for managing your digital library
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Button 
            variant="outline" 
            className="h-20 flex-col gap-2"
            onClick={() => navigate('/admin/books/new')}
          >
            <Plus className="h-5 w-5" />
            Add Book
          </Button>
          <Button 
            variant="outline" 
            className="h-20 flex-col gap-2"
            onClick={() => navigate('/admin/books')}
          >
            <BookOpen className="h-5 w-5" />
            Browse All
          </Button>
          <Button 
            variant="outline" 
            className="h-20 flex-col gap-2"
            onClick={() => navigate('/admin/yearly')}
          >
            <Calendar className="h-5 w-5" />
            Yearly View
          </Button>
          <Button 
            variant="outline" 
            className="h-20 flex-col gap-2"
            onClick={() => navigate('/admin/settings')}
          >
            <BookOpen className="h-5 w-5" />
            Settings
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;