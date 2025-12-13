import { useState } from "react"
import { ArrowLeft, Save } from "lucide-react"
import { Property } from "@/app/officials/service-delivery/projects/mockProperty"

interface PropertyFormProps {
  property: Partial<Property> | null
  onBack: () => void
  onSave: (property: Property) => void
}

export default function PropertyForm({
  property,
  onBack,
  onSave,
}: PropertyFormProps) {
  const [formData, setFormData] = useState<Partial<Property>>({
    name: property?.name ?? "",
    category: property?.category ?? "Furniture",
    description: property?.description ?? "",
    quantity: property?.quantity ?? 1,
    condition: property?.condition ?? "Good",
    location: property?.location ?? "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const now = new Date().toISOString().slice(0, 10)

    const saved: Property = {
      id: property?.id ?? `PROP-${Date.now()}`,
      name: formData.name!,
      category: formData.category!,
      description: formData.description!,
      quantity: formData.quantity!,
      condition: formData.condition!,
      location: formData.location!,
      dateAdded: property?.dateAdded ?? now,
      dateUpdated: now,
      currentlyBorrowed: property?.currentlyBorrowed ?? false,
      borrowedBy: property?.borrowedBy,
      borrowDate: property?.borrowDate,
      returnDate: property?.returnDate,
    }

    onSave(saved)
    onBack()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div>
          <h2 className="text-2xl font-semibold">
            {property ? "Edit Property" : "Add New Property"}
          </h2>
          <p className="text-gray-600">
            Fill in the property information below
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* inputs unchanged except condition values */}
        <select
          value={formData.condition}
          onChange={(e) =>
            setFormData({
              ...formData,
              condition: e.target.value as Property["condition"],
            })
          }
        >
          <option value="Good">Good</option>
          <option value="Fair">Fair</option>
          <option value="Needs Repair">Needs Repair</option>
          <option value="Broken">Broken</option>
        </select>

        <button type="submit" className="flex items-center gap-2">
          <Save className="w-5 h-5" />
          Save
        </button>
      </form>
    </div>
  )
}
