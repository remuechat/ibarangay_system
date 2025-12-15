'use client';

import { useState, useMemo, useEffect } from "react";

// SHADCN UI components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";

// Lucide icons
import { LayoutDashboard, Table as TableIcon, ListChecks, KanbanSquare, Search, Loader2 } from "lucide-react";

// Dynamic views
import DynamicTable from "@/components/dynamicViewers/dynamic-table";
import DynamicQueue from "@/components/dynamicViewers/dynamic-queue";
import DynamicKanban from "@/components/dynamicViewers/dynamic-kanban";
import { format } from "date-fns";

// Hook
import { useMaintenance } from "@/hooks/use-maintenance";

const columnHeaders: Record<string, string> = {
  id: "ID",
  type: "Type",
  status: "Status",
  priority: "Priority",
  assignedTo: "Assigned To",
  lastServiced: "Last Serviced",
  nextServiceDue: "Next Service Due",
  scheduledDate: "Scheduled Date",
  issue: "Issue",
};

// Define proper type for the entry
interface MaintenanceEntry {
  id?: string;
  type: string;
  status: "pending" | "processing" | "resolved";
  priority: 1 | 2 | 3 | 4 | 5;
  assignedTo: string;
  issue?: string;
  lastServiced?: string;
  nextServiceDue?: string;
  scheduledDate?: string;
}

// Priority descriptions (for UI only)
const PRIORITY_OPTIONS = [
  { value: 5, label: "5 - Critical", description: "Urgent attention required" },
  { value: 4, label: "4 - High", description: "Important, address soon" },
  { value: 3, label: "3 - Medium", description: "Standard priority" },
  { value: 2, label: "2 - Low", description: "Address when possible" },
  { value: 1, label: "1 - Very Low", description: "Minimal impact" },
];

// Entry Drawer - FIXED
function EntryDrawer({ 
  open, 
  onOpenChange, 
  entry, 
  onSave, 
  onDelete 
}: { 
  open: boolean; 
  onOpenChange: (val: boolean) => void; 
  entry: MaintenanceEntry | null; 
  onSave: (data: MaintenanceEntry) => void; 
  onDelete?: (id: string) => void 
}) {
  const [form, setForm] = useState<MaintenanceEntry>({
    type: "",
    status: "pending",
    priority: 3,
    assignedTo: "",
    issue: "",
    lastServiced: "",
    nextServiceDue: "",
    scheduledDate: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Update form when entry changes
  useEffect(() => {
    if (entry) {
      setForm(entry);
    } else {
      // Reset form for new entry
      setForm({
        type: "",
        status: "pending",
        priority: 3,
        assignedTo: "",
        issue: "",
        lastServiced: "",
        nextServiceDue: "",
        scheduledDate: "",
      });
    }
    setErrors({}); // Clear errors when opening/closing
  }, [entry, open]);

  const handleChange = (key: keyof MaintenanceEntry, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    // Clear error when user starts typing
    if (errors[key]) {
      setErrors(prev => ({ ...prev, [key]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Required field validations
    if (!form.type?.trim()) {
      newErrors.type = "Type is required";
    } else if (form.type.trim().length < 2) {
      newErrors.type = "Type must be at least 2 characters";
    }

    if (!form.assignedTo?.trim()) {
      newErrors.assignedTo = "Assigned To is required";
    }

    // Priority validation
    if (form.priority < 1 || form.priority > 5) {
      newErrors.priority = "Priority must be between 1 and 5";
    }

    // Date validations
    if (form.lastServiced) {
      const lastServicedDate = new Date(form.lastServiced);
      if (isNaN(lastServicedDate.getTime())) {
        newErrors.lastServiced = "Invalid date format";
      }
    }

    if (form.nextServiceDue) {
      const nextServiceDueDate = new Date(form.nextServiceDue);
      if (isNaN(nextServiceDueDate.getTime())) {
        newErrors.nextServiceDue = "Invalid date format";
      }
    }

    if (form.scheduledDate) {
      const scheduledDate = new Date(form.scheduledDate);
      if (isNaN(scheduledDate.getTime())) {
        newErrors.scheduledDate = "Invalid date format";
      }
    }

    // Validate that next service due is after last serviced if both are provided
    if (form.lastServiced && form.nextServiceDue) {
      const lastServiced = new Date(form.lastServiced);
      const nextServiceDue = new Date(form.nextServiceDue);
      if (nextServiceDue <= lastServiced) {
        newErrors.nextServiceDue = "Next service due must be after last service date";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      // Clean the data before saving
      const dataToSave: MaintenanceEntry = {
        ...form,
        type: form.type.trim(),
        assignedTo: form.assignedTo.trim(),
        issue: form.issue?.trim() || "",
        // Only store priority value (1-5), not the description
        priority: form.priority,
      };

      // Remove id if creating new entry (backend generates it)
      if (!entry?.id) {
        delete dataToSave.id;
      }

      onSave(dataToSave);
      onOpenChange(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="p-6 max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{entry?.id ? "Edit Entry" : "New Entry"}</SheetTitle>
          <SheetDescription>
            Fill in the details below. {entry?.id ? "You can update or delete the entry." : ""}
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-4 mt-4">
          {/* Type Field */}
          <div>
            <Label htmlFor="type" className="text-sm font-medium">
              Type *
            </Label>
            <Input 
              id="type"
              placeholder="Maintenance Type" 
              value={form.type} 
              onChange={(e) => handleChange("type", e.target.value)}
              className={errors.type ? "border-red-500" : ""}
            />
            {errors.type && <p className="text-xs text-red-500 mt-1">{errors.type}</p>}
          </div>
          
          {/* Status Field - Dropdown */}
          <div>
            <Label htmlFor="status" className="text-sm font-medium">
              Status *
            </Label>
            <Select 
              value={form.status} 
              onValueChange={(value: "pending" | "processing" | "resolved") => handleChange("status", value)}
            >
              <SelectTrigger id="status" className={errors.status ? "border-red-500" : ""}>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Assigned To Field */}
          <div>
            <Label htmlFor="assignedTo" className="text-sm font-medium">
              Assigned To *
            </Label>
            <Input 
              id="assignedTo"
              placeholder="Person or team responsible" 
              value={form.assignedTo} 
              onChange={(e) => handleChange("assignedTo", e.target.value)}
              className={errors.assignedTo ? "border-red-500" : ""}
            />
            {errors.assignedTo && <p className="text-xs text-red-500 mt-1">{errors.assignedTo}</p>}
          </div>
          
          {/* Issue Field */}
          <div>
            <Label htmlFor="issue" className="text-sm font-medium">
              Issue
            </Label>
            <Input 
              id="issue"
              placeholder="Description of the issue" 
              value={form.issue || ""} 
              onChange={(e) => handleChange("issue", e.target.value)}
            />
          </div>
          
          {/* Priority Field - Enhanced Dropdown */}
          <div>
            <Label htmlFor="priority" className="text-sm font-medium">
              Priority *
            </Label>
            <Select 
              value={form.priority.toString()} 
              onValueChange={(value) => handleChange("priority", parseInt(value))}
            >
              <SelectTrigger id="priority" className={errors.priority ? "border-red-500" : ""}>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                {PRIORITY_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value.toString()}>
                    <div className="flex flex-col">
                      <span>{option.label}</span>
                      <span className="text-xs text-gray-500">{option.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.priority && <p className="text-xs text-red-500 mt-1">{errors.priority}</p>}
          </div>
          
          {/* Date Fields */}
          <div>
            <Label htmlFor="lastServiced" className="text-sm font-medium">
              Last Serviced
            </Label>
            <Input 
              id="lastServiced"
              type="date" 
              value={form.lastServiced ? format(new Date(form.lastServiced), "yyyy-MM-dd") : ""} 
              onChange={(e) => handleChange("lastServiced", e.target.value)}
              className={errors.lastServiced ? "border-red-500" : ""}
            />
            {errors.lastServiced && <p className="text-xs text-red-500 mt-1">{errors.lastServiced}</p>}
          </div>
          
          <div>
            <Label htmlFor="nextServiceDue" className="text-sm font-medium">
              Next Service Due
            </Label>
            <Input 
              id="nextServiceDue"
              type="date" 
              value={form.nextServiceDue ? format(new Date(form.nextServiceDue), "yyyy-MM-dd") : ""} 
              onChange={(e) => handleChange("nextServiceDue", e.target.value)}
              className={errors.nextServiceDue ? "border-red-500" : ""}
            />
            {errors.nextServiceDue && <p className="text-xs text-red-500 mt-1">{errors.nextServiceDue}</p>}
          </div>
          
          <div>
            <Label htmlFor="scheduledDate" className="text-sm font-medium">
              Scheduled Date
            </Label>
            <Input 
              id="scheduledDate"
              type="date" 
              value={form.scheduledDate ? format(new Date(form.scheduledDate), "yyyy-MM-dd") : ""} 
              onChange={(e) => handleChange("scheduledDate", e.target.value)}
              className={errors.scheduledDate ? "border-red-500" : ""}
            />
            {errors.scheduledDate && <p className="text-xs text-red-500 mt-1">{errors.scheduledDate}</p>}
          </div>

          <div className="flex gap-2 mt-4 justify-end">
            {entry?.id && onDelete && (
              <Button 
                variant="destructive" 
                onClick={() => { 
                  if (confirm("Are you sure you want to delete this entry?")) {
                    onDelete(entry.id as any); 
                    onOpenChange(false); 
                  }
                }}
              >
                Delete
              </Button>
            )}
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button variant="default" onClick={handleSave}>Save</Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// Search Popover
function SearchPopover({ 
  data, 
  onSearch, 
  columnHeaders 
}: { 
  data: any[]; 
  onSearch: (filtered: any[]) => void; 
  columnHeaders: Record<string, string> 
}) {
  const [query, setQuery] = useState("");
  const [filterBy, setFilterBy] = useState("all");
  const [dateFilterType, setDateFilterType] = useState("none");
  const [dateValue, setDateValue] = useState<Date | undefined>();

  const runSearch = () => {
    const terms = query.split(" ").map(t => t.toLowerCase()).filter(Boolean);

    const filtered = data.filter(row => {
      const textMatch = terms.every(term => 
        Object.keys(row).some(k => String(row[k]).toLowerCase().includes(term))
      );

      let dateMatch = true;
      if (dateFilterType !== "none" && dateValue) {
        const rowDates = Object.keys(row)
          .filter(k => row[k] && !isNaN(Date.parse(row[k])))
          .map(k => new Date(row[k]));
        const target = new Date(dateValue);
        if (dateFilterType === "before") dateMatch = rowDates.some(d => d < target);
        if (dateFilterType === "after") dateMatch = rowDates.some(d => d > target);
        if (dateFilterType === "on") dateMatch = rowDates.some(d => d.toDateString() === target.toDateString());
      }

      const columnMatch = filterBy === "all" ? true : String(row[filterBy]).toLowerCase().includes(query.toLowerCase());

      return textMatch && dateMatch && columnMatch;
    });

    onSearch(filtered);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <Search className="w-4 h-4 mr-2" />
          Search
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-96 p-4 space-y-4">
        <h3 className="font-semibold text-lg">Advanced Search</h3>
        <Input placeholder="Search keywords…" value={query} onChange={(e) => setQuery(e.target.value)} />
        <Select value={filterBy} onValueChange={setFilterBy}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by column" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Columns</SelectItem>
            {data.length > 0 && Object.keys(data[0]).map(col => (
              <SelectItem key={col} value={col}>{columnHeaders[col] || col.replace(/([A-Z])/g, " $1")}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={dateFilterType} onValueChange={setDateFilterType}>
          <SelectTrigger>
            <SelectValue placeholder="Date Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No Date Filter</SelectItem>
            <SelectItem value="before">Before</SelectItem>
            <SelectItem value="after">After</SelectItem>
            <SelectItem value="on">On</SelectItem>
          </SelectContent>
        </Select>

        {dateFilterType !== "none" && (
          <Calendar mode="single" selected={dateValue} onSelect={setDateValue} className="rounded-md border" />
        )}

        <Button className="w-full" onClick={runSearch}>Apply Search</Button>
      </PopoverContent>
    </Popover>
  );
}

// Main Maintenance Page - FIXED
export default function MaintenancePage() {
  const [view, setView] = useState<"dashboard" | "table" | "queue">("dashboard");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<any | null>(null);

  // Use hook for backend CRUD
  const { entries, loading, error, refresh, add, update, remove } = useMaintenance();

  const [filteredData, setFilteredData] = useState<any[]>([]);

  // Sync filteredData whenever backend data changes
  useEffect(() => {
    setFilteredData(entries);
  }, [entries]);

  const handleSave = async (entry: any) => {
    try {
      if (entry.id) {
        // Update existing entry
        await update(entry.id, entry);
      } else {
        // Create new entry
        await add(entry);
      }
      // Refresh to get latest data
      await refresh();
    } catch (error) {
      console.error("Error saving entry:", error);
      alert("Failed to save entry. Please try again.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await remove(id);
      await refresh();
    } catch (error) {
      console.error("Error deleting entry:", error);
      alert("Failed to delete entry. Please try again.");
    }
  };

  const formattedData = filteredData.map(d => ({
    ...d,
    lastServiced: d.lastServiced ? format(new Date(d.lastServiced), "yyyy-MM-dd") : "",
    nextServiceDue: d.nextServiceDue ? format(new Date(d.nextServiceDue), "yyyy-MM-dd") : "",
    scheduledDate: d.scheduledDate ? format(new Date(d.scheduledDate), "yyyy-MM-dd") : "",
  }));

  const queueData = [...formattedData].sort(
  (a, b) =>
    (b.priority ?? 0) - (a.priority ?? 0) ||
    String(a.id).localeCompare(String(b.id))
);

  const handleHistoryClick = (key: string, value: any, row: any) => {
    setSelectedEntry(row as any);
    setDrawerOpen(true);
  };

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <p className="text-red-600">Error: {error}</p>
        <Button onClick={refresh}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
        <div className="flex gap-2">
          <Button 
            variant={view === "dashboard" ? "default" : "ghost"} 
            onClick={() => setView("dashboard")} 
            className="text-lg font-bold px-4 py-2"
          >
            Maintenance Dashboard
          </Button>
          <Button variant={view === "table" ? "default" : "outline"} onClick={() => setView("table")}>
            <TableIcon className="w-4 h-4 mr-2" /> Table
          </Button>
          <Button variant={view === "queue" ? "default" : "outline"} onClick={() => setView("queue")}>
            <ListChecks className="w-4 h-4 mr-2" /> Queue
          </Button>
        </div>

        <div className="flex gap-2">
          <SearchPopover data={entries} onSearch={setFilteredData} columnHeaders={columnHeaders} />
          <Button onClick={refresh} variant="outline">Refresh</Button>
          <Button variant="default" onClick={() => { setSelectedEntry(null); setDrawerOpen(true); }}>New</Button>
        </div>
      </div>

      {view === "table" ? (
        <div className="">
          <DynamicTable
            data={formattedData}
            columnHeaders={columnHeaders}
            onRowClick={(row) => { setSelectedEntry(row as any); setDrawerOpen(true); }}
          />
        </div>
 
      ) : view === "queue" ? (
        <DynamicQueue
          data={queueData}
          renderCard={(row) => (
            <div
              className="bg-white rounded-lg shadow p-4 cursor-pointer hover:shadow-lg transition"
              onClick={() => { setSelectedEntry(row); setDrawerOpen(true); }}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold">{row.type}</span>
                <span className="text-sm font-medium text-gray-500">Priority {row.priority}</span>
              </div>
              <div className="text-sm text-gray-700 mb-1">ID: {row.id}</div>
              <div className="text-sm text-gray-700 mb-1">Status: {row.status}</div>
              <div className="text-sm text-gray-700 mb-1">Assigned: {row.assignedTo}</div>
              {row.issue && <div className="text-sm text-purple-600 mt-2">{row.issue}</div>}
              {row.scheduledDate && <div className="text-xs text-gray-500 mt-1">Scheduled: {row.scheduledDate}</div>}
            </div>
          )}
        />
      ) : (
        <DynamicKanban
          data={formattedData}
          onCardClick={(card) => { setSelectedEntry(card as any); setDrawerOpen(true); }}
        />
      )}

      <EntryDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        entry={selectedEntry}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </div>
  );
}