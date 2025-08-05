import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Shield, Database } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
const Index = () => {
  const navigate = useNavigate();
  const {
    isAuthenticated
  } = useAuth();
  return <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Header */}
      <header className="p-6 border-b bg-background/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <BookOpen className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Digital Library</h1>
              <p className="text-sm text-muted-foreground">Management System</p>
            </div>
          </div>
          <div className="flex gap-3">
            {isAuthenticated ? <Button onClick={() => navigate('/admin')}>
                Go to Dashboard
              </Button> : <Button onClick={() => navigate('/login')}>
                <Shield className="h-4 w-4 mr-2" />
                Admin Login
              </Button>}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold tracking-tight mb-6">የባህርዳር ፈ/ገ/ቅ/ጊዮርጊስ ካ/ሰ/ት/ ቤት 
የማነ ጥበብ ዝግጅት ክፍል </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            A comprehensive local application for organizing and managing your collection of 
            literary works including poetry, traditional texts, drama, and folding materials.
          </p>
          {!isAuthenticated && <Button size="lg" onClick={() => navigate('/login')} className="gap-2">
              <Shield className="h-5 w-5" />
              Get Started
            </Button>}
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card>
            <CardHeader>
              <BookOpen className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Comprehensive Management</CardTitle>
              <CardDescription>
                Full CRUD operations for managing your PDF book collection with detailed metadata
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Database className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Smart Categorization</CardTitle>
              <CardDescription>
                Organize books by Poetry, Tradition, Reading, Drama, and Folding with year-based filtering
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Shield className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Local & Secure</CardTitle>
              <CardDescription>
                Runs entirely on your local computer with no cloud dependencies for maximum privacy
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Categories Preview */}
        <div className="grid md:grid-cols-5 gap-4">
          {[{
          name: 'Poetry',
          description: 'Verse and poetic works'
        }, {
          name: 'Tradition',
          description: 'Cultural and traditional texts'
        }, {
          name: 'Reading',
          description: 'General literature collection'
        }, {
          name: 'Drama',
          description: 'Theatrical and dramatic works'
        }, {
          name: 'Folding',
          description: 'Paper art and origami guides'
        }].map(category => <Card key={category.name} className="text-center hover:shadow-md transition-shadow">
              <CardHeader>
                <BookOpen className="h-8 w-8 text-primary mx-auto mb-2" />
                <CardTitle className="text-lg">{category.name}</CardTitle>
                <CardDescription className="text-sm">
                  {category.description}
                </CardDescription>
              </CardHeader>
            </Card>)}
        </div>
      </main>
    </div>;
};
export default Index;