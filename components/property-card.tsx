"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeftRight, Info, RotateCw } from "lucide-react"
import { PropertyDisc } from "@/amplify/backend/functions/propertyApi/src/Property"

interface PropertyCardProps {
  property: PropertyDisc
  onBorrow?: () => void
  onView?: () => void
  onEdit?: () => void
  onReturn?: (borrowId: string) => void
}

const conditionStyles: Record<PropertyDisc["condition"], string> = {
  Good: "bg-green-100 text-green-700",
  Fair: "bg-yellow-100 text-yellow-700",
  "Needs Repair": "bg-red-100 text-red-700",
  Broken: "bg-gray-200 text-gray-700",
}

export default function PropertyCard({
  property,
  onBorrow,
  onView,
  onEdit,
  onReturn,
}: PropertyCardProps) {
  // Borrow button disabled only if no available units
  const isBorrowed = property.availableQuantity <= 0

  // Active borrow records
  const activeBorrows = property.borrowRecords.filter(r => r.status === "borrowed")

  return (
    <Card className="flex flex-col justify-between">
      <CardHeader className="space-y-2">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold leading-tight">{property.name}</h3>
            <p className="text-xs text-muted-foreground">{property.propertyId}</p>
          </div>

          {activeBorrows.length > 0 && (
            <Badge className="bg-orange-100 text-orange-700">Borrowed</Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-y-2 text-sm">
          <span className="text-muted-foreground">Category</span>
          <span>{property.category}</span>

          <span className="text-muted-foreground">Quantity</span>
          <span>{property.availableQuantity}/{property.quantity}</span>

          <span className="text-muted-foreground">Condition</span>
          <Badge className={`w-fit ${conditionStyles[property.condition]}`}>
            {property.condition}
          </Badge>

          <span className="text-muted-foreground">Location</span>
          <span>{property.location}</span>
        </div>

        {/* List active borrow records */}
        {activeBorrows.length > 0 && (
          <div className="space-y-2">
            {activeBorrows.map(record => (
              <div
                key={record.borrowId}
                className="flex justify-between items-center rounded-md bg-orange-50 p-3 text-sm"
              >
                <div>
                  <p className="font-medium">{record.borrowedBy}</p>
                  <p className="text-xs text-muted-foreground">
                    Qty: {record.quantity} | Return: {new Date(record.returnDate).toLocaleDateString()}
                  </p>
                </div>

                {onReturn && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onReturn(record.borrowId)}
                  >
                    <RotateCw className="mr-2 w-4 h-4" />
                    Return
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}

        <p className="text-sm text-muted-foreground">{property.description}</p>

        <div className="flex gap-2 pt-2">
          <Button
            className="flex-1"
            disabled={isBorrowed}
            onClick={onBorrow}
          >
            <ArrowLeftRight className="mr-2 h-4 w-4" />
            {isBorrowed ? "Unavailable" : "Borrow"}
          </Button>

          <Button variant="outline" onClick={onView}>
            <Info className="mr-2 h-4 w-4" />
            Details
          </Button>

          {onEdit && (
            <Button variant="secondary" onClick={onEdit}>
              Edit
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
