"use client"

import { useState } from "react"
import { X, Calendar, User, Hash } from "lucide-react"
import { PropertyDisc } from "@/amplify/backend/functions/propertyApi/src/Property"

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

export default function BorrowModal({
  property,
  open,
  onClose,
  onSubmit,
}: BorrowModalProps) {
  const [formData, setFormData] = useState({
    borrowedBy: "",
    quantity: 1,
    borrowDate: new Date().toISOString().split("T")[0],
    returnDate: "",
  })

  if (!open || !property) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    // Reset form
    setFormData({
      borrowedBy: "",
      quantity: 1,
      borrowDate: new Date().toISOString().split("T")[0],
      returnDate: "",
    })
    onClose()
  }

  const handleClose = () => {
    setFormData({
      borrowedBy: "",
      quantity: 1,
      borrowDate: new Date().toISOString().split("T")[0],
      returnDate: "",
    })
    onClose()
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 animate-in fade-in duration-200"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-lg shadow-xl max-w-md w-full animate-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div>
              <h2 className="text-xl font-semibold">Borrow Property</h2>
              <p className="text-sm text-gray-600 mt-1">{property.name}</p>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Available Quantity Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total Quantity:</span>
                <span className="font-medium">{property.quantity}</span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span className="text-gray-600">Available:</span>
                <span className="font-semibold text-blue-600">
                  {property.availableQuantity}
                </span>
              </div>
            </div>

            {/* Borrowed By */}
            <div>
              <label className="block text-sm font-medium mb-2">
                <User className="w-4 h-4 inline mr-1" />
                Borrowed By *
              </label>
              <input
                type="text"
                required
                value={formData.borrowedBy}
                onChange={(e) =>
                  setFormData({ ...formData, borrowedBy: e.target.value })
                }
                placeholder="Enter name"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium mb-2">
                <Hash className="w-4 h-4 inline mr-1" />
                Quantity *
              </label>
              <input
                type="number"
                required
                min={1}
                max={property.availableQuantity}
                value={formData.quantity}
                onChange={(e) =>
                  setFormData({ ...formData, quantity: Number(e.target.value) })
                }
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {formData.quantity > property.availableQuantity && (
                <p className="text-red-600 text-sm mt-1">
                  Only {property.availableQuantity} available
                </p>
              )}
            </div>

            {/* Borrow Date */}
            <div>
              <label className="block text-sm font-medium mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Borrow Date *
              </label>
              <input
                type="date"
                required
                value={formData.borrowDate}
                onChange={(e) =>
                  setFormData({ ...formData, borrowDate: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Return Date */}
            <div>
              <label className="block text-sm font-medium mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Expected Return Date *
              </label>
              <input
                type="date"
                required
                min={formData.borrowDate}
                value={formData.returnDate}
                onChange={(e) =>
                  setFormData({ ...formData, returnDate: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={formData.quantity > property.availableQuantity}
                className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
              >
                Confirm Borrow
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="px-6 py-3 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}