"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeftRight, Info } from "lucide-react"
import { Property } from "@/app/officials/service-delivery/projects/mockProperty"

interface PropertyCardProps {
  property: Property
  onBorrow?: () => void
  onView?: () => void
}

const conditionStyles: Record<Property["condition"], string> = {
  Good: "bg-green-100 text-green-700",
  Fair: "bg-yellow-100 text-yellow-700",
  "Needs Repair": "bg-red-100 text-red-700",
  Broken: "bg-gray-200 text-gray-700",
}

export default function PropertyCard({
  property,
  onBorrow,
  onView,
}: PropertyCardProps) {
  const isBorrowed = property.currentlyBorrowed

  return (
    <Card className="flex flex-col justify-between">
      <CardHeader className="space-y-2">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold leading-tight">{property.name}</h3>
            <p className="text-xs text-muted-foreground">{property.id}</p>
          </div>

          {isBorrowed && (
            <Badge className="bg-orange-100 text-orange-700">
              Borrowed
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-y-2 text-sm">
          <span className="text-muted-foreground">Category</span>
          <span>{property.category}</span>

          <span className="text-muted-foreground">Quantity</span>
          <span>{property.quantity}</span>

          <span className="text-muted-foreground">Condition</span>
          <Badge className={`w-fit ${conditionStyles[property.condition]}`}>
            {property.condition}
          </Badge>

          <span className="text-muted-foreground">Location</span>
          <span>{property.location}</span>
        </div>

        {isBorrowed && property.borrowedBy && (
          <div className="rounded-md bg-orange-50 p-3 text-sm">
            <p className="font-medium">Borrowed by</p>
            <p>{property.borrowedBy}</p>
            {property.returnDate && (
              <p className="text-xs text-muted-foreground">
                Return: {property.returnDate}
              </p>
            )}
          </div>
        )}

        <p className="text-sm text-muted-foreground">
          {property.description}
        </p>

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
        </div>
      </CardContent>
    </Card>
  )
}
