'use client'

import { useState, useMemo } from 'react'
import { Search, Plus } from 'lucide-react'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from "@/components/ui/input"
import { Certificate, mockCertificates as initialCertificates } from "@/app/officials/certificate/mockCertificates"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectTrigger, SelectValue, SelectItem } from "@/components/ui/select"
import CertificateForm from "@/components/certificate-form"
import CertificatePreview from "@/app/officials/certificate/preview/page"

export function CertificateSearchPopover({
  data,
  onSearch,
}: {
  data: Certificate[];
  onSearch: (filtered: Certificate[]) => void;
}) {
  const [query, setQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState<string | "all">("all")
  const [statusFilter, setStatusFilter] = useState<string | "all">("all")

  // Extract unique types and statuses
  const types = useMemo(() => Array.from(new Set(data.map(c => c.certificateType))).sort(), [data])
  const statuses = useMemo(() => Array.from(new Set(data.map(c => c.status))).sort(), [data])

  const runSearch = () => {
    const terms = query.toLowerCase().split(" ").filter(Boolean)
    const filtered = data.filter(c => {
      const textMatch = terms.every(term =>
        Object.values(c).some(val => String(val).toLowerCase().includes(term))
      )

      const typeMatch = typeFilter === "all" ? true : c.certificateType === typeFilter
      const statusMatch = statusFilter === "all" ? true : c.status === statusFilter

      return textMatch && typeMatch && statusMatch
    })

    onSearch(filtered)
  }

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

        {/* Certificate Type Filter */}
        <div>
          <p className="text-sm font-medium mb-1">Certificate Type:</p>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {types.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
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

        <Button className="w-full" onClick={runSearch}>Apply Search</Button>
      </PopoverContent>
    </Popover>
  )
}

export default function CertificateSystem() {
  const [certificates, setCertificates] = useState<Certificate[]>(initialCertificates)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null)

  const [profileSheetOpen, setProfileSheetOpen] = useState(false)
  const [editSheetOpen, setEditSheetOpen] = useState(false)

  // Filtered certificates for table based on search input
  const filteredCertificates = useMemo(() => {
    return certificates.filter(cert =>
      cert.residentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.purpose.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [certificates, searchTerm])

  // Open new certificate form
  const handleAddNew = () => {
    setSelectedCertificate(null)
    setEditSheetOpen(true)
  }

  // Open certificate preview
  const handlePreview = (certificate: Certificate) => {
    setSelectedCertificate(certificate)
    setProfileSheetOpen(true)
  }

  // Save or update certificate
  const handleSave = (certificate: Certificate) => {
    setCertificates(prev => {
      if (certificate.id) {
        // Update existing
        return prev.map(c => (c.id === certificate.id ? certificate : c))
      } else {
        // Add new
        const newCertificate = { ...certificate, id: `CERT-${prev.length + 1}` }
        return [...prev, newCertificate]
      }
    })
    setEditSheetOpen(false)
    setSelectedCertificate(null)
  }

  return (
    <div className="p-6 space-y-6">
      {/* HEADER / TOOLBAR */}
            <div className="flex items-center justify-between px-6 ">
              <h1 className="text-2xl font-bold">Certificate System</h1>
      
              <div className="flex gap-2">
                {/* Search / Filter Popover */}
                <CertificateSearchPopover
                  data={certificates}
                  onSearch={(results: Certificate[]) => setCertificates(results)}
                />
      
                {/* New Resident Button */}
                <Button
                  onClick={() => {
                    setSelectedCertificate(null);
                    setEditSheetOpen(true);
                  }}
                >
                  New
                </Button>
              </div>
            </div>

      {/* Certificates Table */}
      <div className="rounded-xl border border-gray-200 overflow-hidden shadow-md bg-white">
        <table className="w-full min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left font-medium text-black px-4 py-3">ID</th>
              <th className="text-left font-medium text-black px-4 py-3">Resident</th>
              <th className="text-left font-medium text-black px-4 py-3">Certificate Type</th>
              <th className="text-left font-medium text-black px-4 py-3">Purpose</th>
              <th className="text-left font-medium text-black px-4 py-3">Date Requested</th>
              <th className="text-left font-medium text-black px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredCertificates.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                  No certificate requests found
                </td>
              </tr>
            ) : (
              filteredCertificates.map(cert => (
                <tr
                  key={cert.id}
                  className="border-t hover:bg-gray-50 cursor-pointer"
                  onClick={() => handlePreview(cert)}
                >
                  <td className="px-4 py-3 text-gray-700">{cert.id}</td>
                  <td className="px-4 py-3 text-gray-700">
                    <div>{cert.residentName}</div>
                    <div className="text-gray-400 text-xs">{cert.residentId}</div>
                  </td>
                  <td className="px-4 py-3 text-gray-700">{cert.certificateType}</td>
                  <td className="px-4 py-3 text-gray-700">{cert.purpose}</td>
                  <td className="px-4 py-3 text-gray-700">{cert.dateRequested}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        cert.status === "Pending" ? "bg-orange-100 text-orange-700" :
                        cert.status === "Approved" ? "bg-yellow-100 text-yellow-700" :
                        cert.status === "Completed" ? "bg-green-100 text-green-700" :
                        "bg-red-100 text-red-700"
                      }`}
                    >
                      {cert.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Preview Sheet */}
        <Sheet open={profileSheetOpen} onOpenChange={setProfileSheetOpen}>
          <SheetContent side="right" className="h-full p-6 overflow-y-auto text-sm bg-white shadow-xl" style={{ width: '50vw', maxWidth: '50vw' }}>
            {selectedCertificate && (
              <CertificatePreview
                certificate={selectedCertificate}
                onBack={() => setProfileSheetOpen(false)}
              />
            )}
          </SheetContent>
        </Sheet>

        {/* Form Sheet */}
        <Sheet open={editSheetOpen} onOpenChange={setEditSheetOpen}>
          <SheetContent side="right" className="p-6 overflow-y-auto text-sm" style={{ width: '30vw', maxWidth: '30vw' }}>
            <CertificateForm
              certificate={selectedCertificate ?? null}
              onBack={() => setEditSheetOpen(false)}
              onSave={handleSave}
            />
          </SheetContent>
        </Sheet>
      </div>
    </div>
  )
}
