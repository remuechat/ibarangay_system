'use client';

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface DynamicTableProps {
  data: Record<string, any>[];
  onRowClick?: (row: Record<string, any>) => void; // <-- Row click handler
}

export default function DynamicTable({ data, onRowClick }: DynamicTableProps) {
  if (!data || data.length === 0) {
    return <div className="p-4 text-center">No data available. You can start adding more!</div>;
  }

  const columns = Object.keys(data[0]);

  return (
    <div className="border rounded-xl shadow-md p-2 bg-gray-50">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead key={col}>{col.replace(/([A-Z])/g, " $1")}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, idx) => (
            <TableRow
              key={idx}
              className="hover:bg-gray-100 transition-colors cursor-pointer"
              onClick={() => onRowClick && onRowClick(row)}
            >
              {columns.map((col) => (
                <TableCell key={col}>
                  {row[col]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
