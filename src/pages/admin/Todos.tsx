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
import { Checkbox } from '@/components/ui/checkbox';

interface Todo {
  id: number;
  detailedTask: string;
  measure: string;
  quantity: string;
  workWith: string;
  firstQuarter: {
    july: boolean;
    august: boolean;
    september: boolean;
  };
  secondQuarter: {
    october: boolean;
    november: boolean;
    december: boolean;
  };
  thirdQuarter: {
    january: boolean;
    february: boolean;
    march: boolean;
  };
  fourthQuarter: {
    april: boolean;
    may: boolean;
    june: boolean;
  };
  budgetRequested: string;
  approvedBudget: string;
  cost: string;
  income: string;
  year: string;
  completed: boolean;
  createdAt: string;
}

// Mock data - in a real app, this would come from your database
const mockTodos: Todo[] = [
  {
    id: 1,
    detailedTask: "Poetry Workshop Preparation",
    measure: "Workshop sessions",
    quantity: "5 sessions",
    workWith: "Central Library Staff",
    firstQuarter: { july: true, august: false, september: true },
    secondQuarter: { october: false, november: false, december: false },
    thirdQuarter: { january: false, february: false, march: false },
    fourthQuarter: { april: false, may: false, june: false },
    budgetRequested: "15,000",
    approvedBudget: "12,000",
    cost: "10,500",
    income: "0",
    year: "2024",
    completed: false,
    createdAt: "2024-01-15"
  },
  {
    id: 2,
    detailedTask: "Traditional Arts Exhibition",
    measure: "Exhibition days",
    quantity: "10 days",
    workWith: "Cultural Center",
    firstQuarter: { july: false, august: false, september: false },
    secondQuarter: { october: true, november: true, december: false },
    thirdQuarter: { january: false, february: false, march: false },
    fourthQuarter: { april: false, may: false, june: false },
    budgetRequested: "25,000",
    approvedBudget: "20,000",
    cost: "18,000",
    income: "5,000",
    year: "2024",
    completed: true,
    createdAt: "2024-01-20"
  },
  {
    id: 3,
    detailedTask: "Reading Comprehension Seminar",
    measure: "Training hours",
    quantity: "40 hours",
    workWith: "University Department",
    firstQuarter: { july: false, august: false, september: false },
    secondQuarter: { october: false, november: false, december: false },
    thirdQuarter: { january: true, february: true, march: false },
    fourthQuarter: { april: false, may: false, june: false },
    budgetRequested: "8,000",
    approvedBudget: "8,000",
    cost: "7,500",
    income: "2,000",
    year: "2024",
    completed: false,
    createdAt: "2024-02-01"
  }
];

const Todos = () => {
  const navigate = useNavigate();
  const { year } = useParams();
  const [todos, setTodos] = useState<Todo[]>(mockTodos);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  
  const [formData, setFormData] = useState({
    detailedTask: '',
    measure: '',
    quantity: '',
    workWith: '',
    firstQuarter: { july: false, august: false, september: false },
    secondQuarter: { october: false, november: false, december: false },
    thirdQuarter: { january: false, february: false, march: false },
    fourthQuarter: { april: false, may: false, june: false },
    budgetRequested: '',
    approvedBudget: '',
    cost: '',
    income: '',
    year: year || '2024'
  });

  // Filter todos based on year, search term, and status
  const filteredTodos = todos.filter(todo => {
    const matchesYear = !year || year === 'all' || todo.year === year;
    const matchesSearch = todo.detailedTask.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         todo.workWith.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'completed' && todo.completed) ||
                         (statusFilter === 'pending' && !todo.completed);
    
    return matchesYear && matchesSearch && matchesStatus;
  });

  const getYearDisplayName = (yr: string) => {
    if (yr === 'all') return 'All Years';
    return yr;
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
      detailedTask: '',
      measure: '',
      quantity: '',
      workWith: '',
      firstQuarter: { july: false, august: false, september: false },
      secondQuarter: { october: false, november: false, december: false },
      thirdQuarter: { january: false, february: false, march: false },
      fourthQuarter: { april: false, may: false, june: false },
      budgetRequested: '',
      approvedBudget: '',
      cost: '',
      income: '',
      year: year || '2024'
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
      detailedTask: todo.detailedTask,
      measure: todo.measure,
      quantity: todo.quantity,
      workWith: todo.workWith,
      firstQuarter: todo.firstQuarter,
      secondQuarter: todo.secondQuarter,
      thirdQuarter: todo.thirdQuarter,
      fourthQuarter: todo.fourthQuarter,
      budgetRequested: todo.budgetRequested,
      approvedBudget: todo.approvedBudget,
      cost: todo.cost,
      income: todo.income,
      year: todo.year
    });
    setIsAddDialogOpen(true);
  };

  const closeDialog = () => {
    setIsAddDialogOpen(false);
    setEditingTodo(null);
    setFormData({
      detailedTask: '',
      measure: '',
      quantity: '',
      workWith: '',
      firstQuarter: { july: false, august: false, september: false },
      secondQuarter: { october: false, november: false, december: false },
      thirdQuarter: { january: false, february: false, march: false },
      fourthQuarter: { april: false, may: false, june: false },
      budgetRequested: '',
      approvedBudget: '',
      cost: '',
      income: '',
      year: year || '2024'
    });
  };

  return (
    <div className="max-w-full mx-auto p-6 bg-white dark:bg-card min-h-screen overflow-x-auto">
      {/* Document Header */}
      <div className="border-2 border-black dark:border-gray-300 p-6 mb-6 bg-gray-50 dark:bg-card">
        <div className="text-center mb-4">
          <h1 className="text-xl font-bold mb-2">የባህርዳር ፈ/ገ/ቅ/ጊዮርጊስ ካ/ሰ/ት/ ቤት</h1>
          <h2 className="text-lg font-semibold">የዓመታዊ የማነ ጥበብ ዝግጅት ሰንጠረዥ</h2>
          <p className="text-sm mt-2">{getYearDisplayName(year || 'all')} - {new Date().getFullYear()}</p>
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
          <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingTodo ? 'ዝግጅት አርም' : 'አዲስ ዝግጅት ጨምር'}
              </DialogTitle>
              <DialogDescription>
                የዓመታዊ የማነ ጥበብ ዝግጅት አዲስ እንቅስቃሴ ይፍጠሩ።
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="detailedTask">Detailed Task</Label>
                  <Input
                    id="detailedTask"
                    value={formData.detailedTask}
                    onChange={(e) => setFormData(prev => ({ ...prev, detailedTask: e.target.value }))}
                    placeholder="Enter detailed task"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="measure">Measure</Label>
                  <Input
                    id="measure"
                    value={formData.measure}
                    onChange={(e) => setFormData(prev => ({ ...prev, measure: e.target.value }))}
                    placeholder="Enter measure"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    value={formData.quantity}
                    onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                    placeholder="Enter quantity"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="workWith">Who will we work with?</Label>
                  <Input
                    id="workWith"
                    value={formData.workWith}
                    onChange={(e) => setFormData(prev => ({ ...prev, workWith: e.target.value }))}
                    placeholder="Enter collaboration partners"
                    required
                  />
                </div>
              </div>

              {/* Quarter selections */}
              <div className="space-y-4">
                <Label>Select months for each quarter:</Label>
                
                <div className="grid grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">1st Quarter</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="july"
                          checked={formData.firstQuarter.july}
                          onCheckedChange={(checked) => 
                            setFormData(prev => ({ 
                              ...prev, 
                              firstQuarter: { ...prev.firstQuarter, july: checked as boolean }
                            }))
                          }
                        />
                        <Label htmlFor="july" className="text-sm">July</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="august"
                          checked={formData.firstQuarter.august}
                          onCheckedChange={(checked) => 
                            setFormData(prev => ({ 
                              ...prev, 
                              firstQuarter: { ...prev.firstQuarter, august: checked as boolean }
                            }))
                          }
                        />
                        <Label htmlFor="august" className="text-sm">August</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="september"
                          checked={formData.firstQuarter.september}
                          onCheckedChange={(checked) => 
                            setFormData(prev => ({ 
                              ...prev, 
                              firstQuarter: { ...prev.firstQuarter, september: checked as boolean }
                            }))
                          }
                        />
                        <Label htmlFor="september" className="text-sm">September</Label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">2nd Quarter</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="october"
                          checked={formData.secondQuarter.october}
                          onCheckedChange={(checked) => 
                            setFormData(prev => ({ 
                              ...prev, 
                              secondQuarter: { ...prev.secondQuarter, october: checked as boolean }
                            }))
                          }
                        />
                        <Label htmlFor="october" className="text-sm">October</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="november"
                          checked={formData.secondQuarter.november}
                          onCheckedChange={(checked) => 
                            setFormData(prev => ({ 
                              ...prev, 
                              secondQuarter: { ...prev.secondQuarter, november: checked as boolean }
                            }))
                          }
                        />
                        <Label htmlFor="november" className="text-sm">November</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="december"
                          checked={formData.secondQuarter.december}
                          onCheckedChange={(checked) => 
                            setFormData(prev => ({ 
                              ...prev, 
                              secondQuarter: { ...prev.secondQuarter, december: checked as boolean }
                            }))
                          }
                        />
                        <Label htmlFor="december" className="text-sm">December</Label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">3rd Quarter</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="january"
                          checked={formData.thirdQuarter.january}
                          onCheckedChange={(checked) => 
                            setFormData(prev => ({ 
                              ...prev, 
                              thirdQuarter: { ...prev.thirdQuarter, january: checked as boolean }
                            }))
                          }
                        />
                        <Label htmlFor="january" className="text-sm">January</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="february"
                          checked={formData.thirdQuarter.february}
                          onCheckedChange={(checked) => 
                            setFormData(prev => ({ 
                              ...prev, 
                              thirdQuarter: { ...prev.thirdQuarter, february: checked as boolean }
                            }))
                          }
                        />
                        <Label htmlFor="february" className="text-sm">February</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="march"
                          checked={formData.thirdQuarter.march}
                          onCheckedChange={(checked) => 
                            setFormData(prev => ({ 
                              ...prev, 
                              thirdQuarter: { ...prev.thirdQuarter, march: checked as boolean }
                            }))
                          }
                        />
                        <Label htmlFor="march" className="text-sm">March</Label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">4th Quarter</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="april"
                          checked={formData.fourthQuarter.april}
                          onCheckedChange={(checked) => 
                            setFormData(prev => ({ 
                              ...prev, 
                              fourthQuarter: { ...prev.fourthQuarter, april: checked as boolean }
                            }))
                          }
                        />
                        <Label htmlFor="april" className="text-sm">April</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="may"
                          checked={formData.fourthQuarter.may}
                          onCheckedChange={(checked) => 
                            setFormData(prev => ({ 
                              ...prev, 
                              fourthQuarter: { ...prev.fourthQuarter, may: checked as boolean }
                            }))
                          }
                        />
                        <Label htmlFor="may" className="text-sm">May</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="june"
                          checked={formData.fourthQuarter.june}
                          onCheckedChange={(checked) => 
                            setFormData(prev => ({ 
                              ...prev, 
                              fourthQuarter: { ...prev.fourthQuarter, june: checked as boolean }
                            }))
                          }
                        />
                        <Label htmlFor="june" className="text-sm">June</Label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="budgetRequested">Budget Requested by Department</Label>
                  <Input
                    id="budgetRequested"
                    value={formData.budgetRequested}
                    onChange={(e) => setFormData(prev => ({ ...prev, budgetRequested: e.target.value }))}
                    placeholder="Enter budget requested"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="approvedBudget">Approved Budget</Label>
                  <Input
                    id="approvedBudget"
                    value={formData.approvedBudget}
                    onChange={(e) => setFormData(prev => ({ ...prev, approvedBudget: e.target.value }))}
                    placeholder="Enter approved budget"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cost">Cost</Label>
                  <Input
                    id="cost"
                    value={formData.cost}
                    onChange={(e) => setFormData(prev => ({ ...prev, cost: e.target.value }))}
                    placeholder="Enter cost"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="income">Income</Label>
                  <Input
                    id="income"
                    value={formData.income}
                    onChange={(e) => setFormData(prev => ({ ...prev, income: e.target.value }))}
                    placeholder="Enter income"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="year">Year</Label>
                <Select value={formData.year} onValueChange={(value) => setFormData(prev => ({ ...prev, year: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2025">2025</SelectItem>
                    <SelectItem value="2026">2026</SelectItem>
                    <SelectItem value="2027">2027</SelectItem>
                    <SelectItem value="2028">2028</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1">
                  {editingTodo ? 'Update' : 'Add'}
                </Button>
                <Button type="button" variant="outline" onClick={closeDialog}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Official Form Table */}
      <div className="border-2 border-black dark:border-gray-300 overflow-x-auto">
        <table className="w-full border-collapse min-w-[1600px]">
            <thead>
             <tr className="bg-white dark:bg-card">
               <th className="border border-black dark:border-gray-300 p-2 text-sm font-medium w-12" rowSpan={2}>No</th>
               <th className="border border-black dark:border-gray-300 p-2 text-sm font-medium min-w-[200px]" rowSpan={2}>detailed task</th>
               <th className="border border-black dark:border-gray-300 p-2 text-sm font-medium w-20" rowSpan={2}>Measure</th>
               <th className="border border-black dark:border-gray-300 p-2 text-sm font-medium w-20" rowSpan={2}>Quantity</th>
               <th className="border border-black dark:border-gray-300 p-2 text-sm font-medium w-32" rowSpan={2}>Who will we work with?</th>
               <th className="border border-black dark:border-gray-300 p-2 text-sm font-medium" colSpan={3}>1st quarter</th>
               <th className="border border-black dark:border-gray-300 p-2 text-sm font-medium" colSpan={3}>2nd quarter</th>
               <th className="border border-black dark:border-gray-300 p-2 text-sm font-medium" colSpan={3}>3rd quarter</th>
               <th className="border border-black dark:border-gray-300 p-2 text-sm font-medium" colSpan={3}>4th quarter</th>
               <th className="border border-black dark:border-gray-300 p-2 text-sm font-medium w-24" rowSpan={2}>The budget requested by the department</th>
               <th className="border border-black dark:border-gray-300 p-2 text-sm font-medium" colSpan={2}>Approved budget</th>
               <th className="border border-black dark:border-gray-300 p-2 text-sm font-medium w-32" rowSpan={2}>Actions</th>
             </tr>
             <tr className="bg-yellow-200 dark:bg-yellow-800">
               <th className="border border-black dark:border-gray-300 p-1 text-xs">July</th>
               <th className="border border-black dark:border-gray-300 p-1 text-xs">August</th>
               <th className="border border-black dark:border-gray-300 p-1 text-xs">September</th>
               <th className="border border-black dark:border-gray-300 p-1 text-xs">October</th>
               <th className="border border-black dark:border-gray-300 p-1 text-xs">November</th>
               <th className="border border-black dark:border-gray-300 p-1 text-xs">December</th>
               <th className="border border-black dark:border-gray-300 p-1 text-xs">January</th>
               <th className="border border-black dark:border-gray-300 p-1 text-xs">February</th>
               <th className="border border-black dark:border-gray-300 p-1 text-xs">March</th>
               <th className="border border-black dark:border-gray-300 p-1 text-xs">April</th>
               <th className="border border-black dark:border-gray-300 p-1 text-xs">May</th>
               <th className="border border-black dark:border-gray-300 p-1 text-xs">June</th>
               <th className="border border-black dark:border-gray-300 p-1 text-xs w-20">Cost</th>
               <th className="border border-black dark:border-gray-300 p-1 text-xs w-20">Income</th>
             </tr>
           </thead>
           <tbody>
             {filteredTodos.map((todo, index) => (
               <tr 
                 key={todo.id} 
                 className={`${todo.completed ? 'bg-green-50 dark:bg-green-900/20' : 'bg-white dark:bg-card'} hover:bg-gray-50 dark:hover:bg-card cursor-pointer`}
                 onDoubleClick={() => openEditDialog(todo)}
                 title="Double-click to edit"
               >
                <td className="border border-black dark:border-gray-300 p-2 text-center text-sm font-medium">
                  {index + 1}
                </td>
                <td className="border border-black dark:border-gray-300 p-2 text-sm">
                  <div className={todo.completed ? 'line-through text-muted-foreground' : ''}>
                    {todo.detailedTask}
                  </div>
                </td>
                <td className="border border-black dark:border-gray-300 p-2 text-sm text-center">
                  {todo.measure}
                </td>
                <td className="border border-black dark:border-gray-300 p-2 text-sm text-center">
                  {todo.quantity}
                </td>
                <td className="border border-black dark:border-gray-300 p-2 text-sm">
                  {todo.workWith}
                </td>
                {/* 1st Quarter */}
                <td className="border border-black dark:border-gray-300 p-2 text-center">
                  {todo.firstQuarter.july ? '✓' : ''}
                </td>
                <td className="border border-black dark:border-gray-300 p-2 text-center">
                  {todo.firstQuarter.august ? '✓' : ''}
                </td>
                <td className="border border-black dark:border-gray-300 p-2 text-center">
                  {todo.firstQuarter.september ? '✓' : ''}
                </td>
                {/* 2nd Quarter */}
                <td className="border border-black dark:border-gray-300 p-2 text-center">
                  {todo.secondQuarter.october ? '✓' : ''}
                </td>
                <td className="border border-black dark:border-gray-300 p-2 text-center">
                  {todo.secondQuarter.november ? '✓' : ''}
                </td>
                <td className="border border-black dark:border-gray-300 p-2 text-center">
                  {todo.secondQuarter.december ? '✓' : ''}
                </td>
                {/* 3rd Quarter */}
                <td className="border border-black dark:border-gray-300 p-2 text-center">
                  {todo.thirdQuarter.january ? '✓' : ''}
                </td>
                <td className="border border-black dark:border-gray-300 p-2 text-center">
                  {todo.thirdQuarter.february ? '✓' : ''}
                </td>
                <td className="border border-black dark:border-gray-300 p-2 text-center">
                  {todo.thirdQuarter.march ? '✓' : ''}
                </td>
                {/* 4th Quarter */}
                <td className="border border-black dark:border-gray-300 p-2 text-center">
                  {todo.fourthQuarter.april ? '✓' : ''}
                </td>
                <td className="border border-black dark:border-gray-300 p-2 text-center">
                  {todo.fourthQuarter.may ? '✓' : ''}
                </td>
                <td className="border border-black dark:border-gray-300 p-2 text-center">
                  {todo.fourthQuarter.june ? '✓' : ''}
                </td>
                 {/* Budget columns */}
                 <td className="border border-black dark:border-gray-300 p-2 text-sm text-center">
                   {todo.budgetRequested}
                 </td>
                 <td className="border border-black dark:border-gray-300 p-2 text-sm text-center">
                   {todo.cost}
                 </td>
                 <td className="border border-black dark:border-gray-300 p-2 text-sm text-center">
                   {todo.income}
                 </td>
                 {/* Actions column */}
                 <td className="border border-black dark:border-gray-300 p-2">
                   <div className="flex gap-1 justify-center">
                     <Button
                       size="sm"
                       variant={todo.completed ? "default" : "outline"}
                       onClick={(e) => {
                         e.stopPropagation();
                         toggleComplete(todo.id);
                       }}
                       className="h-7 w-7 p-0"
                       title={todo.completed ? "Mark as incomplete" : "Mark as complete"}
                     >
                       {todo.completed ? <CheckCircle2 className="h-3 w-3" /> : <Circle className="h-3 w-3" />}
                     </Button>
                     <Button
                       size="sm"
                       variant="outline"
                       onClick={(e) => {
                         e.stopPropagation();
                         openEditDialog(todo);
                       }}
                       className="h-7 w-7 p-0"
                       title="Edit task"
                     >
                       <Edit className="h-3 w-3" />
                     </Button>
                     <Button
                       size="sm"
                       variant="destructive"
                       onClick={(e) => {
                         e.stopPropagation();
                         if (confirm("Are you sure you want to delete this task?")) {
                           deleteTodo(todo.id);
                         }
                       }}
                       className="h-7 w-7 p-0"
                       title="Delete task"
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
                  <td className="border border-black dark:border-gray-300 p-2"></td>
                  <td className="border border-black dark:border-gray-300 p-2"></td>
                  <td className="border border-black dark:border-gray-300 p-2"></td>
                  <td className="border border-black dark:border-gray-300 p-2"></td>
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