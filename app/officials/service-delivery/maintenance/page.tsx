'use client';

import { useState, useMemo } from "react";

// from SHADCN UI for components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";



// from LUCIDE-REACT for icons
import { 
  LayoutDashboard, 
  Table as TableIcon, 
  ListChecks, 
  KanbanSquare,
  Search
} from "lucide-react"

// Here are the views used in this component. Feel welcome to edit or add more views!
import DynamicTable from "@/components/dynamicViewers/dynamic-table";
import DynamicQueue from "@/components/dynamicViewers/dynamic-queue"; // needs more editing!
import DynamicKanban from "@/components/dynamicViewers/dynamic-kanban";
import { format } from "date-fns";

// ----- Unified Dataset, add more if you need to! -----
const initialData = [
  {
    id: "PR-0012",
    type: "AC Unit",
    status: "Operational",
    priority: 3,
    assignedTo: "John Santos",
    lastServiced: new Date("2025-01-12"),
    nextServiceDue: new Date("2025-04-12"),
    scheduledDate: new Date("2025-12-10"),
    issue: "AC filter replacement",
  },
  {
    id: "PR-0047",
    type: "Generator",
    status: "Under Maintenance",
    priority: 2,
    assignedTo: "Maria Dela Cruz",
    lastServiced: new Date("2025-02-05"),
    nextServiceDue: new Date("2025-05-05"),
    scheduledDate: new Date("2025-12-12"),
    issue: "Generator oil change",
  },
  {
    id: "PR-0153",
    type: "Water Pump",
    status: "Operational",
    priority: 1,
    assignedTo: "Carlo Reyes",
    lastServiced: new Date("2025-01-28"),
    nextServiceDue: new Date("2025-04-28"),
    scheduledDate: new Date("2025-12-15"),
    issue: "Pump inspection",
  },
];

// (Edit this) ----- Entry Drawer Component -----
// If you want to change the SHEET/DRAWER UI, modify this component
// It handles both creating new entries and editing existing ones
// Just add the edits needed if you're making entries or editing existing ones
function EntryDrawer({ open, onOpenChange, entry, onSave, onDelete }: { open: boolean; onOpenChange: (val: boolean) => void; entry: any | null; onSave: (data: any) => void; onDelete?: (id: string) => void }) {
  const [form, setForm] = useState<any>(entry || {});

  const handleChange = (key: string, value: any) => {
    setForm((prev: any) => ({ ...prev, [key]: value }));
  };

  useMemo(() => {
    setForm(entry || {});
  }, [entry]);

  const validateForm = () => {
    if (!form.id || !form.type || !form.status || !form.assignedTo) {
      alert("Please fill all required fields!");
      return false;
    }
    return true;
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="p-6 max-w-md">
        <SheetHeader>
          <SheetTitle>{form.id ? "Edit Entry" : "New Entry"}</SheetTitle>
          <SheetDescription>
            Fill in the details below. {form.id ? "You can update or delete the entry." : ""}
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-3 mt-4">
          <Input placeholder="ID" value={form.id || ""} onChange={(e) => handleChange("id", e.target.value)} disabled={!!form.id} />
          <Input placeholder="Type" value={form.type || ""} onChange={(e) => handleChange("type", e.target.value)} />
          <Input placeholder="Status" value={form.status || ""} onChange={(e) => handleChange("status", e.target.value)} />
          <Input placeholder="Assigned To" value={form.assignedTo || ""} onChange={(e) => handleChange("assignedTo", e.target.value)} />
          <Input placeholder="Issue" value={form.issue || ""} onChange={(e) => handleChange("issue", e.target.value)} />
          <Input type="number" placeholder="Priority (1-5)" value={form.priority || ""} onChange={(e) => handleChange("priority", Number(e.target.value))} />
          <Input type="date" placeholder="Last Serviced" value={form.lastServiced ? format(new Date(form.lastServiced), "yyyy-MM-dd") : ""} onChange={(e) => handleChange("lastServiced", new Date(e.target.value))} />
          <Input type="date" placeholder="Next Service Due" value={form.nextServiceDue ? format(new Date(form.nextServiceDue), "yyyy-MM-dd") : ""} onChange={(e) => handleChange("nextServiceDue", new Date(e.target.value))} />
          <Input type="date" placeholder="Scheduled Date" value={form.scheduledDate ? format(new Date(form.scheduledDate), "yyyy-MM-dd") : ""} onChange={(e) => handleChange("scheduledDate", new Date(e.target.value))} />

          <div className="flex gap-2 mt-2 justify-end">
            {form.id && onDelete && (
              <Button variant="destructive" onClick={() => { onDelete(form.id); onOpenChange(false); }}>Delete</Button>
            )}
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button variant="default" onClick={() => { if (validateForm()) { onSave(form); onOpenChange(false); } }}>Save</Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}


// Edit this ----- Advanced Search Component -----
// Based on the page, modify this depending on the search that you might need
function SearchBar({ data, onSearch }: { data: any[], onSearch: (filtered: any[]) => void }) {
  const [query, setQuery] = useState("");
  const [filterBy, setFilterBy] = useState("all");
  const [dateFilterType, setDateFilterType] = useState("none");
  const [dateValue, setDateValue] = useState("");

  const handleSearch = () => {
    const terms = query.split(" ").map(t => t.toLowerCase()).filter(Boolean);

    const filtered = data.filter(row => {
      const textMatch = terms.every(term => Object.keys(row).some(k => String(row[k]).toLowerCase().includes(term)));

      let dateMatch = true;
      if (dateFilterType !== "none" && dateValue) {
        const targetDate = new Date(dateValue);
        const rowDates = Object.keys(row).filter(k => row[k] instanceof Date).map(k => new Date(row[k]));
        if (rowDates.length > 0) {
          if (dateFilterType === "before") dateMatch = rowDates.some(d => d < targetDate);
          if (dateFilterType === "after") dateMatch = rowDates.some(d => d > targetDate);
          if (dateFilterType === "on") dateMatch = rowDates.some(d => d.toDateString() === targetDate.toDateString());
        }
      }

      const columnMatch = filterBy === "all" ? true : String(row[filterBy]).toLowerCase().includes(query.toLowerCase());

      return textMatch && dateMatch && columnMatch;
    });

    onSearch(filtered);
  };

  return (
    <div className="flex flex-wrap gap-2 mb-4 items-center">
      <Input className="flex-1" placeholder="Search terms (space separated)" value={query} onChange={(e) => setQuery(e.target.value)} />
      <Select onValueChange={(val) => setFilterBy(val)} value={filterBy}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter column" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Columns</SelectItem>
          {data.length > 0 && Object.keys(data[0]).map(col => (
            <SelectItem key={col} value={col}>{col}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select onValueChange={(val) => setDateFilterType(val)} value={dateFilterType}>
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder="Date Filter" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">None</SelectItem>
          <SelectItem value="before">Before</SelectItem>
          <SelectItem value="after">After</SelectItem>
          <SelectItem value="on">On</SelectItem>
        </SelectContent>
      </Select>
      {dateFilterType !== "none" && <Input type="date" value={dateValue} onChange={(e) => setDateValue(e.target.value)} />}
      <Button variant="default" onClick={handleSearch}>Search</Button>
    </div>
  );
}

// You can edit this! Mostly this handles popover search parameters. Add more if you like!
function SearchPopover({
  data,
  onSearch,
}: {
  data: any[];
  onSearch: (filtered: any[]) => void;
}) {
  const [query, setQuery] = useState("");
  const [filterBy, setFilterBy] = useState("all");
  const [dateFilterType, setDateFilterType] = useState("none");
  const [dateValue, setDateValue] = useState<Date | undefined>();

  const runSearch = () => {
    const terms = query
      .split(" ")
      .map((t) => t.toLowerCase())
      .filter(Boolean);

    const filtered = data.filter((row) => {
      const textMatch = terms.every((term) =>
        Object.keys(row).some((k) =>
          String(row[k]).toLowerCase().includes(term)
        )
      );

      let dateMatch = true;

      if (dateFilterType !== "none" && dateValue) {
        const rowDates = Object.keys(row)
          .filter((k) => row[k] instanceof Date || !isNaN(Date.parse(row[k])))
          .map((k) => new Date(row[k]));

        const target = new Date(dateValue);

        if (dateFilterType === "before")
          dateMatch = rowDates.some((d) => d < target);

        if (dateFilterType === "after")
          dateMatch = rowDates.some((d) => d > target);

        if (dateFilterType === "on")
          dateMatch = rowDates.some(
            (d) => d.toDateString() === target.toDateString()
          );
      }

      const columnMatch =
        filterBy === "all"
          ? true
          : String(row[filterBy]).toLowerCase().includes(query.toLowerCase());

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

        {/* Keyword search */}
        <Input
          placeholder="Search keywords…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        {/* Column filter */}
        <Select value={filterBy} onValueChange={setFilterBy}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by column" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Columns</SelectItem>
            {data.length > 0 &&
              Object.keys(data[0]).map((col) => (
                <SelectItem key={col} value={col}>
                  {col}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>

        {/* Date filter type */}
        <Select
          value={dateFilterType}
          onValueChange={(val) => setDateFilterType(val)}
        >
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

        {/* Calendar selection */}
        {dateFilterType !== "none" && (
          <Calendar
            mode="single"
            selected={dateValue}
            onSelect={setDateValue}
            className="rounded-md border"
          />
        )}

        <Button className="w-full" onClick={runSearch}>
          Apply Search
        </Button>
      </PopoverContent>
    </Popover>
  );
}


// (edit this) ----- Main Maintenance Page -----
// Edit this if you'd like to edit the page itself
export default function MaintenancePage() {
  const [view, setView] = useState<"dashboard" | "table" | "queue" | "kanban">("table");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<any | null>(null);
  const [data, setData] = useState(initialData);
  const [filteredData, setFilteredData] = useState(initialData);

  // Edit the handler to open drawer on history click
  const handleHistoryClick = (key: string, value: any, row: any) => {
    setSelectedEntry(row);
    setDrawerOpen(true);
  };

  const handleSave = (newEntry: any) => {
    setData(prev => {
      const exists = prev.find(d => d.id === newEntry.id);
      if (exists) return prev.map(d => d.id === newEntry.id ? newEntry : d);
      return [...prev, newEntry];
    });
    setFilteredData(prev => {
      const exists = prev.find(d => d.id === newEntry.id);
      if (exists) return prev.map(d => d.id === newEntry.id ? newEntry : d);
      return [...prev, newEntry];
    });
  };

  const handleDelete = (id: string) => {
    setData(prev => prev.filter(d => d.id !== id));
    setFilteredData(prev => prev.filter(d => d.id !== id));
  };

  // Format dates for rendering to avoid React errors
  const formattedData = filteredData.map(d => ({
    ...d,
    lastServiced: d.lastServiced ? format(new Date(d.lastServiced), "yyyy-MM-dd") : "",
    nextServiceDue: d.nextServiceDue ? format(new Date(d.nextServiceDue), "yyyy-MM-dd") : "",
    scheduledDate: d.scheduledDate ? format(new Date(d.scheduledDate), "yyyy-MM-dd") : "",
  }));

  // Queue ordering by priority desc, then ID
  const queueData = formattedData
    .filter((d:any) => d.viewType !== "table" || true) // every item supports both views
    .sort((a, b) => b.priority - a.priority || a.id.localeCompare(b.id));

  return (
    <div className="p-4 space-y-4">
      {/* Flex container for buttons, EDIT IF YOU WANT TO ADD MORE VIEWS */}
      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
        <div className="flex gap-2">
          {/* Dashboard / Main Label */}
          <Button
            variant={view === "dashboard" ? "default" : "ghost"}
            onClick={() => setView("dashboard")}
            className="text-lg font-bold px-4 py-2"
          >
            {/* <LayoutDashboard className="w-4 h-4 mr-2" /> */}
            Maintenance Dashboard
          </Button>

          {/* Table */}
          <Button
            variant={view === "table" ? "default" : "outline"}
            onClick={() => setView("table")}
          >
            <TableIcon className="w-4 h-4 mr-2" />
            Table
          </Button>

          {/* Queue */}
          <Button
            variant={view === "queue" ? "default" : "outline"}
            onClick={() => setView("queue")}
          >
            <ListChecks className="w-4 h-4 mr-2" />
            Queue
          </Button>

          {/* Kanban */}
          <Button
            variant={view === "kanban" ? "default" : "outline"}
            onClick={() => setView("kanban")}
          >
            <KanbanSquare className="w-4 h-4 mr-2" />
            Kanban
          </Button>
        </div>
        <div className="flex gap-2">
          {/* If you want to add search bars, add this component here */}
          <SearchPopover data={data} onSearch={setFilteredData} />
          <Button variant="default" onClick={() => { setSelectedEntry(null); setDrawerOpen(true); }}>New</Button>
        </div>
      </div>      

      {/* This is the page switcher if you want to change between views */}
      { view === "table" ? (
        <>
          <DynamicTable
            data={formattedData}
            onRowClick={(row) => {
              setSelectedEntry(row); // open drawer
              setDrawerOpen(true);
            }}
          />
        </>
      ) : view === "queue" ? (
        <>          
          {/* Please design this for a full queue view please! */}
          {/* Edit the renderCard part to customize the queue item appearance */}
          <DynamicQueue
            data={formattedData}
            renderCard={(row) => (
              <div
                className="bg-white rounded-lg shadow p-4 cursor-pointer hover:shadow-lg transition"
                onClick={() => handleHistoryClick("issue", row.issue, row)}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold">{row.type}</span>
                  <span className="text-sm font-medium text-gray-500">Priority {row.priority}</span>
                </div>
                <div className="text-sm text-gray-700 mb-1">ID: {row.id}</div>
                <div className="text-sm text-gray-700 mb-1">Assigned: {row.assignedTo}</div>
                {row.issue && <div className="text-sm text-purple-600 underline">{row.issue}</div>}
                {row.scheduledDate && (
                  <div className="text-xs text-gray-500">
                    Scheduled: {format(new Date(row.scheduledDate), "yyyy-MM-dd")}
                  </div>
                )}
              </div>
            )}
          />
        </>
      ) : (
        <DynamicKanban
          data={formattedData} // pass full data
          onCardClick={(card) => {
            setSelectedEntry(card);
            setDrawerOpen(true);
          }}
        />
      )}

      {/* Always enable this so that the drawer is available, but only opens when you trigger setDrawerOpen as true */}
      <EntryDrawer open={drawerOpen} onOpenChange={setDrawerOpen} 
                  entry={selectedEntry} onSave={handleSave} onDelete={handleDelete} />
    </div>
  );
}
