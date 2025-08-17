// ... keep your existing imports and code above ...

// Add these near the top of your file, after imports:
interface YearSignature {
  organizer: { name: string; date: string; signature: string };
  approver: { name: string; date: string; signature: string };
}
const getDefaultSignature = () => ({
  organizer: { name: '', date: '', signature: '' },
  approver: { name: '', date: '', signature: '' },
});

// Add these new states inside your Todos component, after your existing useStates:
const initialYears = ["2024", "2025", "2026"];
const [years, setYears] = useState<string[]>(initialYears);
const [selectedYear, setSelectedYear] = useState<string>(years[0]);
const [yearSignatures, setYearSignatures] = useState<Record<string, YearSignature>>(
  initialYears.reduce((acc, yr) => ({ ...acc, [yr]: getDefaultSignature() }), {})
);

// Update your formData state to use selectedYear as its year:
useEffect(() => {
  setFormData(prev => ({ ...prev, year: selectedYear }));
}, [selectedYear]);

// Handler to add a new year
const handleAddYear = () => {
  const nextYear = (parseInt(years[years.length - 1]) + 1).toString();
  setYears(prev => [...prev, nextYear]);
  setYearSignatures(prev => ({ ...prev, [nextYear]: getDefaultSignature() }));
  setSelectedYear(nextYear);
};

// Save handler (simulate API call)
const handleSaveTasks = () => {
  toast({
    title: "Tasks Saved",
    description: `Tasks for year ${selectedYear} saved.`,
    variant: "success"
  });
};

// Signature update handler
const handleSignatureChange = (role: keyof YearSignature, field: keyof YearSignature['organizer'], value: string) => {
  setYearSignatures(prev => ({
    ...prev,
    [selectedYear]: {
      ...prev[selectedYear],
      [role]: { ...prev[selectedYear][role], [field]: value }
    }
  }));
};

// In your render/return block, insert this above your table (after headers/controls):

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

{/* Your existing table code, but filter by selectedYear */}
<tbody>
  {todos
    .filter(todo => todo.year === selectedYear)
    .filter(todo => !isRemovedCategory(todo.detailedTask))
    .filter(todo => {
      const matchesSearch = todo.detailedTask.toLowerCase().includes(searchTerm.toLowerCase()) ||
        todo.workWith.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' ||
        (statusFilter === 'completed' && todo.completed) ||
        (statusFilter === 'pending' && !todo.completed);
      return matchesSearch && matchesStatus;
    })
    .map((todo, index) => (
      // ... your existing row rendering code ...
    ))
  }
</tbody>

// ... keep your existing Add/Edit dialog and other logic ...

