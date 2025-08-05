import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { BookOpen, Calendar, Edit, Plus, Search, Trash2, MessageSquare } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import PDFViewer from '@/components/PDFViewer';

// Mock data - in a real app, this would come from your database
const mockBooks = [
  {
    id: 1,
    title: "The Poetry of Emily Dickinson",
    author: "Emily Dickinson",
    category: "poetry",
    year: 2023,
    description: "A comprehensive collection of Emily Dickinson's poetry",
    filePath: "/books/poetry/emily-dickinson.pdf",
    comments: [
      { id: 1, text: "Excellent collection for poetry students", admin: "Admin", date: "2024-01-15" },
      { id: 2, text: "Recommended for advanced literature courses", admin: "Admin", date: "2024-01-20" }
    ]
  },
  {
    id: 2,
    title: "Ancient Greek Traditions",
    author: "Classical Studies",
    category: "tradition",
    year: 2022,
    description: "Exploring ancient Greek cultural traditions",
    filePath: "/books/tradition/greek-traditions.pdf",
    comments: [
      { id: 3, text: "Great resource for cultural studies", admin: "Admin", date: "2024-01-10" }
    ]
  },
  {
    id: 3,
    title: "Modern Literature Review",
    author: "Various Authors",
    category: "reading",
    year: 2024,
    description: "Contemporary literature analysis and reviews",
    filePath: "/books/reading/modern-lit.pdf",
    comments: []
  },
  {
    id: 4,
    title: "Shakespeare's Greatest Plays",
    author: "William Shakespeare",
    category: "drama",
    year: 2023,
    description: "Collection of Shakespeare's most famous dramatic works",
    filePath: "/books/drama/shakespeare.pdf",
    comments: [
      { id: 4, text: "Essential reading for drama students", admin: "Admin", date: "2024-02-01" }
    ]
  },
  {
    id: 5,
    title: "The Art of Origami",
    author: "Origami Masters",
    category: "folding",
    year: 2024,
    description: "Traditional and modern paper folding techniques",
    filePath: "/books/folding/origami-art.pdf",
    comments: []
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
  const [books, setBooks] = useState(mockBooks);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isCommentDialogOpen, setIsCommentDialogOpen] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState<number | null>(null);
  const [newComment, setNewComment] = useState('');
  const [isAddBookDialogOpen, setIsAddBookDialogOpen] = useState(false);
  const [isPDFViewerOpen, setIsPDFViewerOpen] = useState(false);
  const [selectedPDFBook, setSelectedPDFBook] = useState<any>(null);
  const [bookFormData, setBookFormData] = useState({
    title: '',
    author: '',
    category: 'poetry',
    year: new Date().getFullYear(),
    description: '',
    filePath: ''
  });

  // Filter books based on category, search term, and year
  const filteredBooks = books.filter(book => {
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

  const addComment = () => {
    if (!newComment.trim() || !selectedBookId) return;
    
    setBooks(prev => prev.map(book => 
      book.id === selectedBookId 
        ? {
            ...book,
            comments: [
              ...book.comments,
              {
                id: Date.now(),
                text: newComment,
                admin: "Admin",
                date: new Date().toISOString().split('T')[0]
              }
            ]
          }
        : book
    ));
    
    setNewComment('');
    setIsCommentDialogOpen(false);
    setSelectedBookId(null);
    
    toast({
      title: "Comment Added",
      description: "Your feedback has been added to the book.",
    });
  };

  const openCommentDialog = (bookId: number) => {
    setSelectedBookId(bookId);
    setIsCommentDialogOpen(true);
  };

  const openPDFViewer = (book: any) => {
    setSelectedPDFBook(book);
    setIsPDFViewerOpen(true);
  };

  const addBook = () => {
    if (!bookFormData.title.trim() || !bookFormData.author.trim()) return;
    
    const newBook = {
      id: Date.now(),
      ...bookFormData,
      comments: []
    };
    
    setBooks(prev => [...prev, newBook]);
    
    setBookFormData({
      title: '',
      author: '',
      category: 'poetry',
      year: new Date().getFullYear(),
      description: '',
      filePath: ''
    });
    
    setIsAddBookDialogOpen(false);
    
    toast({
      title: "Book Added",
      description: "New book has been added to the library successfully.",
    });
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
        <Button onClick={() => setIsAddBookDialogOpen(true)} className="gap-2">
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
              
              {/* Comments Display */}
              {book.comments.length > 0 && (
                <div className="mb-3 p-2 bg-muted/30 rounded-md">
                  <div className="flex items-center gap-1 mb-2">
                    <MessageSquare className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground font-medium">
                      Admin Feedback ({book.comments.length})
                    </span>
                  </div>
                  <div className="space-y-1">
                    {book.comments.slice(0, 2).map((comment) => (
                      <div key={comment.id} className="text-xs text-muted-foreground">
                        <span className="font-medium">"{comment.text}"</span>
                        <span className="text-xs opacity-70 ml-1">- {comment.date}</span>
                      </div>
                    ))}
                    {book.comments.length > 2 && (
                      <div className="text-xs text-muted-foreground opacity-70">
                        +{book.comments.length - 2} more comments
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  {book.year}
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => openCommentDialog(book.id)}
                    title="Add Comment"
                  >
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => openPDFViewer(book)}
                    title="Open PDF"
                  >
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

      {/* Comment Dialog */}
      <Dialog open={isCommentDialogOpen} onOpenChange={setIsCommentDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Admin Feedback</DialogTitle>
            <DialogDescription>
              Add your feedback or comment for this book. This will be visible to other admins and users.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="comment">Your Feedback</Label>
              <Textarea
                id="comment"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Enter your feedback or comment about this book..."
                rows={4}
              />
            </div>
            
            <div className="flex gap-2 pt-4">
              <Button 
                onClick={addComment} 
                className="flex-1"
                disabled={!newComment.trim()}
              >
                Add Feedback
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setIsCommentDialogOpen(false);
                  setNewComment('');
                  setSelectedBookId(null);
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Book Dialog */}
      <Dialog open={isAddBookDialogOpen} onOpenChange={setIsAddBookDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Book</DialogTitle>
            <DialogDescription>
              Add a new book to the library with all necessary details.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={bookFormData.title}
                onChange={(e) => setBookFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter book title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="author">Author</Label>
              <Input
                id="author"
                value={bookFormData.author}
                onChange={(e) => setBookFormData(prev => ({ ...prev, author: e.target.value }))}
                placeholder="Enter author name"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={bookFormData.category} onValueChange={(value) => setBookFormData(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="poetry">Poetry</SelectItem>
                    <SelectItem value="tradition">Tradition</SelectItem>
                    <SelectItem value="reading">Reading</SelectItem>
                    <SelectItem value="drama">Drama</SelectItem>
                    <SelectItem value="folding">Folding</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  type="number"
                  value={bookFormData.year}
                  onChange={(e) => setBookFormData(prev => ({ ...prev, year: parseInt(e.target.value) || new Date().getFullYear() }))}
                  placeholder="Publication year"
                  min="1900"
                  max="2030"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={bookFormData.description}
                onChange={(e) => setBookFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter book description"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="filePath">File Path</Label>
              <Input
                id="filePath"
                value={bookFormData.filePath}
                onChange={(e) => setBookFormData(prev => ({ ...prev, filePath: e.target.value }))}
                placeholder="Enter file path (e.g., /books/poetry/book.pdf)"
              />
            </div>
            
            <div className="flex gap-2 pt-4">
              <Button 
                onClick={addBook} 
                className="flex-1"
                disabled={!bookFormData.title.trim() || !bookFormData.author.trim()}
              >
                Add Book
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setIsAddBookDialogOpen(false);
                  setBookFormData({
                    title: '',
                    author: '',
                    category: 'poetry',
                    year: new Date().getFullYear(),
                    description: '',
                    filePath: ''
                  });
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* PDF Viewer */}
      {selectedPDFBook && (
        <PDFViewer
          isOpen={isPDFViewerOpen}
          onClose={() => {
            setIsPDFViewerOpen(false);
            setSelectedPDFBook(null);
          }}
          pdfUrl={selectedPDFBook.filePath}
          title={selectedPDFBook.title}
        />
      )}
    </div>
  );
};

export default Books;