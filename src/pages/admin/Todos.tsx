import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle2, Circle, Calendar, MapPin, FileText, Plus, Edit, Trash2, Search, Save } from 'lucide-react';
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

// Categories to remove (case-insensitive, substring match)
const removedCategories = [
  'Poetry',
  'Tradition',
  'Reading',
  'Drama',
  'Folding'
];

// Signature info per year
interface YearSignature {
  organizer: { name: string; date: string; signature: string };
  approver: { name: string; date: string; signature: string };
}
const getDefaultSignature = () => ({
  organizer: { name: '', date: '', signature: '' },
  approver: { name: '', date: '', signature: '' },
});

// Initial years
const initialYears = ["2024", "2025", "2026"];

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

// Utility to check if a detailedTask matches any removed category
function isRemovedCategory(task: string): boolean {
  return removedCategories.some(cat =>
    task.toLowerCase().includes(cat.toLowerCase())
  );
}

const Todos = () => {
  const navigate = useNavigate();
  const { year: urlYear } = useParams();

  // Years state
  const [years, setYears] = useState<string[]>(initialYears);
  const [selectedYear, setSelectedYear] = useState<string>(urlYear || initialYears[0]);
  // Signature state
  const [yearSignatures, setYearSignatures] = useState<Record<string, YearSignature>>(
    initialYears.reduce((acc, yr) => ({ ...acc, [yr]: getDefaultSignature() }), {})
  );
  // Tasks
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
    year: selectedYear
  });

  // Update form year when selectedYear changes
  React.useEffect(() => {
    setFormData(prev => ({ ...prev, year: selectedYear }));
  }, [selectedYear]);

  // Add new year
  const handleAddYear = () => {
    const nextYear = (parseInt(years[years.length - 1]) + 1).toString();
    setYears(prev => [...prev, nextYear]);
    setYearSignatures(prev => ({ ...prev, [nextYear]: getDefaultSignature() }));
    setSelectedYear(nextYear);
  };

  // Save tasks handler (simulate saving to server)
  const handleSaveTasks = () => {
    toast({
      title: "Tasks Saved",
      description: `Tasks for year ${selectedYear} have been saved.`,
      variant: "success"
    });
  };

  // Add/Edit task
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isRemovedCategory(formData.detailedTask)) {
      toast({
        title: "Invalid Category",
        description: "Cannot add Poetry, Tradition, Reading, Drama, Folding tasks.",
        variant: "destructive"
      });
      return;
    }
    if (editingTodo) {
      setTodos(prev => prev.map(todo =>
        todo.id === editingTodo.id ? { ...todo, ...formData } : todo
      ));
      toast({ title: "Todo Updated", description: "Task updated." });
      setEditingTodo(null);
    } else {
      setTodos(prev => [...prev, {
        id: Date.now(),
        ...formData,
        completed: false,
        createdAt: new Date().toISOString().split('T')[0],
        year: selectedYear
      }]);
      toast({ title: "Task Added", description: "Task added for year " + selectedYear });
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
      year: selectedYear
    });
    setIsAddDialogOpen(false);
  };

  // Signature update
  const handleSignatureChange = (role: keyof YearSignature, field: keyof YearSignature['organizer'], value: string) => {
    setYearSignatures(prev => ({
      ...prev,
      [selectedYear]: {
        ...prev[selectedYear],
        [role]: { ...prev[selectedYear][role], [field]: value }
      }
    }));
  };

  // Filter todos for selected year
  const filteredTodos = todos
    .filter(todo => todo.year === selectedYear)
    .filter(todo => !isRemovedCategory(todo.detailedTask))
    .filter(todo => {
      const matchesSearch = todo.detailedTask.toLowerCase().includes(searchTerm.toLowerCase()) ||
        todo.workWith.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' ||
        (statusFilter === 'completed' && todo.completed) ||
        (statusFilter === 'pending' && !todo.completed);
      return matchesSearch && matchesStatus;
    });

  const getYearDisplayName = (yr: string) => {
    if (yr === 'all') return 'All Years';
    return yr;
  };

  const openEditDialog = (todo: Todo) => {
    setEditingTodo(todo);
    setFormData({ ...todo });
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
      year: selectedYear
    });
  };

  return (
    <div className="max-w-full mx-auto p-6 bg-white dark:bg-card min-h-screen overflow-x-auto">

      {/* Top bar for year selection and actions */}
      <div className="flex gap-4 mb-6">
        <Button onClick={() => setIsAddDialogOpen(true)} className="bg-blue-600 text-white">
          <Plus className="h-4 w-4 mr-2" /> Add New Task
        </Button>
        <Button onClick={handleSaveTasks} className="bg-green-600 text-white">
          <Save className="h-4 w-4 mr-2" /> Save Tasks
        </Button>
        <div className="flex-1"></div>
        <Button onClick={handleAddYear} className="bg-green-600 text-white">
          <Plus className="h-4 w-4 mr-2" /> Add Year
        </Button>
      </div>
      {/* Year Overview */}
      <div className="mb-4">
        <h2 className="text-lg font-bold">Year Overview</h2>
        <div className="flex gap-2 py-2">
          {years.map(yr => (
            <Button
              key={yr}
              variant={selectedYear === yr ? "default" : "outline"}
              onClick={() => setSelectedYear(yr)}
              className="rounded-lg min-w-[80px]"
            >
              {yr}
            </Button>
          ))}
        </div>
      </div>
      {/* Signature Section */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        {/* Organizer */}
        <div className="border rounded-lg p-4">
          <h3 className="font-bold text-lg mb-2">የዝግጅት ሰራተኛ፡-</h3>
          <Label>Name:</Label>
          <Input
            value={yearSignatures[selectedYear]?.organizer.name || ''}
            onChange={e => handleSignatureChange('organizer', 'name', e.target.value)}
            className="mb-3"
            placeholder="Enter name"
          />
          <Label>ሽም፡-</Label>
          <Input
            value={yearSignatures[selectedYear]?.organizer.signature || ''}
            onChange={e => handleSignatureChange('organizer', 'signature', e.target.value)}
            className="mb-3"
            placeholder="Signature line"
          />
          <Label>ቀን፡-</Label>
          <Input
            type="date"
            value={yearSignatures[selectedYear]?.organizer.date || ''}
            onChange={e => handleSignatureChange('organizer', 'date', e.target.value)}
            className="mb-3"
          />
        </div>
        {/* Approver */}
        <div className="border rounded-lg p-4">
          <h3 className="font-bold text-lg mb-2">የቅርብ ሰራተኛ፡-</h3>
          <Label>Name:</Label>
          <Input
            value={yearSignatures[selectedYear]?.approver.name || ''}
            onChange={e => handleSignatureChange('approver', 'name', e.target.value)}
            className="mb-3"
            placeholder="Enter name"
          />
          <Label>ሽም፡-</Label>
          <Input
            value={yearSignatures[selectedYear]?.approver.signature || ''}
            onChange={e => handleSignatureChange('approver', 'signature', e.target.value)}
            className="mb-3"
            placeholder="Signature line"
          />
          <Label>ቀን፡-</Label>
          <Input
            type="date"
            value={yearSignatures[selectedYear]?.approver.date || ''}
            onChange={e => handleSignatureChange('approver', 'date', e.target.value)}
            className="mb-3"
          />
        </div>
      </div>

      {/* Existing Document Header, Controls, Table */}
      <div className="border-2 border-black dark:border-gray-300 p-6 mb-6 bg-gray-50 dark:bg-card">
        <div className="text-center mb-4">
          <h1 className="text-xl font-bold mb-2">የባህርዳር ፈ/ገ/ቅ/ጊዮርጊስ ካ/ሰ/ት/ ቤት</h1>
          <h2 className="text-lg font-semibold">የዓመታዊ የማነ ጥበብ ዝግጅት ሰንጠረዥ</h2>
          <p className="text-sm mt-2">{getYearDisplayName(selectedYear)} - {new Date().getFullYear()}</p>
        </div>
        <div className="flex justify-between text-sm">
          <div>ዓመት: ____________</div>
          <div>ቀን: {new Date().toLocaleDateString()}</div>
          <div>ገጽ: 1 ከ 1</div>
        </div>
      </div>
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
      </div>

      {/* Official Form Table */}
      <div className="border-2 border-black dark:border-gray-300 overflow-x-auto">
        <table className="w-full border-collapse min-w-[1600px]">
          <thead>
            {/* ... (table head unchanged) ... */}
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
                        setTodos(prev => prev.map(t => t.id === todo.id ? { ...t, completed: !t.completed } : t));
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
                          setTodos(prev => prev.filter(t => t.id !== todo.id));
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
          </tbody>
        </table>
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

      {/* Add/Edit Task Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingTodo ? 'ዝግጅት አርም' : 'አዲስ ዝግጅት ጨምር'}
            </DialogTitle>
            <DialogDescription>
              የዓመታዊ የማነ ጥበብ ዝግጅት አዲስ እንቅስቃሴ ይፍጠሩ።
              <span className="block text-xs text-destructive mt-1">
                * Poetry, Tradition, Reading, Drama, and Folding related tasks are not allowed.
              </span>
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* ... (form fields as before, use selectedYear for year field) ... */}
            <div className="space-y-2">
              <Label htmlFor="year">Year</Label>
              <Select value={formData.year} onValueChange={(value) => setFormData(prev => ({ ...prev, year: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {years.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            {/* ... (rest of form) ... */}
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
  );
};

export default Todos;
