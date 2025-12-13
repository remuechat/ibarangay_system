'use client';

import { useState, useMemo } from "react";
import { format } from "date-fns";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult
} from "@hello-pangea/dnd";

interface KanbanQueueProps {
  data: any[];
  onCardClick?: (card: any) => void;
  onCardUpdate?: (card: any) => void;
}

const columnColors: Record<string, string> = {
  Resolved: "bg-green-50",
  Investigating: "bg-yellow-50",
  Pending: "bg-orange-50",
  Closed: "bg-gray-100",
};

// Helper: Group by status
const groupByStatus = (data: any[]) => {
  const columns: Record<string, any[]> = {};
  data.forEach(item => {
    if (!columns[item.status]) columns[item.status] = [];
    columns[item.status].push(item);
  });

  // Sort each column by priority descending
  Object.keys(columns).forEach(status => {
    columns[status].sort((a, b) => b.priority - a.priority || a.id.localeCompare(b.id));
  });

  return columns;
};

export default function DynamicKanban({ data, onCardClick, onCardUpdate }: KanbanQueueProps) {
  const [columns, setColumns] = useState(groupByStatus(data));

  // Update when external data changes
  useMemo(() => {
    setColumns(groupByStatus(data));
  }, [data]);

  const onDragEnd = (result: DropResult) => {
    const { destination, source } = result;
    if (!destination) return;

    // No movement
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) return;

    const sourceCol = Array.from(columns[source.droppableId]);
    const destCol = Array.from(columns[destination.droppableId]);

    const movedCard = sourceCol[source.index];
    movedCard.status = destination.droppableId;

    sourceCol.splice(source.index, 1);
    destCol.splice(destination.index, 0, movedCard);

    setColumns(prev => ({
      ...prev,
      [source.droppableId]: sourceCol,
      [destination.droppableId]: destCol
    }));

    if (onCardUpdate) onCardUpdate(movedCard);
  };

  if (!data || data.length === 0) {
    return <div className="p-4 text-center">No kanban items available UwU</div>;
  }

  return (    
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-4 overflow-x-auto">
        {Object.keys(columns).map((status) => (
          <Droppable droppableId={status} key={status}>
                    {(provided) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className={`flex flex-col rounded-lg p-2 min-w-[250px] flex-shrink-0 ${columnColors[status]}`}
                      >
                        <h3 className="font-bold mb-2 capitalize">{status}</h3>

                        {columns[status].map((card, index) => (
                          <Draggable draggableId={card.id} index={index} key={card.id}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`bg-white rounded-lg p-4 mb-2 shadow cursor-pointer transition-transform ${
                                  snapshot.isDragging ? "scale-105 shadow-lg" : ""
                                }`}
                                onClick={() => onCardClick?.(card)}
                              >
                                <div className="flex justify-between items-center mb-2">
                                  <span className="font-semibold">{card.type}</span>
                                  <span className="text-sm font-medium text-gray-500">
                                    Priority {card.priority}
                                  </span>
                                </div>

                                <div className="text-sm text-gray-700 mb-1">ID: {card.id}</div>
                                <div className="text-sm text-gray-700 mb-1">Assigned: {card.assignedTo}</div>
                              </div>
                            )}
                          </Draggable>
                        ))}

                {provided.placeholder}
              </div>
            )}
          </Droppable>

        ))}
      </div>
    </DragDropContext>
  );
}
