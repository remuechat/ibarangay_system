'use client';

import { format } from "date-fns";

interface QueueCardProps {
  card: {
    id: string;
    type: string;
    status: string;
    priority: number;
    assignedTo: string;
    lastServiced?: Date;
    nextServiceDue?: Date;
    scheduledDate?: Date;
    issue?: string;
  };
  onClick?: (card: any) => void;
}

export default function QueueCard({ card, onClick }: QueueCardProps) {
  return (
    <div
      className="bg-white rounded-lg p-4 mb-4 shadow hover:shadow-lg cursor-pointer transition-transform transform hover:scale-105"
      onClick={() => onClick && onClick(card)}
    >
      {/* Header: Type & Priority */}
      <div className="flex justify-between items-center mb-2">
        <span className="font-semibold text-gray-800">{card.type}</span>
        <span className="text-sm font-medium text-gray-500">Priority {card.priority}</span>
      </div>

      {/* Body: ID and Assigned To */}
      <div className="text-sm text-gray-700 mb-1">ID: {card.id}</div>
      <div className="text-sm text-gray-700 mb-1">Assigned: {card.assignedTo}</div>

      {/* Issue (if exists) */}
      {card.issue && (
        <div className="text-sm text-purple-600 underline mb-1">{card.issue}</div>
      )}

      {/* Dates */}
      {card.scheduledDate && (
        <div className="text-xs text-gray-500">
          Scheduled: {format(new Date(card.scheduledDate), "yyyy-MM-dd")}
        </div>
      )}
      {card.lastServiced && (
        <div className="text-xs text-gray-400">
          Last Serviced: {format(new Date(card.lastServiced), "yyyy-MM-dd")}
        </div>
      )}
      {card.nextServiceDue && (
        <div className="text-xs text-gray-400">
          Next Service Due: {format(new Date(card.nextServiceDue), "yyyy-MM-dd")}
        </div>
      )}
    </div>
  );
}
