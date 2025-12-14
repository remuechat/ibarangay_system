'use client'

import { useState, useMemo } from 'react';
import { Sheet, SheetContent } from '@/components/ui/sheet'
import DynamicTable from '@/components/dynamicViewers/dynamic-table'
import ResidentForm from '@/components/resident-form'
import ResidentProfile from "@/app/officials/residentinformation/profile/page"
import { Resident, mockResidents } from "@/app/officials/residentinformation/mockResidents"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectTrigger, SelectValue, SelectItem } from "@/components/ui/select"
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'
import { Input } from "@/components/ui/input"

/* =====================================================
   SEARCH POPOVER
   ===================================================== */

export function ResidentSearchPopover({
  data,
  onSearch,
}: {
  data: Resident[];
  onSearch: (filtered: Resident[]) => void;
}) {
  const [query, setQuery] = useState("");
  const [purokFilter, setPurokFilter] = useState<string | "all">("all");
  const [statusFilter, setStatusFilter] = useState<string | "all">("all");
  const [vulFilter, setVulFilter] = useState<string | "all">("all");

  // Extract unique puroks, statuses, and vulnerable types
  const puroks = useMemo(() => Array.from(new Set(data.map(r => r.purok))).sort(), [data]);
  const statuses = useMemo(() => Array.from(new Set(data.map(r => r.status))).sort(), [data]);
  const vulnerableTypes = useMemo(() => {
    const types = data.flatMap(r => r.vulnerableTypes || []);
    return Array.from(new Set(types)).sort();
  }, [data]);

  const runSearch = () => {
    const terms = query.toLowerCase().split(" ").filter(Boolean);
    const filtered = data.filter(r => {
      const textMatch = terms.every(term =>
        Object.values(r).some(val => String(val).toLowerCase().includes(term))
      );

      const purokMatch = purokFilter === "all" ? true : r.purok === purokFilter;
      const statusMatch = statusFilter === "all" ? true : r.status === statusFilter;
      const vulMatch =
        vulFilter === "all"
          ? true
          : (r.vulnerableTypes || []).includes(vulFilter);

      return textMatch && purokMatch && statusMatch && vulMatch;
    });

    onSearch(filtered);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <Search className="w-4 h-4 mr-2" /> Search
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-4 space-y-4">
        <Input
          placeholder="Search keywords…"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />

        {/* Purok Filter */}
        <div>
          <p className="text-sm font-medium mb-1">Purok:</p>
          <Select value={purokFilter} onValueChange={setPurokFilter}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Purok" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Puroks</SelectItem>
              {puroks.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {/* Status Filter */}
        <div>
          <p className="text-sm font-medium mb-1">Status:</p>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {statuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {/* Vulnerable Type Filter */}
        <div>
          <p className="text-sm font-medium mb-1">Vulnerable Type:</p>
          <Select value={vulFilter} onValueChange={setVulFilter}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {vulnerableTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <Button className="w-full" onClick={runSearch}>Apply Search</Button>
      </PopoverContent>
    </Popover>
  );
}

export default function ResidentsPage() {
  const [data, setData] = useState<Resident[]>(mockResidents)
  const [selectedResident, setSelectedResident] = useState<Resident | null>(null)
  const [filteredData,setFilteredData] = useState<Resident[]>(mockResidents)
  const [profileSheetOpen, setProfileSheetOpen] = useState(false)
  const [editSheetOpen, setEditSheetOpen] = useState(false)

  

  // Table columns
  const tableColumns: Record<string, string> = {
    id: 'ID',
    fullName: 'Name',
    address: 'Address',
    contactNumber: 'Contact No.',
    vulnerableTypes: 'Vulnerable Type',
    status: 'Status',
  }

  // Prepare table data
  const tableData = data.map((r) => ({
    ...r,
    fullName: `${r.firstName} ${r.lastName}`,
    address: `${r.houseNumber} ${r.street}, ${r.city}`,
    vulnerableTypes: r.vulnerableTypes || [], // keep as array
  }));

  // Save resident (from form)
  const handleSave = (resident: Resident) => {
    setData(prev => {
      const exists = prev.find(r => r.id === resident.id)
      if (exists) return prev.map(r => r.id === resident.id ? resident : r)
      return [...prev, resident]
    })
    setEditSheetOpen(false)
    setProfileSheetOpen(false)
  }

  // Helper for status color
  const statusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-700'
      case 'Inactive': return 'bg-gray-100 text-gray-700'
      case 'Transferred Out': return 'bg-yellow-100 text-yellow-700'
      case 'Deceased': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }


  return (
    <div className="p-4">
    {/* HEADER / TOOLBAR */}
        <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 rounded-t-lg">
          <h1 className="text-2xl font-bold">Resident Management</h1>

          <div className="flex gap-2">
            {/* Search / Filter Popover */}
            <ResidentSearchPopover
              data={filteredData}
              onSearch={setFilteredData}
            />

            {/* New Resident Button */}
            <Button
              onClick={() => {
                setSelectedResident(null); // Clear any selected resident
                setEditSheetOpen(true);    // Open the ResidentForm sheet
              }}
            >
              New
            </Button>
          </div>
        </div>

      {/* TABLE */}
      <table className="w-full min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden text-sm">
        <thead className="bg-gray-50">
          <tr>
            {Object.values(tableColumns).map((header) => (
              <th key={header} className="text-left font-medium text-black px-4 py-3">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableData.map((row) => (
            <tr
              key={row.id}
              className="border-t hover:bg-gray-50 cursor-pointer"
              onClick={() => { setSelectedResident(row); setProfileSheetOpen(true) }}
            >
              {/* ID */}
              <td className="px-4 py-3 text-gray-700">{row.id}</td>

              {/* Name + Family ID */}
              <td className="px-4 py-3 text-gray-700">
                <div>{row.fullName}</div>
                <div className="text-gray-400 text-xs">{row.familyId}</div>
              </td>

              {/* Address + Purok */}
              <td className="px-4 py-3 text-gray-700">
                <div>{`${row.houseNumber} ${row.street}`}</div>
                <div className="text-gray-400 text-xs">{row.purok}</div>
              </td>

              {/* Contact */}
              <td className="px-4 py-3 text-gray-700">{row.contactNumber}</td>

              {/* Vulnerable Types */}
              <td className="px-4 py-3 ">
                {row.vulnerableTypes.length > 0
                  ? row.vulnerableTypes.map((type: string) => (
                      <span
                        key={type}
                        className="px-2 py-0.5 rounded-full text-xs bg-orange-100 text-orange-700"
                      >
                        {type}
                      </span>
                    ))
                  : (
                    <span className="text-gray-400 text-xs">
                      None
                    </span>
                  )}
              </td>

              {/* Status */}
              <td className="px-4 py-3">
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    row.status === 'Active' ? 'bg-green-100 text-green-700' :
                    row.status === 'Inactive' ? 'bg-gray-100 text-gray-700' :
                    'bg-red-100 text-red-700'
                  }`}
                >
                  {row.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Profile Sheet */}
      <Sheet open={profileSheetOpen} onOpenChange={setProfileSheetOpen}>
        <SheetContent
          side="right"
          className="h-full max-h-[95vh] p-6 overflow-y-auto text-sm bg-white shadow-xl"
          style={{ width: '50vw', maxWidth: '50vw' }} 
        >
          {selectedResident && (
            <ResidentProfile
              resident={selectedResident}
              onBack={() => setProfileSheetOpen(false)}
              onEdit={() => setEditSheetOpen(true)}
            />
          )}
        </SheetContent>
      </Sheet>

      {/* Edit / New Resident Sheet */}
      <Sheet open={editSheetOpen} onOpenChange={setEditSheetOpen}>
        <SheetContent
          side="right"
          className="w-[50vw] max-w-none max-h-[95vh] p-6 overflow-y-auto text-sm"
          style={{ width: '30vw', maxWidth: '30vw' }} 
        >
          <ResidentForm
            resident={selectedResident}   // null if creating new
            onBack={() => setEditSheetOpen(false)}
            onSave={(resident) => {
              // handle saving logic here
              setEditSheetOpen(false)
            }}
          />
        </SheetContent>
      </Sheet>
    </div>
  )
}
