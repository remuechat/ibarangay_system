"use client"

import { useState, useMemo } from "react"
import { ArrowLeft, Save, Trash2, Search } from "lucide-react"
import { PropertyDisc } from "@/amplify/backend/functions/propertyApi/src/Property"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Check, ChevronDown } from "lucide-react"

export interface PropertyFormProps {
  property: Partial<PropertyDisc> | null
  onSave: (property: PropertyDisc) => void
  onBack?: () => void
  onDelete?: (id: string) => void
}

const CATEGORIES = [
  "Furniture",
  "Electronics",
  "Audio Equipment",
  "Event Equipment",
  "Sports Equipment",
  "Medical Equipment",
  "Power Equipment",
]

const conditionOptions = [
  { label: "Good", value: "Good" },
  { label: "Fair", value: "Fair" },
  { label: "Needs Repair", value: "Needs Repair" },
  { label: "Broken", value: "Broken" },
]

const propertyFormSchema = z.object({
  name: z.string().min(1, "Property name is required").max(100, "Name must be less than 100 characters"),
  category: z.string().min(1, "Category is required"),
  description: z.string().max(500, "Description must be less than 500 characters").optional(),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1").max(999, "Quantity must be less than 1000"),
  availableQuantity: z.coerce.number().min(0, "Available quantity cannot be negative"),
  condition: z.string().min(1, "Condition is required"),
  location: z.string().min(1, "Location is required").max(200, "Location must be less than 200 characters"),
}).refine((data) => data.availableQuantity <= data.quantity, {
  message: "Available quantity cannot exceed total quantity",
  path: ["availableQuantity"],
})

type PropertyFormValues = z.infer<typeof propertyFormSchema>

export default function PropertyForm({
  property,
  onSave,
  onBack,
  onDelete,
}: PropertyFormProps) {
  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues: {
      name: property?.name || "",
      category: property?.category || "",
      description: property?.description || "",
      quantity: property?.quantity || 1,
      availableQuantity: property?.availableQuantity || property?.quantity || 1,
      condition: property?.condition || "Good",
      location: property?.location || "",
    },
    mode: "onChange",
  })

  const [openCategory, setOpenCategory] = useState(false)
  const [categorySearch, setCategorySearch] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Filter categories based on search
  const filteredCategories = useMemo(() => {
    if (!categorySearch) return CATEGORIES
    return CATEGORIES.filter((cat) =>
      cat.toLowerCase().includes(categorySearch.toLowerCase())
    )
  }, [categorySearch])

  const onSubmit = async (data: PropertyFormValues) => {
    setIsSubmitting(true)
    try {
      const saved: PropertyDisc = {
        propertyId: property?.propertyId || "",
        name: data.name,
        category: data.category,
        description: data.description || "",
        quantity: data.quantity,
        availableQuantity: data.availableQuantity,
        condition: data.condition as PropertyDisc["condition"],
        location: data.location,
        dateAdded: property?.dateAdded || new Date().toISOString(),
        dateUpdated: new Date().toISOString(),
        borrowRecords: property?.borrowRecords || [],
      }

      await onSave(saved)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = () => {
    if (property?.propertyId && onDelete) {
      if (confirm("Are you sure you want to delete this property?")) {
        onDelete(property.propertyId)
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={onBack}
          className="h-9 w-9"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>

        <div className="flex-1">
          <h2 className="text-2xl font-semibold">
            {property?.propertyId ? "Edit Property" : "Add New Property"}
          </h2>
          <p className="text-muted-foreground">
            Fill in the property information below
          </p>
        </div>

        {property?.propertyId && onDelete && (
          <Button
            variant="outline"
            size="icon"
            onClick={handleDelete}
            className="h-9 w-9 text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* BASIC INFORMATION */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Property Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter property name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Category</FormLabel>
                      <Popover open={openCategory} onOpenChange={setOpenCategory}>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                "w-full justify-between",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value
                                ? CATEGORIES.find((category) => category === field.value)
                                : "Select category..."}
                              <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                          <Command>
                            <CommandInput 
                              placeholder="Search category..." 
                              value={categorySearch}
                              onValueChange={setCategorySearch}
                            />
                            <CommandEmpty>No category found.</CommandEmpty>
                            <CommandGroup className="max-h-60 overflow-y-auto">
                              {filteredCategories.map((category) => (
                                <CommandItem
                                  key={category}
                                  value={category}
                                  onSelect={() => {
                                    form.setValue("category", category)
                                    setCategorySearch("")
                                    setOpenCategory(false)
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      category === field.value ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                  {category}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min={1}
                          {...field}
                          onChange={(e) => {
                            const value = parseInt(e.target.value)
                            field.onChange(value)
                            // Auto-update available quantity when total quantity changes
                            if (value >= form.getValues("availableQuantity")) {
                              form.setValue("availableQuantity", value)
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="condition"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Condition</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select condition" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {conditionOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="availableQuantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Available Quantity</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min={0}
                        max={form.watch("quantity")}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Cannot exceed total quantity ({form.watch("quantity")})
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* LOCATION & DESCRIPTION */}
          <Card>
            <CardHeader>
              <CardTitle>Location & Description</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Storage Room A" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter property description"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      {field.value?.length || 0}/500 characters
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* BORROW STATUS */}
          {property?.borrowRecords && property.borrowRecords.length > 0 && (
            <Card className="border-orange-200 bg-orange-50">
              <CardHeader>
                <CardTitle className="text-orange-800">Active Borrows</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {property.borrowRecords
                    .filter((record) => record.status === "borrowed")
                    .map((record) => (
                      <div
                        key={record.borrowId}
                        className="space-y-2 border-b pb-2 last:border-0"
                      >
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Borrowed by:</span>
                          <span className="font-medium">{record.borrowedBy}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Quantity:</span>
                          <Badge variant="outline">{record.quantity}</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Borrow Date:</span>
                          <span>{new Date(record.borrowDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Expected Return:</span>
                          <span>{new Date(record.returnDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* ACTION BUTTONS */}
          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={isSubmitting || !form.formState.isValid}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {isSubmitting 
                ? "Saving..." 
                : property?.propertyId 
                  ? "Update Property" 
                  : "Add Property"
              }
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={onBack}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
