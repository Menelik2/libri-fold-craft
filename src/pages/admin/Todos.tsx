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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

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
    <div className="max-w-7xl mx-auto p-6 bg-white dark:bg-card min-h-screen">
      {/* Document Header */}
      <div className="border-2 border-black dark:border-gray-300 p-6 mb-6 bg-gray-50 dark:bg-card">
        <div className="text-center mb-4">
          <h1 className="text-xl font-bold mb-2">የባህርዳር ፈ/ገ/ቅ/ጊዮርጊስ ካ/ሰ/ት/ ቤት</h1>
          <h2 className="text-lg font-semibold">የዓመታዊ የማነ ጥበብ ዝግጅት ሰንጠረዥ</h2>
          <p className="text-sm mt-2">{getCategoryDisplayName(category || 'all')} - {new Date().getFullYear()}</p>
        </div>
        
        <div className="flex justify-between text-sm">
          <div>ዓመት: ____________</div>
          <div>ቀን: {new Date().toLocaleDateString()}</div>
          <div>ገጽ: 1 ከ 1</div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="ፈልግ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-64"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="ሁኔታ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">ሁሉም</SelectItem>
              <SelectItem value="pending">በመጠባበቅ</SelectItem>
              <SelectItem value="completed">የተጠናቀቀ</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              አዲስ ዝግጅት ጨምር
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editingTodo ? 'ዝግጅት አርም' : 'አዲስ ዝግጅት ጨምር'}
              </DialogTitle>
              <DialogDescription>
                የዓመታዊ የማነ ጥበብ ዝግጅት አዲስ እንቅስቃሴ ይፍጠሩ።
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">የዝግጅት ስም</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="የዝግጅቱን ስም ያስገቡ"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="dates">ቀናት</Label>
                <Input
                  id="dates"
                  value={formData.dates}
                  onChange={(e) => setFormData(prev => ({ ...prev, dates: e.target.value }))}
                  placeholder="ምሳሌ: 2024-03-15 እስከ 2024-03-20"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="place">ስፍራ</Label>
                <Input
                  id="place"
                  value={formData.place}
                  onChange={(e) => setFormData(prev => ({ ...prev, place: e.target.value }))}
                  placeholder="የዝግጅቱን ቦታ ያስገቡ"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="examination">ፈተና</Label>
                <Textarea
                  id="examination"
                  value={formData.examination}
                  onChange={(e) => setFormData(prev => ({ ...prev, examination: e.target.value }))}
                  placeholder="የፈተናው ዝርዝር ይግለጹ"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">ምድብ</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="ምድብ ይምረጡ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="poetry">ግጥም</SelectItem>
                    <SelectItem value="tradition">ወግ</SelectItem>
                    <SelectItem value="reading">ንባብ</SelectItem>
                    <SelectItem value="drama">ድራማ</SelectItem>
                    <SelectItem value="folding">መታጠፊያ</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1">
                  {editingTodo ? 'አዘምን' : 'ጨምር'}
                </Button>
                <Button type="button" variant="outline" onClick={closeDialog}>
                  ተወው
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Official Form Table */}
      <div className="border-2 border-black dark:border-gray-300">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-yellow-200 dark:bg-yellow-800">
              <th className="border border-black dark:border-gray-300 p-2 text-sm font-medium w-12">ተ.ቁ</th>
              <th className="border border-black dark:border-gray-300 p-2 text-sm font-medium">የዝግጅት ስም</th>
              <th className="border border-black dark:border-gray-300 p-2 text-sm font-medium w-32">መጀመሪያ ቀን</th>
              <th className="border border-black dark:border-gray-300 p-2 text-sm font-medium w-32">ማለቂያ ቀን</th>
              <th className="border border-black dark:border-gray-300 p-2 text-sm font-medium w-32">ስፍራ</th>
              <th className="border border-black dark:border-gray-300 p-2 text-sm font-medium w-24">ሁኔታ</th>
              <th className="border border-black dark:border-gray-300 p-2 text-sm font-medium w-24">ፊት ናቅ</th>
              <th className="border border-black dark:border-gray-300 p-2 text-sm font-medium w-20">ዕርምት</th>
            </tr>
          </thead>
          <tbody>
            {filteredTodos.map((todo, index) => (
              <tr key={todo.id} className={`${todo.completed ? 'bg-green-50 dark:bg-green-900/20' : 'bg-white dark:bg-card'} hover:bg-gray-50 dark:hover:bg-card`}>
                <td className="border border-black dark:border-gray-300 p-2 text-center text-sm font-medium">
                  {index + 1}
                </td>
                <td className="border border-black dark:border-gray-300 p-2 text-sm">
                  <div className={todo.completed ? 'line-through text-muted-foreground' : ''}>
                    {todo.name}
                  </div>
                </td>
                <td className="border border-black dark:border-gray-300 p-2 text-sm text-center">
                  {todo.dates.split(' to ')[0] || todo.dates.split(' እስከ ')[0] || todo.dates}
                </td>
                <td className="border border-black dark:border-gray-300 p-2 text-sm text-center">
                  {todo.dates.split(' to ')[1] || todo.dates.split(' እስከ ')[1] || ''}
                </td>
                <td className="border border-black dark:border-gray-300 p-2 text-sm">
                  {todo.place}
                </td>
                <td className="border border-black dark:border-gray-300 p-2 text-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleComplete(todo.id)}
                    className="p-1 h-auto"
                  >
                    {todo.completed ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    ) : (
                      <Circle className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </td>
                <td className="border border-black dark:border-gray-300 p-2 text-sm text-center">
                  {todo.completed ? '✓' : '•'}
                </td>
                <td className="border border-black dark:border-gray-300 p-2">
                  <div className="flex gap-1 justify-center">
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => openEditDialog(todo)}
                      className="p-1 h-auto"
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="text-destructive hover:text-destructive p-1 h-auto"
                      onClick={() => deleteTodo(todo.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            
            {/* Empty rows to maintain form structure */}
            {Array.from({ length: Math.max(0, 10 - filteredTodos.length) }).map((_, index) => (
              <tr key={`empty-${index}`} className="bg-white dark:bg-card">
                <td className="border border-black dark:border-gray-300 p-2 text-center text-sm">
                  {filteredTodos.length + index + 1}
                </td>
                <td className="border border-black dark:border-gray-300 p-2 h-12"></td>
                <td className="border border-black dark:border-gray-300 p-2"></td>
                <td className="border border-black dark:border-gray-300 p-2"></td>
                <td className="border border-black dark:border-gray-300 p-2"></td>
                <td className="border border-black dark:border-gray-300 p-2"></td>
                <td className="border border-black dark:border-gray-300 p-2"></td>
                <td className="border border-black dark:border-gray-300 p-2"></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Signature Section */}
      <div className="mt-8 grid grid-cols-2 gap-8">
        <div className="space-y-4">
          <p className="font-medium">የዝግጅት ኃላፊ ፊርማ፡-</p>
          <div className="border-b border-black dark:border-gray-300 h-12"></div>
          <p className="text-sm">ስም፡ _____________________</p>
        </div>
        <div className="space-y-4">
          <p className="font-medium">የእይታ ኃላፊ ፊርማ፡-</p>
          <div className="border-b border-black dark:border-gray-300 h-12"></div>
          <p className="text-sm">ስም፡ _____________________</p>
        </div>
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