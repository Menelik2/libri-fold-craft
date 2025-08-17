import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { CheckCircle2, Circle, FileText, Plus, Edit, Trash2, Search } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { Checkbox } from '@/components/ui/checkbox';

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

// Categories to remove (case-insensitive, substring match)
const removedCategories = ['Poetry', 'Tradition', 'Reading', 'Drama', 'Folding'];

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

function isRemovedCategory(task: string): boolean {
  return removedCategories.some(cat => task.toLowerCase().includes(cat.toLowerCase()));
}

const Todos: React.FC = () => {
  const navigate = useNavigate();
  const { year } = useParams();

  const initialSelectedYear = year || new Date().getFullYear().toString();

  const [todos, setTodos] = useState<Todo[]>(mockTodos);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  // typed year filter (user types year or "all")
  const [selectedYear, setSelectedYear] = useState<string>(initialSelectedYear);

  // signature names editable
  const [signerName, setSignerName] = useState<string>('');
  const [inspectorName, setInspectorName] = useState<string>('');

  const [formData, setFormData] = useState<any>({
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
    year: initialSelectedYear
  });

  useEffect(() => {
    if (year && year !== selectedYear) {
      setSelectedYear(year);
      setFormData(prev => ({ ...prev, year }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year]);

  const filteredTodos = todos
    .filter(todo => !isRemovedCategory(todo.detailedTask))
    .filter(todo => {
      const matchesYear = selectedYear === 'all' || todo.year === selectedYear;
      const matchesSearch = todo.detailedTask.toLowerCase().includes(searchTerm.toLowerCase()) ||
        todo.workWith.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' ||
        (statusFilter === 'completed' && todo.completed) ||
        (statusFilter === 'pending' && !todo.completed);
      return matchesYear && matchesSearch && matchesStatus;
    });

  const getYearDisplayName = (yr: string) => (yr === 'all' ? 'All Years' : yr);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isRemovedCategory(formData.detailedTask)) {
      toast({
        title: "Invalid Category",
        description: "You cannot add a task with Poetry, Tradition, Reading, Drama, or Folding in the name.",
        variant: "destructive"
      });
      return;
    }

    if (editingTodo) {
      setTodos(prev => prev.map(t => (t.id === editingTodo.id ? { ...t, ...formData } : t)));
      toast({ title: "Todo Updated", description: "Your Annual Arts Plan item has been updated successfully." });
      setEditingTodo(null);
    } else {
      const targetYear = !formData.year || formData.year === 'all' ? new Date().getFullYear().toString() : formData.year;
      const newTodo: Todo = {
        id: Date.now(),
        ...formData,
        year: targetYear,
        completed: false,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setTodos(prev => [...prev, newTodo]);
      toast({ title: "Todo Added", description: "New Annual Arts Plan item has been added successfully." });
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
      year: selectedYear === 'all' ? new Date().getFullYear().toString() : selectedYear
    });
    setIsAddDialogOpen(false);
  };

  const toggleComplete = (id: number) => {
    setTodos(prev => prev.map(todo => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)));
  };

  const deleteTodo = (id: number) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
    toast({ title: "Todo Deleted", description: "Annual Arts Plan item has been removed." });
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
      year: selectedYear === 'all' ? new Date().getFullYear().toString() : selectedYear
    });
  };

  // Year input handlers
  const handleYearInputChange = (value: string) => {
    setSelectedYear(value);
    setFormData(prev => ({ ...prev, year: value }));
  };
  const applyYearToUrl = () => {
    try {
      const safe = selectedYear && selectedYear.trim() !== '' ? selectedYear.trim() : 'all';
      navigate(`/admin/todos/${safe}`);
    } catch (e) { /* ignore */ }
  };

  // Generate printable HTML for selected todos (used for printing / saving as PDF)
  const generatePrintableHtml = (todosToPrint: Todo[]) => {
    const title = `የዓመታዊ ዝግጅት ሰንጠረዥ — ${getYearDisplayName(selectedYear || 'all')}`;
    const styles = `
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial; color: #111; padding: 20px; }
        .header { text-align: center; margin-bottom: 20px; }
        h1 { margin: 0; font-size: 20px; }
        h2 { margin: 4px 0 12px; font-size: 16px; }
        table { width: 100%; border-collapse: collapse; font-size: 12px; }
        th, td { border: 1px solid #000; padding: 6px 8px; text-align: center; vertical-align: middle; }
        th { background: #f5f5f5; font-weight: 600; }
        .left { text-align: left; }
        .signature-row { margin-top: 28px; display:flex; justify-content:space-between; }
        .signature { width:45%; }
        .signature .line { border-bottom: 1px solid #000; height: 30px; margin-bottom: 6px; }
        .small { font-size: 11px; color: #444; }
        @media print {
          body { padding: 0.5cm; }
          .no-print { display: none; }
        }
      </style>
    `;

    // Build rows
    const rows = todosToPrint.map((t, i) => `
      <tr>
        <td>${i + 1}</td>
        <td class="left">${escapeHtml(t.detailedTask)}</td>
        <td>${escapeHtml(t.measure)}</td>
        <td>${escapeHtml(t.quantity)}</td>
        <td class="left">${escapeHtml(t.workWith)}</td>

        <td>${t.firstQuarter.july ? '✓' : ''}</td>
        <td>${t.firstQuarter.august ? '✓' : ''}</td>
        <td>${t.firstQuarter.september ? '✓' : ''}</td>

        <td>${t.secondQuarter.october ? '✓' : ''}</td>
        <td>${t.secondQuarter.november ? '✓' : ''}</td>
        <td>${t.secondQuarter.december ? '✓' : ''}</td>

        <td>${t.thirdQuarter.january ? '✓' : ''}</td>
        <td>${t.thirdQuarter.february ? '✓' : ''}</td>
        <td>${t.thirdQuarter.march ? '✓' : ''}</td>

        <td>${t.fourthQuarter.april ? '✓' : ''}</td>
        <td>${t.fourthQuarter.may ? '✓' : ''}</td>
        <td>${t.fourthQuarter.june ? '✓' : ''}</td>

        <td>${escapeHtml(t.budgetRequested)}</td>
        <td>${escapeHtml(t.cost)}</td>
        <td>${escapeHtml(t.income)}</td>
      </tr>
    `).join('');

    const table = `
      <table>
        <thead>
          <tr>
            <th rowspan="2">No</th>
            <th rowspan="2">Detailed Task</th>
            <th rowspan="2">Measure</th>
            <th rowspan="2">Quantity</th>
            <th rowspan="2">Who will we work with?</th>
            <th colspan="3">1st quarter</th>
            <th colspan="3">2nd quarter</th>
            <th colspan="3">3rd quarter</th>
            <th colspan="3">4th quarter</th>
            <th rowspan="2">Budget Requested</th>
            <th rowspan="2">Cost</th>
            <th rowspan="2">Income</th>
          </tr>
          <tr>
            <th>July</th><th>August</th><th>September</th>
            <th>October</th><th>November</th><th>December</th>
            <th>January</th><th>February</th><th>March</th>
            <th>April</th><th>May</th><th>June</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
    `;

    const signatures = `
      <div class="signature-row">
        <div class="signature">
          <div class="line"></div>
          <div class="small">የዝግጅት ኃላፊ ፊርማ፡-</div>
          <div class="small">ስም: ${escapeHtml(signerName || '__________________')}</div>
        </div>
        <div class="signature">
          <div class="line"></div>
          <div class="small">የእይታ ኃላፊ ፊርማ፡-</div>
          <div class="small">ስም: ${escapeHtml(inspectorName || '__________________')}</div>
        </div>
      </div>
    `;

    return `<!doctype html><html><head><meta charset="utf-8"><title>${escapeHtml(title)}</title>${styles}</head><body>
      <div class="header">
        <h1>የባህርዳር ፈ/ገ/ቅ/ጊዮርጊስ ካ/ሰ/ት/ ቤት</h1>
        <h2>${escapeHtml(title)}</h2>
        <div class="small">Printed: ${new Date().toLocaleString()}</div>
      </div>
      ${table}
      ${signatures}
      <div style="margin-top:12px;" class="small">Generated by Libri-fold-craft</div>
    </body></html>`;
  };

  // helper to escape HTML
  const escapeHtml = (str: any) => {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  // open printable window and call print — users can save to PDF from the browser print dialog
  const printTodos = (todosToPrint: Todo[]) => {
    const html = generatePrintableHtml(todosToPrint);
    const w = window.open('', '_blank', 'noopener,noreferrer');
    if (!w) {
      toast({ title: 'Pop-up blocked', description: 'Please allow pop-ups to print the PDF.' });
      return;
    }
    w.document.open();
    w.document.write(html);
    w.document.close();
    // allow the new window to render before calling print
    setTimeout(() => {
      try {
        w.focus();
        w.print();
      } catch (err) {
        // ignore
      }
    }, 300);
  };

  return (
    <div className="max-w-full mx-auto p-6 bg-white dark:bg-card min-h-screen overflow-x-auto">
      {/* Header */}
      <div className="border-2 border-black dark:border-gray-300 p-6 mb-6 bg-gray-50 dark:bg-card">
        <div className="text-center mb-4">
          <h1 className="text-xl font-bold mb-2">የባህርዳር ፈ/ገ/ቅ/ጊዮርጊስ ካ/ሰ/ት/ ቤት</h1>
          <h2 className="text-lg font-semibold">የዓመታዊ የማነ ጥበብ ዝግጅት ሰንጠረዥ</h2>
          <p className="text-sm mt-2">{getYearDisplayName(selectedYear || 'all')} - {new Date().getFullYear()}</p>
        </div>

        <div className="flex justify-between text-sm">
          <div>ዓመት: {selectedYear === 'all' ? 'Multiple / All' : selectedYear}</div>
          <div>ቀን: {new Date().toLocaleDateString()}</div>
          <div>ገጽ: 1 ከ 1</div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="ፈልግ..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9 w-64" />
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

          <div className="w-40">
            <Input
              placeholder='Type year (e.g. 2025) or "all"'
              value={selectedYear}
              onChange={(e) => handleYearInputChange(e.target.value)}
              onBlur={applyYearToUrl}
              onKeyDown={(e) => { if (e.key === 'Enter') applyYearToUrl(); }}
            />
            <p className="text-xs text-muted-foreground mt-1">Type a year and press Enter or click away to apply.</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={() => {
            setFormData(prev => ({ ...prev, year: selectedYear === 'all' ? new Date().getFullYear().toString() : selectedYear }));
            setIsAddDialogOpen(true);
          }} className="gap-2">
            <Plus className="h-4 w-4" /> አዲስ ዝግጅት ጨምር
          </Button>

          <Button onClick={() => printTodos(filteredTodos)} className="gap-2">
            📄 Print / Save PDF
          </Button>
        </div>
      </div>

      {/* Table (scrollable on screen) */}
      <div className="border-2 border-black dark:border-gray-300 overflow-x-auto">
        <table className="w-full border-collapse min-w-[1600px]">
          <thead>
            <tr className="bg-white dark:bg-card">
              <th rowSpan={2} className="border p-2 w-12">No</th>
              <th rowSpan={2} className="border p-2 min-w-[200px]">detailed task</th>
              <th rowSpan={2} className="border p-2 w-20">Measure</th>
              <th rowSpan={2} className="border p-2 w-20">Quantity</th>
              <th rowSpan={2} className="border p-2 w-32">Who will we work with?</th>
              <th colSpan={3} className="border p-2">1st quarter</th>
              <th colSpan={3} className="border p-2">2nd quarter</th>
              <th colSpan={3} className="border p-2">3rd quarter</th>
              <th colSpan={3} className="border p-2">4th quarter</th>
              <th rowSpan={2} className="border p-2 w-24">The budget requested by the department</th>
              <th colSpan={2} className="border p-2">Approved budget</th>
              <th rowSpan={2} className="border p-2 w-32">Actions</th>
            </tr>
            <tr className="bg-yellow-200 dark:bg-yellow-800">
              <th className="border p-1">July</th><th className="border p-1">August</th><th className="border p-1">September</th>
              <th className="border p-1">October</th><th className="border p-1">November</th><th className="border p-1">December</th>
              <th className="border p-1">January</th><th className="border p-1">February</th><th className="border p-1">March</th>
              <th className="border p-1">April</th><th className="border p-1">May</th><th className="border p-1">June</th>
              <th className="border p-1 w-20">Cost</th><th className="border p-1 w-20">Income</th>
            </tr>
          </thead>
          <tbody>
            {filteredTodos.map((todo, index) => (
              <tr key={todo.id} className={`${todo.completed ? 'bg-green-50' : 'bg-white'} hover:bg-gray-50 cursor-pointer`} onDoubleClick={() => openEditDialog(todo)}>
                <td className="border p-2 text-center">{index + 1}</td>
                <td className="border p-2">{todo.detailedTask}</td>
                <td className="border p-2 text-center">{todo.measure}</td>
                <td className="border p-2 text-center">{todo.quantity}</td>
                <td className="border p-2">{todo.workWith}</td>

                <td className="border p-2 text-center">{todo.firstQuarter.july ? '✓' : ''}</td>
                <td className="border p-2 text-center">{todo.firstQuarter.august ? '✓' : ''}</td>
                <td className="border p-2 text-center">{todo.firstQuarter.september ? '✓' : ''}</td>

                <td className="border p-2 text-center">{todo.secondQuarter.october ? '✓' : ''}</td>
                <td className="border p-2 text-center">{todo.secondQuarter.november ? '✓' : ''}</td>
                <td className="border p-2 text-center">{todo.secondQuarter.december ? '✓' : ''}</td>

                <td className="border p-2 text-center">{todo.thirdQuarter.january ? '✓' : ''}</td>
                <td className="border p-2 text-center">{todo.thirdQuarter.february ? '✓' : ''}</td>
                <td className="border p-2 text-center">{todo.thirdQuarter.march ? '✓' : ''}</td>

                <td className="border p-2 text-center">{todo.fourthQuarter.april ? '✓' : ''}</td>
                <td className="border p-2 text-center">{todo.fourthQuarter.may ? '✓' : ''}</td>
                <td className="border p-2 text-center">{todo.fourthQuarter.june ? '✓' : ''}</td>

                <td className="border p-2 text-center">{todo.budgetRequested}</td>
                <td className="border p-2 text-center">{todo.cost}</td>
                <td className="border p-2 text-center">{todo.income}</td>

                <td className="border p-2">
                  <div className="flex gap-1 justify-center">
                    <Button size="sm" variant={todo.completed ? "default" : "outline"} onClick={(e) => { e.stopPropagation(); toggleComplete(todo.id); }} className="h-7 w-7 p-0" title={todo.completed ? "Mark as incomplete" : "Mark as complete"}>
                      {todo.completed ? <CheckCircle2 className="h-3 w-3" /> : <Circle className="h-3 w-3" />}
                    </Button>
                    <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); openEditDialog(todo); }} className="h-7 w-7 p-0" title="Edit task">
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="destructive" onClick={(e) => { e.stopPropagation(); if (confirm("Are you sure you want to delete this task?")) deleteTodo(todo.id); }} className="h-7 w-7 p-0" title="Delete task">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Signature Section (editable for print) */}
      <div className="mt-8 grid grid-cols-2 gap-8">
        <div>
          <p className="font-medium">የዝግጅት ኃላፊ ፊርማ፡-</p>
          <div className="border-b border-black h-12"></div>
          <div className="mt-2">
            <Label htmlFor="signerName">ስም</Label>
            <Input id="signerName" placeholder="Type name here" value={signerName} onChange={(e) => setSignerName(e.target.value)} className="mt-1" />
            <p className="text-sm mt-1">Entered: {signerName || '—'}</p>
          </div>
        </div>
        <div>
          <p className="font-medium">የእይታ ኃላፊ ፊርማ፡-</p>
          <div className="border-b border-black h-12"></div>
          <div className="mt-2">
            <Label htmlFor="inspectorName">ስም</Label>
            <Input id="inspectorName" placeholder="Type name here" value={inspectorName} onChange={(e) => setInspectorName(e.target.value)} className="mt-1" />
            <p className="text-sm mt-1">Entered: {inspectorName || '—'}</p>
          </div>
        </div>
      </div>

      {/* Empty state */}
      {filteredTodos.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No arts plan items found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || statusFilter !== 'all' ? 'Try adjusting your search criteria or filters.' : `No items for ${getYearDisplayName(selectedYear || 'all')}. Add items for this year.`}
          </p>
          <Button onClick={() => { setFormData(prev => ({ ...prev, year: selectedYear === 'all' ? new Date().getFullYear().toString() : selectedYear })); setIsAddDialogOpen(true); }}>
            <Plus className="h-4 w-4 mr-2" /> Add Your First Item
          </Button>
        </div>
      )}

      {/* Add/Edit dialog (kept minimal here, unchanged from previous implementation) */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogTrigger asChild>
          <div style={{ display: 'none' }} />
        </DialogTrigger>
        <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingTodo ? 'ዝግጅት አርም' : 'አዲስ ዝግጅት ጨምር'}</DialogTitle>
            <DialogDescription>
              የዓመታዊ የማነ ጥበብ ዝግጅት አዲስ እንቅስቃሴ ይፍጠሩ።
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* form fields (kept simple for this snippet) */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Detailed Task</Label>
                <Input value={formData.detailedTask} onChange={(e) => setFormData(prev => ({ ...prev, detailedTask: e.target.value }))} required />
              </div>
              <div>
                <Label>Measure</Label>
                <Input value={formData.measure} onChange={(e) => setFormData(prev => ({ ...prev, measure: e.target.value }))} required />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Quantity</Label>
                <Input value={formData.quantity} onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))} required />
              </div>
              <div>
                <Label>Who will we work with?</Label>
                <Input value={formData.workWith} onChange={(e) => setFormData(prev => ({ ...prev, workWith: e.target.value }))} required />
              </div>
            </div>

            {/* year input */}
            <div>
              <Label>Year</Label>
              <Input value={formData.year} onChange={(e) => setFormData(prev => ({ ...prev, year: e.target.value }))} placeholder="Type a year (e.g. 2026)" />
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit" className="flex-1">{editingTodo ? 'Update' : 'Add'}</Button>
              <Button type="button" variant="outline" onClick={closeDialog}>Cancel</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Todos;
