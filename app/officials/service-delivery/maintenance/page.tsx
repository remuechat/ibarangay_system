'use client'

import { useState, useEffect } from "react";
import { Loader2, Search, Plus, TableIcon, ListChecks, KanbanSquare } from "lucide-react";
import { format } from "date-fns";

// SHADCN UI
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectTrigger, SelectValue, SelectItem } from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";

// Dynamic views
import DynamicTable from "@/components/dynamicViewers/dynamic-table";
import DynamicQueue from "@/components/dynamicViewers/dynamic-queue";
import DynamicKanban from "@/components/dynamicViewers/dynamic-kanban";

// Hooks
import { useMaintenance } from "@/hooks/use-maintenance";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

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

const maintenanceFormSchema = z.object({
  type: z.string().min(1, "Type is required").min(2, "Type must be at least 2 characters"),
  status: z.enum(["pending", "processing", "resolved"]),
  priority: z.number().min(1).max(5, "Priority must be between 1 and 5"),
  assignedTo: z.string().min(1, "Assigned To is required"),
  issue: z.string().optional(),
  lastServiced: z.string().optional(),
  nextServiceDue: z.string().optional(),
  scheduledDate: z.string().optional(),
}).refine((data) => {
  if (data.lastServiced && data.nextServiceDue) {
    const lastServiced = new Date(data.lastServiced);
    const nextServiceDue = new Date(data.nextServiceDue);
    return nextServiceDue > lastServiced;
  }
  return true;
}, {
  message: "Next service due must be after last service date",
  path: ["nextServiceDue"],
})

type MaintenanceFormValues = z.infer<typeof maintenanceFormSchema>

// Priority descriptions (for UI only)
const PRIORITY_OPTIONS = [
  { value: 5, label: "5 - Critical", description: "Urgent attention required" },
  { value: 4, label: "4 - High", description: "Important, address soon" },
  { value: 3, label: "3 - Medium", description: "Standard priority" },
  { value: 2, label: "2 - Low", description: "Address when possible" },
  { value: 1, label: "1 - Very Low", description: "Minimal impact" },
];

// Maintenance Form Component
function MaintenanceForm({ 
  entry, 
  onSave, 
  onBack, 
  onDelete 
}: { 
  entry: MaintenanceEntry | null; 
  onSave: (data: MaintenanceEntry) => void; 
  onBack: () => void;
  onDelete?: (id: string) => void 
}) {
  const form = useForm<MaintenanceFormValues>({
    resolver: zodResolver(maintenanceFormSchema),
    defaultValues: {
      type: "",
      status: "pending",
      priority: 3,
      assignedTo: "",
      issue: "",
      lastServiced: "",
      nextServiceDue: "",
      scheduledDate: "",
    },
  })

  useEffect(() => {
    if (entry) {
      form.reset({
        type: entry.type || "",
        status: entry.status || "pending",
        priority: entry.priority || 3,
        assignedTo: entry.assignedTo || "",
        issue: entry.issue || "",
        lastServiced: entry.lastServiced || "",
        nextServiceDue: entry.nextServiceDue || "",
        scheduledDate: entry.scheduledDate || "",
      });
    } else {
      form.reset({
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
  }, [entry, form])

  const onSubmit = (data: MaintenanceFormValues) => {
    const dataToSave: MaintenanceEntry = {
      ...data,
      type: data.type.trim(),
      assignedTo: data.assignedTo.trim(),
      issue: data.issue?.trim() || "",
    };

    if (!entry?.id) {
      delete dataToSave.id;
    } else {
      dataToSave.id = entry.id;
    }

    onSave(dataToSave);
  }

  return (
    <Sheet open={true} onOpenChange={onBack}>
      <SheetContent className="p-6 max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{entry?.id ? "Edit Entry" : "New Entry"}</SheetTitle>
          <SheetDescription>
            Fill in the details below. {entry?.id ? "You can update or delete the entry." : ""}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-4">
          {/* Type Field */}
          <div>
            <Label htmlFor="type" className="text-sm font-medium">
              Type *
            </Label>
            <Input 
              id="type"
              placeholder="Maintenance Type" 
              {...form.register("type")}
            />
            {form.formState.errors.type && (
              <p className="text-xs text-red-500 mt-1">{form.formState.errors.type.message}</p>
            )}
          </div>
          
          {/* Status Field */}
          <div>
            <Label htmlFor="status" className="text-sm font-medium">
              Status *
            </Label>
            <Select 
              value={form.watch("status")} 
              onValueChange={(value: "pending" | "processing" | "resolved") => form.setValue("status", value)}
            >
              <SelectTrigger id="status">
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
              {...form.register("assignedTo")}
            />
            {form.formState.errors.assignedTo && (
              <p className="text-xs text-red-500 mt-1">{form.formState.errors.assignedTo.message}</p>
            )}
          </div>
          
          {/* Issue Field */}
          <div>
            <Label htmlFor="issue" className="text-sm font-medium">
              Issue
            </Label>
            <Input 
              id="issue"
              placeholder="Description of the issue" 
              {...form.register("issue")}
            />
          </div>
          
          {/* Priority Field */}
          <div>
            <Label htmlFor="priority" className="text-sm font-medium">
              Priority *
            </Label>
            <Select 
              value={form.watch("priority").toString()} 
              onValueChange={(value) => form.setValue("priority", parseInt(value))}
            >
              <SelectTrigger id="priority">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                {PRIORITY_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value.toString()}>
                    <div className="flex flex-col">
                      <span>{option.label}</span>
                      <span className="text-xs text-muted-foreground">{option.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.priority && (
              <p className="text-xs text-red-500 mt-1">{form.formState.errors.priority.message}</p>
            )}
          </div>
          
          {/* Date Fields */}
          <div>
            <Label htmlFor="lastServiced" className="text-sm font-medium">
              Last Serviced
            </Label>
            <Input 
              id="lastServiced"
              type="date" 
              {...form.register("lastServiced")}
            />
          </div>
          
          <div>
            <Label htmlFor="nextServiceDue" className="text-sm font-medium">
              Next Service Due
            </Label>
            <Input 
              id="nextServiceDue"
              type="date" 
              {...form.register("nextServiceDue")}
            />
            {form.formState.errors.nextServiceDue && (
              <p className="text-xs text-red-500 mt-1">{form.formState.errors.nextServiceDue.message}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="scheduledDate" className="text-sm font-medium">
              Scheduled Date
            </Label>
            <Input 
              id="scheduledDate"
              type="date" 
              {...form.register("scheduledDate")}
            />
          </div>

          <div className="flex gap-2 mt-4 justify-end">
            {entry?.id && onDelete && (
              <Button 
                type="button"
                variant="destructive" 
                onClick={() => { 
                  if (confirm("Are you sure you want to delete this entry?")) {
                    onDelete(entry.id as string); 
                    onBack(); 
                  }
                }}
              >
                Delete
              </Button>
            )}
            <Button type="button" variant="outline" onClick={onBack}>Cancel</Button>
            <Button type="submit" variant="default">
              Save
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}

function MaintenanceSearchPopover({ 
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

export default function MaintenancePage() {
  const [view, setView] = useState<"table" | "queue" | "kanban">("table");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<MaintenanceEntry | null>(null);
  const [filteredData, setFilteredData] = useState<any[]>([]);

  // CRUD hook
  const { entries, loading, error, refresh, add, update, remove } = useMaintenance();

  // Sync filtered data
  useEffect(() => {
    setFilteredData(entries);
  }, [entries]);

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

  // Format data dates
  const formattedData = filteredData.map(d => ({
    ...d,
    lastServiced: d.lastServiced ? format(new Date(d.lastServiced), "yyyy-MM-dd") : "",
    nextServiceDue: d.nextServiceDue ? format(new Date(d.nextServiceDue), "yyyy-MM-dd") : "",
    scheduledDate: d.scheduledDate ? format(new Date(d.scheduledDate), "yyyy-MM-dd") : "",
  }));

  const queueData = [...formattedData].sort(
    (a, b) =>
    (b.priority ?? 0) - (a.priority ?? 0) || // Higher priority first
    String(a.id).localeCompare(String(b.id))
  );

  // Handlers
  const handleSave = async (entry: MaintenanceEntry) => {
    try {
      if (entry.id) await update(entry.id, entry);
      else await add(entry);
      await refresh();
      setDrawerOpen(false);
    } catch (err) {
      console.error(err);
      alert("Failed to save entry.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await remove(id);
      await refresh();
      setDrawerOpen(false);
    } catch (err) {
      console.error(err);
      alert("Failed to delete entry.");
    }
  };

  // Show loading
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
      </div>
    );
  }

  // Show error
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <p className="text-red-600">Error: {error}</p>
        <Button onClick={refresh}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Maintenance and Repairs</h1>
        <div className="flex gap-2">
          <MaintenanceSearchPopover data={entries} onSearch={setFilteredData} columnHeaders={columnHeaders} />
          <Button variant="outline" onClick={refresh}>Refresh</Button>
          <Button variant="default" onClick={() => { setSelectedEntry(null); setDrawerOpen(true); }}>
            <Plus className="w-4 h-4 mr-2" /> New
          </Button>
        </div>
      </div>

      {/* VIEW SWITCHER */}
      <div className="flex gap-2">
        <Button variant={view === "table" ? "default" : "outline"} onClick={() => setView("table")}>
          <TableIcon className="w-4 h-4 mr-2" /> List
        </Button>
        <Button variant={view === "queue" ? "default" : "outline"} onClick={() => setView("queue")}>
          <ListChecks className="w-4 h-4 mr-2" /> By Priority
        </Button>
        <Button variant={view === "kanban" ? "default" : "outline"} onClick={() => setView("kanban")}>
          <KanbanSquare className="w-4 h-4 mr-2" /> By Status
        </Button>
      </div>

      {/* VIEWS */}
      {view === "table" && (
        <DynamicTable
          data={formattedData}
          columnHeaders={columnHeaders}
          onRowClick={(row) => { setSelectedEntry(row); setDrawerOpen(true); }}
        />
      )}
      {view === "queue" && (
        <DynamicQueue
          data={queueData}
          renderCard={(row) => (
            <div
              className="rounded-lg shadow p-4 cursor-pointer transition hover:shadow-lg bg-card text-card-foreground"
              onClick={() => { setSelectedEntry(row); setDrawerOpen(true); }}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold">{row.type}</span>
                <span className="text-sm font-medium text-muted-foreground">Priority {row.priority}</span>
              </div>
              <div className="text-sm mb-1">ID: {row.id}</div>
              <div className="text-sm mb-1">Status: {row.status}</div>
              <div className="text-sm mb-1">Assigned: {row.assignedTo}</div>
              {row.issue && <div className="text-sm text-primary mt-2">{row.issue}</div>}
              {row.scheduledDate && (
                <div className="text-xs text-muted-foreground mt-1">Scheduled: {row.scheduledDate}</div>
              )}
            </div>
          )}
        />
      )}
      {view === "kanban" && (
        <DynamicKanban
          data={formattedData}
          onCardClick={(card) => { setSelectedEntry(card); setDrawerOpen(true); }}
        />
      )}

      {/* ENTRY FORM */}
      {drawerOpen && (
        <MaintenanceForm
          entry={selectedEntry}
          onSave={handleSave}
          onBack={() => setDrawerOpen(false)}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
