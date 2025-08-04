import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BookOpen, Calendar, Edit, Plus, Search, Trash2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

// Mock data - in a real app, this would come from your database
const mockBooks = [
  {
    id: 1,
    title: "The Poetry of Emily Dickinson",
    author: "Emily Dickinson",
    category: "poetry",
    year: 2023,
    description: "A comprehensive collection of Emily Dickinson's poetry",
    filePath: "/books/poetry/emily-dickinson.pdf"
  },
  {
    id: 2,
    title: "Ancient Greek Traditions",
    author: "Classical Studies",
    category: "tradition",
    year: 2022,
    description: "Exploring ancient Greek cultural traditions",
    filePath: "/books/tradition/greek-traditions.pdf"
  },
  {
    id: 3,
    title: "Modern Literature Review",
    author: "Various Authors",
    category: "reading",
    year: 2024,
    description: "Contemporary literature analysis and reviews",
    filePath: "/books/reading/modern-lit.pdf"
  },
  {
    id: 4,
    title: "Shakespeare's Greatest Plays",
    author: "William Shakespeare",
    category: "drama",
    year: 2023,
    description: "Collection of Shakespeare's most famous dramatic works",
    filePath: "/books/drama/shakespeare.pdf"
  },
  {
    id: 5,
    title: "The Art of Origami",
    author: "Origami Masters",
    category: "folding",
    year: 2024,
    description: "Traditional and modern paper folding techniques",
    filePath: "/books/folding/origami-art.pdf"
  }
];

const categoryColors = {
  poetry: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  tradition: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  reading: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  drama: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  folding: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
};

const Books = () => {
  const navigate = useNavigate();
  const { category } = useParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filter books based on category, search term, and year
  const filteredBooks = mockBooks.filter(book => {
    const matchesCategory = !category || category === 'all' || book.category === category;
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesYear = selectedYear === 'all' || book.year.toString() === selectedYear;
    
    return matchesCategory && matchesSearch && matchesYear;
  });

  // Get unique years for filter
  const availableYears = [...new Set(mockBooks.map(book => book.year))].sort().reverse();

  const getCategoryDisplayName = (cat: string) => {
    const categoryNames: Record<string, string> = {
      all: 'All Books',
      poetry: 'Poetry',
      tradition: 'Tradition',
      reading: 'Reading',
      drama: 'Drama',
      folding: 'Folding'
    };
    return categoryNames[cat] || cat;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {getCategoryDisplayName(category || 'all')}
          </h1>
          <p className="text-muted-foreground">
            {filteredBooks.length} {filteredBooks.length === 1 ? 'book' : 'books'} found
          </p>
        </div>
        <Button onClick={() => navigate('/admin/books/new')} className="gap-2">
          <Plus className="h-4 w-4" />
          Add New Book
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search books by title or author..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        <Select value={selectedYear} onValueChange={setSelectedYear}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Filter by year" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Years</SelectItem>
            {availableYears.map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Books Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredBooks.map((book) => (
          <Card key={book.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg line-clamp-2">{book.title}</CardTitle>
                  <CardDescription className="mt-1">{book.author}</CardDescription>
                </div>
                <Badge 
                  variant="secondary" 
                  className={categoryColors[book.category as keyof typeof categoryColors]}
                >
                  {book.category}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {book.description}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  {book.year}
                </div>
                
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <BookOpen className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" className="text-destructive hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredBooks.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No books found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || selectedYear !== 'all' 
              ? 'Try adjusting your search criteria or filters.'
              : 'Get started by adding your first book to the library.'
            }
          </p>
          <Button onClick={() => navigate('/admin/books/new')}>
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Book
          </Button>
        </div>
      )}
    </div>
  );
};

export default Books;