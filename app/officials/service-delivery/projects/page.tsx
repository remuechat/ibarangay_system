"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectTrigger, SelectValue, SelectItem } from "@/components/ui/select"

import PropertyCard from "@/components/property-card"
import PropertyForm from "@/components/property-form"

import {
  Property,
  mockProperties,
} from "@/app/officials/service-delivery/projects/mockProperty"

const categories = [
  "Audio Equipment",
  "Furniture",
  "Electronics",
  "Event Equipment",
  "Sports Equipment",
  "Medical Equipment",
  "Power Equipment",
]

const conditions = ["Good", "Fair", "Needs Repair", "Broken"]

/* =====================================================
   SEARCH POPOVER
   ===================================================== */

export function PropertySearchPopover({
  data,
  onSearch,
}: {
  data: Property[]
  onSearch: (filtered: Property[]) => void
}) {
  const [query, setQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string | "all">("all")
  const [conditionFilter, setConditionFilter] = useState<string | "all">("all")

  const runSearch = () => {
    const terms = query.toLowerCase().split(" ").filter(Boolean)

    const filtered = data.filter((p) => {
      // keyword search across all fields
      const textMatch = terms.every((term) =>
        Object.values(p).some((val) =>
          String(val).toLowerCase().includes(term)
        )
      )

      const categoryMatch = categoryFilter === "all" ? true : p.category === categoryFilter
      const conditionMatch = conditionFilter === "all" ? true : p.condition === conditionFilter

      return textMatch && categoryMatch && conditionMatch
    })

    onSearch(filtered)
  }

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

        {/* Category filter */}
        <div>
          <p className="text-sm font-medium mb-1">All Categories:</p>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Condition filter */}
        <div>
          <p className="text-sm font-medium mb-1">All Conditions:</p>
          <Select value={conditionFilter} onValueChange={setConditionFilter}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select condition" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Conditions</SelectItem>
              {conditions.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button className="w-full" onClick={runSearch}>
          Apply Search
        </Button>
      </PopoverContent>
    </Popover>
  )
}

/* =====================================================
   ENTRY DRAWER (SHEET)
   ===================================================== */

function EntryDrawer({
  open,
  onOpenChange,
  property,
  onSave,
}: {
  open: boolean
  onOpenChange: (val: boolean) => void
  property: Partial<Property> | null
  onSave: (property: Property) => void
}) {
  if (!open) return null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="max-w-md max-h-[90vh] p-6 overflow-y-auto">
        <PropertyForm
          property={property}
          onBack={() => onOpenChange(false)}
          onSave={onSave}
        />
      </SheetContent>
    </Sheet>
  )
}

/* =====================================================
   MAIN PAGE
   ===================================================== */

export default function PropertyPage() {
  const router = useRouter()

  const [properties, setProperties] =
    useState<Property[]>(mockProperties)

  const [filteredProperties, setFilteredProperties] =
    useState<Property[]>(mockProperties)

  const [drawerOpen, setDrawerOpen] = useState(false)
  const [selectedProperty, setSelectedProperty] =
    useState<Partial<Property> | null>(null)

  /* keep filtered list synced */
  useEffect(() => {
    setFilteredProperties(properties)
  }, [properties])

  /* ============================
     ACTIONS
     ============================ */

  const handleBorrow = (id: string) => {
    const borrower = prompt("Who is borrowing this property?")
    const returnDate = prompt("Return date (YYYY-MM-DD)?")

    if (!borrower || !returnDate) return

    setProperties((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              currentlyBorrowed: true,
              borrowedBy: borrower,
              borrowDate: new Date().toISOString().slice(0, 10),
              returnDate,
              dateUpdated: new Date().toISOString().slice(0, 10),
            }
          : p
      )
    )
  }

  const handleView = (id: string) => {
    router.push(`/officials/service-delivery/projects/${id}`)
  }

  const handleSave = (saved: Property) => {
    setProperties((prev) =>
      prev.some((p) => p.id === saved.id)
        ? prev.map((p) => (p.id === saved.id ? saved : p))
        : [...prev, saved]
    )
  }

  /* ============================
     RENDER
     ============================ */

  return (
    <div className="space-y-6">
      {/* HEADER / TOOLBAR */}
      <div className="flex items-center justify-between px-6">
        <h1 className="text-2xl font-bold">
          Property & Inventory Management
        </h1>

        <div className="flex gap-2">
          <PropertySearchPopover
            data={properties}
            onSearch={setFilteredProperties}
          />

          <Button
            onClick={() => {
              setSelectedProperty(null)
              setDrawerOpen(true)
            }}
          >
            New
          </Button>
        </div>
      </div>

      {/* CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 px-6">
        {filteredProperties.map((property) => (
          <PropertyCard
            key={property.id}
            property={property}
            onBorrow={() => handleBorrow(property.id)}
            onView={() => handleView(property.id)}
          />
        ))}
      </div>

      {/* DRAWER */}
      <EntryDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        property={selectedProperty}
        onSave={handleSave}
      />
    </div>
  )
}
