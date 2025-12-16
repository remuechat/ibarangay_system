"use client"

import { useState } from "react"
import { X, Calendar, User, Hash } from "lucide-react"
import { PropertyDisc } from "@/amplify/backend/functions/propertyApi/src/Property"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface BorrowModalProps {
  property: PropertyDisc | null
  open: boolean
  onClose: () => void
  onSubmit: (data: {
    borrowedBy: string
    quantity: number
    borrowDate: string
    returnDate: string
  }) => void
}

const borrowFormSchema = z.object({
  borrowedBy: z.string().min(1, "Borrower name is required").max(100, "Name must be less than 100 characters"),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
  borrowDate: z.string().min(1, "Borrow date is required"),
  returnDate: z.string().min(1, "Return date is required"),
}).refine((data) => {
  const borrowDate = new Date(data.borrowDate)
  const returnDate = new Date(data.returnDate)
  return returnDate >= borrowDate
}, {
  message: "Return date must be after borrow date",
  path: ["returnDate"],
})

type BorrowFormValues = z.infer<typeof borrowFormSchema>

export default function BorrowModal({
  property,
  open,
  onClose,
  onSubmit,
}: BorrowModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<BorrowFormValues>({
    resolver: zodResolver(borrowFormSchema),
    defaultValues: {
      borrowedBy: "",
      quantity: 1,
      borrowDate: new Date().toISOString().split("T")[0],
      returnDate: "",
    },
    mode: "onChange",
  })

  const handleSubmit = async (data: BorrowFormValues) => {
    setIsSubmitting(true)
    try {
      // Additional validation for available quantity
      if (property && data.quantity > property.availableQuantity) {
        form.setError("quantity", {
          message: `Only ${property.availableQuantity} available`
        })
        return
      }

      await onSubmit(data)
      form.reset()
      onClose()
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    form.reset()
    onClose()
  }

  // Update quantity validation when property changes
  const quantityValidation = z.coerce.number()
    .min(1, "Quantity must be at least 1")
    .max(property?.availableQuantity || 1, `Only ${property?.availableQuantity || 0} available`)

  if (!property) return null

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle>Borrow Property</DialogTitle>
              <DialogDescription className="mt-1">
                {property.name}
              </DialogDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        {/* Available Quantity Info */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total Quantity:</span>
              <span className="font-medium">{property.quantity}</span>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span className="text-muted-foreground">Available:</span>
              <Badge variant="secondary" className="font-semibold text-blue-600">
                {property.availableQuantity}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {/* Borrowed By */}
            <FormField
              control={form.control}
              name="borrowedBy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Borrowed By
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter borrower name" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Quantity */}
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Hash className="h-4 w-4" />
                    Quantity
                  </FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min={1}
                      max={property.availableQuantity}
                      {...field}
                      onChange={(e) => {
                        const value = parseInt(e.target.value) || 0
                        field.onChange(value)
                        
                        // Set error if quantity exceeds available
                        if (value > property.availableQuantity) {
                          form.setError("quantity", {
                            message: `Only ${property.availableQuantity} available`
                          })
                        } else {
                          form.clearErrors("quantity")
                        }
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    Maximum: {property.availableQuantity}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Borrow Date */}
            <FormField
              control={form.control}
              name="borrowDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Borrow Date
                  </FormLabel>
                  <FormControl>
                    <Input 
                      type="date" 
                      {...field}
                      onChange={(e) => {
                        field.onChange(e.target.value)
                        // Update min date for return date
                        if (form.getValues("returnDate") && e.target.value > form.getValues("returnDate")) {
                          form.setValue("returnDate", e.target.value)
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Return Date */}
            <FormField
              control={form.control}
              name="returnDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Expected Return Date
                  </FormLabel>
                  <FormControl>
                    <Input 
                      type="date" 
                      min={form.watch("borrowDate")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={isSubmitting || !form.formState.isValid || form.watch("quantity") > property.availableQuantity}
                className="flex-1"
              >
                {isSubmitting ? "Processing..." : "Confirm Borrow"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
