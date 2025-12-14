'use client'

import { useState, useEffect } from "react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"

import { Table as TableIcon, ListChecks, KanbanSquare, Search, CreditCard } from "lucide-react"

import DynamicTable from "@/components/dynamicViewers/dynamic-table"
import DynamicQueue from "@/components/dynamicViewers/dynamic-queue"
import DynamicKanban from "@/components/dynamicViewers/dynamic-kanban"
import DynamicCardList from "@/components/dynamicViewers/dynamic-cardlist"

import IncidentForm from "@/components/incident-form"
import { Incident } from "@/amplify/backend/functions/incidentsApi/src/Incident"
import { useIncidents } from "@/hooks/use-Incidents" // <- your backend hook

// ------------------------- SEARCH POPOVER -------------------------
function SearchPopover({
  data,
  onSearch,
  columnHeaders,
  incidentTypes,
  statusTypes,
}: {
  data: Incident[]
  onSearch: (filtered: Incident[]) => void
  columnHeaders: Record<string, string>
  incidentTypes: string[]
  statusTypes: string[]
}) {
  const [query, setQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState<string | "all">("all")
  const [statusFilter, setStatusFilter] = useState<string | "all">("all")
  const [dateFilterType, setDateFilterType] = useState<"none"|"before"|"after"|"on">("none")
  const [dateValue, setDateValue] = useState<Date>()

  const runSearch = () => {
    const terms = query.toLowerCase().split(" ").filter(Boolean)
    const filtered = data.filter(row => {
      const textMatch = terms.every(term =>
        Object.values(row).some(val =>
          String(val).toLowerCase().includes(term)
        )
      )

      const typeMatch = typeFilter === "all" ? true : row.type === typeFilter
      const statusMatch = statusFilter === "all" ? true : row.status === statusFilter

      let dateMatch = true
      if(dateFilterType !== "none" && dateValue) {
        const rowDates = ["dateReported","dateResolved"]
          .filter(k => row[k as keyof Incident])
          .map(k => new Date(row[k as keyof Incident] as string))
        if(rowDates.length > 0) {
          if(dateFilterType === "before") dateMatch = rowDates.some(d => d < dateValue)
          if(dateFilterType === "after") dateMatch = rowDates.some(d => d > dateValue)
          if(dateFilterType === "on") dateMatch = rowDates.some(d => d.toDateString() === dateValue.toDateString())
        }
      }

      return textMatch && typeMatch && statusMatch && dateMatch
    })

    onSearch(filtered)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <Search className="w-4 h-4 mr-2"/> Search
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-4 space-y-4">
        <Input placeholder="Search keywords…" value={query} onChange={e => setQuery(e.target.value)} />

        {/* Incident Type Filter */}
        <div>
          <p className="text-sm font-medium mb-1">Incident Type:</p>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {incidentTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {/* Status Filter */}
        <div>
          <p className="text-sm font-medium mb-1">Status:</p>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {statusTypes.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {/* Date Filter */}
        <Select value={dateFilterType} onValueChange={val => setDateFilterType(val as any)}>
          <SelectTrigger><SelectValue placeholder="Date Filter" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No Date Filter</SelectItem>
            <SelectItem value="before">Before</SelectItem>
            <SelectItem value="after">After</SelectItem>
            <SelectItem value="on">On</SelectItem>
          </SelectContent>
        </Select>
        {dateFilterType !== "none" && (
          <Input type="date" value={dateValue ? format(dateValue,"yyyy-MM-dd") : ""} onChange={e => setDateValue(new Date(e.target.value))} />
        )}

        <Button className="w-full" onClick={runSearch}>Apply Search</Button>
      </PopoverContent>
    </Popover>
  )
}

// ------------------------- ENTRY DRAWER -------------------------
function EntryDrawer({ open, onOpenChange, incident, onSave }: { open: boolean; onOpenChange: (val:boolean)=>void; incident: Partial<Incident>|null; onSave: (incident: Incident)=>void }) {
  return open ? (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent 
       style={{ width: '30vw', maxWidth: '30vw' }} 
       className="max-w-md max-h-[90vh] p-6 overflow-y-auto">
    <IncidentForm
      incident={incident}
      onBack={() => onOpenChange(false)}
      onSave={onSave}
      />
    </SheetContent>
  </Sheet>
  ) : null
}

// ------------------------- MAIN PAGE -------------------------
export default function IncidentsPage() {
  const { incidents, loading, error, refresh, add, update, remove } = useIncidents()
  const [view, setView] = useState<"table" | "queue" | "kanban" | "cards">("cards")
  const [drawerOpen,setDrawerOpen] = useState(false)
  const [selectedIncident,setSelectedIncident] = useState<Partial<Incident>|null>(null)
  const [filteredData,setFilteredData] = useState<Incident[]>([])

  useEffect(() => {
    setFilteredData(incidents)
  }, [incidents])

  const handleSave = async (incident: Incident) => {
    try {
      if(incident.incidentId) {
        const updated = await update(incident.incidentId, incident)
      } else {
        const created = await add(incident)
      }
      refresh() // refresh after add/update
    } catch(err) {
      console.error(err)
    }
    setDrawerOpen(false)
  }

  // Map incidentId → id for Dynamic components
  const mappedData = filteredData.map(inc => ({
    ...inc,
    id: inc.incidentId
  }))

  const columnHeaders: Record<string, string> = {
    id: "ID",
    dateReported: "Date Reported",
    timeReported: "Time Reported",
    type: "Type",
    location: "Location",
    purok: "Purok / Zone",
    reportedBy: "Reported By",
    description: "Description",
    involvedParties: "Involved Parties",
    status: "Status",
    assignedOfficer: "Assigned Officer",
    dateResolved: "Date Resolved",
    notes: "Notes",
  }

  return (
    <div className="p-4 space-y-4">
      {/* VIEW SWITCH */}
      <div className="flex justify-between flex-wrap gap-2 mb-4">
        <div className="flex gap-2">
          <Button variant={view==="cards"?"default":"outline"} onClick={()=>setView("cards")}>
          <CreditCard className="w-4 h-4 mr-2"/> Cards
        </Button>
          <Button variant={view==="table"?"default":"outline"} onClick={()=>setView("table")}>
            <TableIcon className="w-4 h-4 mr-2"/> Table
          </Button>
          <Button variant={view==="queue"?"default":"outline"} onClick={()=>setView("queue")}>
            <ListChecks className="w-4 h-4 mr-2"/> Queue
          </Button>
          <Button variant={view==="kanban"?"default":"outline"} onClick={()=>setView("kanban")}>
            <KanbanSquare className="w-4 h-4 mr-2"/> Kanban
          </Button>
        </div>
        <div className="flex gap-2">
          <SearchPopover
            data={mappedData}
            onSearch={setFilteredData}
            columnHeaders={columnHeaders}
            incidentTypes={["Noise Complaint", "Theft", "Disturbance", "Traffic Violation", "Vandalism", "Curfew Violation", "Domestic Dispute", "Other"]}
            statusTypes={["Pending", "Investigating", "Resolved", "Closed"]}
          />
          <Button variant="default" onClick={()=>{ setSelectedIncident(null); setDrawerOpen(true) }}>New</Button>
        </div>
      </div>

      {/* CARD LIST VIEW */}
      {view==="cards" && (
        <DynamicCardList
        data={mappedData}
        titleField="type"
        statusField="status"
        hiddenFields={["incidentId"]}
        onCardClick={(incident) => setSelectedIncident(incident)}/>
      )}

      {/* TABLE VIEW */}
      {view==="table" && (
        <DynamicTable
          data={mappedData}
          columnHeaders={columnHeaders}
          onRowClick={(row)=>{ setSelectedIncident(row); setDrawerOpen(true) }}
        />
      )}

      {/* QUEUE VIEW */}
      {view==="queue" && (
        <DynamicQueue
          data={mappedData}
          renderCard={(row)=>(<div className="bg-white rounded-lg shadow p-4 cursor-pointer hover:shadow-lg transition" onClick={()=>{setSelectedIncident(row); setDrawerOpen(true)}}>
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold">{row.type}</span>
              <span className="text-sm font-medium text-gray-500">{row.status}</span>
            </div>
            <div className="text-sm text-gray-700 mb-1">ID: {row.id}</div>
            <div className="text-sm text-gray-700 mb-1">Assigned Officer: {row.assignedOfficer}</div>
          </div>)}
        />
      )}

      {/* KANBAN VIEW */}
      {view==="kanban" && (
        <DynamicKanban
          data={mappedData}
          onCardClick={(card)=>{ setSelectedIncident(card); setDrawerOpen(true) }}
        />
      )}

      {/* ENTRY DRAWER */}
      <EntryDrawer open={drawerOpen} onOpenChange={setDrawerOpen} incident={selectedIncident} onSave={handleSave} />
    </div>
  )
}
