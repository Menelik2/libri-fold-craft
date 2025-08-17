import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { FileText, Plus, Edit, Trash2, Save } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Todo {
  id: number;
  detailedTask: string;
  measure: string;
  quantity: string;
  workWith: string;
  firstQuarter: { july: boolean; august: boolean; september: boolean; };
  secondQuarter: { october: boolean; november: boolean; december: boolean; };
  thirdQuarter: { january: boolean; february: boolean; march: boolean; };
  fourthQuarter: { april: boolean; may: boolean; june: boolean; };
  budgetRequested: string;
  approvedBudget: string;
  cost: string;
  income: string;
  year: string;
  completed: boolean;
  createdAt: string;
}

const removedCategories = [
  'Poetry', 'Tradition', 'Reading', 'Drama', 'Folding'
];
function isRemovedCategory(task: string): boolean {
  return removedCategories.some(cat => task.toLowerCase().includes(cat.toLowerCase()));
}

// Signature info per year
interface YearSignature {
  organizer: { name: string; date: string; signature: string };
  approver: { name: string; date: string; signature: string };
}

const getDefaultSignature = () => ({
  organizer: { name: '', date: '', signature: '' },
  approver: { name: '', date: '', signature: '' },
});

const defaultYears = ["2024", "2025", "2026"];
const Todos = () => {
  // Years state
  const [years, setYears] = useState<string[]>(defaultYears);
  const [selectedYear, setSelectedYear] = useState<string>("2025");

  // Signature info state
  const [yearSignatures, setYearSignatures] = useState<Record<string, YearSignature>>(
    defaultYears.reduce((acc, yr) => ({ ...acc, [yr]: getDefaultSignature() }), {})
  );

  // Todos state
  const [todos, setTodos] = useState<Todo[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  // Task form
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

  // Filtered todos for selected year
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

  return (
    <div className="max-w-full mx-auto p-6 bg-white dark:bg-card min-h-screen overflow-x-auto">
      {/* Top bar */}
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

      {/* Signature section */}
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

      {/* Task Table */}
      <div className="border-2 border-black dark:border-gray-300 overflow-x-auto mb-8">
        <table className="w-full border-collapse min-w-[1600px]">
          <thead>
            <tr className="bg-white dark:bg-card">
              <th className="border border-black dark:border-gray-300 p-2 text-sm font-medium w-12">No</th>
              <th className="border border-black dark:border-gray-300 p-2 text-sm font-medium min-w-[200px]">Detailed Task</th>
              <th className="border border-black dark:border-gray-300 p-2 text-sm font-medium w-20">Measure</th>
              <th className="border border-black dark:border-gray-300 p-2 text-sm font-medium w-20">Quantity</th>
              <th className="border border-black dark:border-gray-300 p-2 text-sm font-medium w-32">Who will we work with?</th>
              {/* Add other columns as needed */}
              <th className="border border-black dark:border-gray-300 p-2 text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTodos.map((todo, idx) => (
              <tr key={todo.id} className="bg-white hover:bg-gray-50 cursor-pointer">
                <td className="border border-black dark:border-gray-300 p-2 text-center">{idx + 1}</td>
                <td className="border border-black dark:border-gray-300 p-2">{todo.detailedTask}</td>
                <td className="border border-black dark:border-gray-300 p-2">{todo.measure}</td>
                <td className="border border-black dark:border-gray-300 p-2">{todo.quantity}</td>
                <td className="border border-black dark:border-gray-300 p-2">{todo.workWith}</td>
                <td className="border border-black dark:border-gray-300 p-2">
                  <Button size="sm" variant="outline" onClick={() => {
                    setEditingTodo(todo);
                    setFormData({ ...todo });
                    setIsAddDialogOpen(true);
                  }}>
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => {
                    setTodos(prev => prev.filter(t => t.id !== todo.id));
                  }}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredTodos.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No arts plan items found for {selectedYear}</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || statusFilter !== 'all'
                ? 'Try adjusting your search criteria or filters.'
                : 'Get started by adding your first Annual Arts Plan item.'}
            </p>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Item
            </Button>
          </div>
        )}
      </div>

      {/* Add/Edit task dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingTodo ? "Edit Task" : "Add New Task"}</DialogTitle>
            <DialogDescription>
              Task for year {selectedYear}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Label>Detailed Task</Label>
            <Input
              value={formData.detailedTask}
              onChange={e => setFormData(prev => ({ ...prev, detailedTask: e.target.value }))}
              required
            />
            <Label>Measure</Label>
            <Input
              value={formData.measure}
              onChange={e => setFormData(prev => ({ ...prev, measure: e.target.value }))}
              required
            />
            <Label>Quantity</Label>
            <Input
              value={formData.quantity}
              onChange={e => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
              required
            />
            <Label>Who will we work with?</Label>
            <Input
              value={formData.workWith}
              onChange={e => setFormData(prev => ({ ...prev, workWith: e.target.value }))}
              required
            />
            <div className="flex gap-2 pt-4">
              <Button type="submit" className="flex-1">
                {editingTodo ? 'Update' : 'Add'}
              </Button>
              <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
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
