import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle2, Circle, Calendar, MapPin, FileText, Plus, Edit, Trash2, Search } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

interface Todo {
  id: number;
  name: string;
  dates: string;
  place: string;
  examination: string;
  category: string;
  completed: boolean;
  createdAt: string;
}

// Mock data - in a real app, this would come from your database
const mockTodos: Todo[] = [
  {
    id: 1,
    name: "Poetry Workshop Preparation",
    dates: "2024-03-15 to 2024-03-20",
    place: "Central Library",
    examination: "Poetry analysis and creative writing assessment",
    category: "poetry",
    completed: false,
    createdAt: "2024-01-15"
  },
  {
    id: 2,
    name: "Traditional Arts Exhibition",
    dates: "2024-04-10 to 2024-04-15",
    place: "Cultural Center",
    examination: "Traditional arts knowledge test",
    category: "tradition",
    completed: true,
    createdAt: "2024-01-20"
  },
  {
    id: 3,
    name: "Reading Comprehension Seminar",
    dates: "2024-05-01 to 2024-05-05",
    place: "University Hall",
    examination: "Reading comprehension evaluation",
    category: "reading",
    completed: false,
    createdAt: "2024-02-01"
  }
];

const categoryColors = {
  poetry: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  tradition: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  reading: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  drama: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  folding: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
};

const Todos = () => {
  const navigate = useNavigate();
  const { category } = useParams();
  const [todos, setTodos] = useState<Todo[]>(mockTodos);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    dates: '',
    place: '',
    examination: '',
    category: category || 'poetry'
  });

  // Filter todos based on category, search term, and status
  const filteredTodos = todos.filter(todo => {
    const matchesCategory = !category || category === 'all' || todo.category === category;
    const matchesSearch = todo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         todo.place.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'completed' && todo.completed) ||
                         (statusFilter === 'pending' && !todo.completed);
    
    return matchesCategory && matchesSearch && matchesStatus;
  });

  const getCategoryDisplayName = (cat: string) => {
    const categoryNames: Record<string, string> = {
      all: 'All Categories',
      poetry: 'Poetry',
      tradition: 'Tradition',
      reading: 'Reading',
      drama: 'Drama',
      folding: 'Folding'
    };
    return categoryNames[cat] || cat;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingTodo) {
      // Update existing todo
      setTodos(prev => prev.map(todo => 
        todo.id === editingTodo.id 
          ? { ...todo, ...formData }
          : todo
      ));
      toast({
        title: "Todo Updated",
        description: "Your Annual Arts Plan item has been updated successfully.",
      });
      setEditingTodo(null);
    } else {
      // Add new todo
      const newTodo: Todo = {
        id: Date.now(),
        ...formData,
        completed: false,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setTodos(prev => [...prev, newTodo]);
      toast({
        title: "Todo Added",
        description: "New Annual Arts Plan item has been added successfully.",
      });
    }
    
    setFormData({
      name: '',
      dates: '',
      place: '',
      examination: '',
      category: category || 'poetry'
    });
    setIsAddDialogOpen(false);
  };

  const toggleComplete = (id: number) => {
    setTodos(prev => prev.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: number) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
    toast({
      title: "Todo Deleted",
      description: "Annual Arts Plan item has been removed.",
    });
  };

  const openEditDialog = (todo: Todo) => {
    setEditingTodo(todo);
    setFormData({
      name: todo.name,
      dates: todo.dates,
      place: todo.place,
      examination: todo.examination,
      category: todo.category
    });
    setIsAddDialogOpen(true);
  };

  const closeDialog = () => {
    setIsAddDialogOpen(false);
    setEditingTodo(null);
    setFormData({
      name: '',
      dates: '',
      place: '',
      examination: '',
      category: category || 'poetry'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Annual Arts Plan - {getCategoryDisplayName(category || 'all')}
          </h1>
          <p className="text-muted-foreground">
            {filteredTodos.length} {filteredTodos.length === 1 ? 'item' : 'items'} found
          </p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Arts Plan Item
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editingTodo ? 'Edit Arts Plan Item' : 'Add New Arts Plan Item'}
              </DialogTitle>
              <DialogDescription>
                Create a new item for your Annual Arts Plan with all necessary details.
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter event or activity name"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="dates">Dates</Label>
                <Input
                  id="dates"
                  value={formData.dates}
                  onChange={(e) => setFormData(prev => ({ ...prev, dates: e.target.value }))}
                  placeholder="e.g., 2024-03-15 to 2024-03-20"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="place">Place</Label>
                <Input
                  id="place"
                  value={formData.place}
                  onChange={(e) => setFormData(prev => ({ ...prev, place: e.target.value }))}
                  placeholder="Enter venue or location"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="examination">Examination</Label>
                <Textarea
                  id="examination"
                  value={formData.examination}
                  onChange={(e) => setFormData(prev => ({ ...prev, examination: e.target.value }))}
                  placeholder="Describe the examination or assessment details"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
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
              
              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1">
                  {editingTodo ? 'Update Item' : 'Add Item'}
                </Button>
                <Button type="button" variant="outline" onClick={closeDialog}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or place..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Items</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Todos Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredTodos.map((todo) => (
          <Card key={todo.id} className={`hover:shadow-md transition-shadow ${todo.completed ? 'opacity-75' : ''}`}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleComplete(todo.id)}
                      className="p-0 h-auto"
                    >
                      {todo.completed ? (
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      ) : (
                        <Circle className="h-5 w-5 text-muted-foreground" />
                      )}
                    </Button>
                    <CardTitle className={`text-lg line-clamp-2 ${todo.completed ? 'line-through text-muted-foreground' : ''}`}>
                      {todo.name}
                    </CardTitle>
                  </div>
                </div>
                <Badge 
                  variant="secondary" 
                  className={categoryColors[todo.category as keyof typeof categoryColors]}
                >
                  {todo.category}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{todo.dates}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{todo.place}</span>
                </div>
                
                <div className="flex items-start gap-2 text-sm">
                  <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <span className="line-clamp-2">{todo.examination}</span>
                </div>
              </div>
              
              <div className="flex gap-2 mt-4">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => openEditDialog(todo)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="text-destructive hover:text-destructive"
                  onClick={() => deleteTodo(todo.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredTodos.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No arts plan items found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || statusFilter !== 'all' 
              ? 'Try adjusting your search criteria or filters.'
              : 'Get started by adding your first Annual Arts Plan item.'
            }
          </p>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Item
          </Button>
        </div>
      )}
    </div>
  );
};

export default Todos;