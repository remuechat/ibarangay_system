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

interface DynamicQueueProps {
  data: Record<string, any>[];
  caption?: string;
  onClickCell?: (key: string, value: any, row: Record<string, any>) => void;
}

export default function DynamicQueue({ data, caption, onClickCell }: DynamicQueueProps) {
  if (!data || data.length === 0) {
    return <div className="p-4 text-center">No queue items available</div>;
  }

  const columns = Object.keys(data[0]);

  return (
    <div className="border rounded-xl shadow-md p-2 bg-gray-50">
      <Table>
        {caption && <TableCaption>{caption}</TableCaption>}
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead key={col}>{col.replace(/([A-Z])/g, " $1")}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, idx) => (
            <TableRow key={idx} className="hover:bg-gray-100 transition-colors">
              {columns.map((col) => (
                <TableCell key={col}>
                  {onClickCell && col.toLowerCase() === "issue" ? (
                    <button
                      className="text-purple-600 underline hover:text-purple-800"
                      onClick={() => onClickCell(col, row[col], row)}
                    >
                      {row[col]}
                    </button>
                  ) : (
                    row[col]
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
