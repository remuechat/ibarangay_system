'use client'

import { useState } from 'react'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import DynamicTable from '@/components/dynamicViewers/dynamic-table'
import ResidentForm from '@/components/resident-form'
import { Resident, mockResidents } from "@/app/officials/residentinformation/mockResidents"

export default function ResidentsPage() {
  const [data, setData] = useState<Resident[]>(mockResidents)
  const [selectedResident, setSelectedResident] = useState<Partial<Resident> | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  // ONLY the columns you want in the table
  const tableColumns: Record<string, string> = {
    id: 'ID',
    fullName: 'Name',
    address: 'Address',
    contactNumber: 'Contact No.',
    vulnerableTypes: 'Vulnerable Type',
    status: 'Status',
  }

  // Table data mapped to include fullName and formatted vulnerableTypes
  const tableData = data.map((r) => ({
    ...r,
    fullName: `${r.firstName} ${r.lastName}`,
    vulnerableTypes: Array.isArray(r.vulnerableTypes)
      ? r.vulnerableTypes.join(', ')
      : '',
  }))

  const handleSave = (resident: Resident) => {
    setData((prev) => {
      const exists = prev.find((r) => r.id === resident.id)
      if (exists) return prev.map((r) => (r.id === resident.id ? resident : r))
      return [...prev, resident]
    })
    setDrawerOpen(false)
  }

  return (
    <div className="p-4">
      {/* TABLE WITH ONLY THE SELECTED COLUMNS */}
      <DynamicTable
        data={tableData}
        columnHeaders={tableColumns}
        onRowClick={(row) => {
          setSelectedResident(row)
          setDrawerOpen(true)
        }}
        visibleColumns={Object.keys(tableColumns)}
      />

      {/* SHEET (MADE LARGER + SMALLER FONT INSIDE) */}
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent className="max-w-4xl max-h-[95vh] p-6 overflow-y-auto text-sm">
          <ResidentForm
            resident={selectedResident}
            onBack={() => setDrawerOpen(false)}
            onSave={(res) => handleSave(res as Resident)}
          />
        </SheetContent>
      </Sheet>
    </div>
  )
}
