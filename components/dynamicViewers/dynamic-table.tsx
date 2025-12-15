'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface DynamicTableProps {
  data: Record<string, any>[];
  columnHeaders?: Record<string, string>; 
  onRowClick?: (row: Record<string, any>) => void; 
  visibleColumns?: string[];
}

export default function DynamicTable({ data, columnHeaders, onRowClick, visibleColumns }: DynamicTableProps) {
  if (!data || data.length === 0) {
    return <div className="p-4 text-center">No data available. You can start adding more!</div>;
  }

  const columns = visibleColumns || Object.keys(data[0]);

  return (
    <div className="border rounded-xl shadow-md p-2 bg-gray-50 overflow-x-auto" style={{ maxWidth: '79%' }}>
      <Table className="w-full min-w-max" style={{ tableLayout: 'auto' }}>
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead key={col} className="text-sm font-bold">
                {columnHeaders?.[col] || col.replace(/([A-Z])/g, " $1")}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((row, idx) => (
            <TableRow
              key={idx}
              className="hover:bg-gray-100 transition-colors cursor-pointer text-sm"
              onClick={() => onRowClick && onRowClick(row)}
            >
              {columns.map((col) => (
                <TableCell key={col}>
                  {/* Combine street and purok if this is the address column */}
                  {col === 'address' ? `${row.street}, ${row.purok}` : row[col]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
