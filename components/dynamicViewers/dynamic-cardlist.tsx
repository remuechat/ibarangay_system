"use client"

import { JSX } from "react"
import React, { type ReactNode } from "react"

type UniversalRecord = Record<string, any>

type DynamicCardListProps<T extends Record<string, any>> = {
  data: T[]
  onCardClick?: (item: T) => void
  titleField?: string
  statusField?: string
  labelMap?: Record<string, string>
  hiddenFields?: string[]
  renderField?: (value: any, key: string, item: T) => JSX.Element | string | null
}
export default function DynamicCardList<T extends UniversalRecord>({
  data,
  onCardClick,
  titleField,
  statusField,
  labelMap = {},
  hiddenFields = [],
  renderField,
}: DynamicCardListProps<T>) {
  return (
    <div className="space-y-4">
      {data.map((item, index) => (
        <div
          key={item.id || index}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => onCardClick?.(item)}
        >
          {/* Header: Title + Status */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h4 className="font-semibold text-lg">{titleField ? item[titleField] : `Record ${index + 1}`}</h4>
                {statusField && item[statusField] && (
                  <span className={`px-2 py-1 rounded text-xs ${
                    item[statusField] === 'Pending' ? 'bg-orange-100 text-orange-700' :
                    item[statusField] === 'Investigating' ? 'bg-yellow-100 text-yellow-700' :
                    item[statusField] === 'Resolved' ? 'bg-green-100 text-green-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {item[statusField]}
                  </span>
                )}
              </div>
              {item.dateReported && (
                <p className="text-sm text-gray-600">
                  {item.id} • {item.dateReported} {item.timeReported ? `at ${item.timeReported}` : ""}
                </p>
              )}
            </div>
          </div>

          {/* Description */}
          {item.description && <p className="text-sm mb-4">{item.description}</p>}

          {/* Grid info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          {/* Location */}
            {!hiddenFields.includes("location") && item.location && (
              <div>
                <p className="text-gray-600">Location</p>
                <p>{item.location}</p>
              </div>
            )}

            {/* Purok / Zone */}
            {!hiddenFields.includes("purok") && item.purok && (
              <div>
                <p className="text-gray-600">Purok / Zone</p>
                <p>{item.purok}</p>
              </div>
            )}

          {/* Reported By */}
            {!hiddenFields.includes("reportedBy") && item.reportedBy && (
              <div>
                <p className="text-gray-600">Reported By</p>
                <p>{item.reportedBy}</p>
              </div>
            )}

            {/* Assigned Officer */}
            {!hiddenFields.includes("assignedOfficer") && item.assignedOfficer && (
              <div>
                <p className="text-gray-600">Assigned Officer</p>
                <p>{item.assignedOfficer}</p>
              </div>
            )}
          </div>

          {/* Notes */}
          {item.notes && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Notes: {item.notes}</p>
            </div>
          )}
        </div>
      ))}

      {/* Empty state */}
      {data.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-600">No incidents found</p>
        </div>
      )}
    </div>
  )
}
