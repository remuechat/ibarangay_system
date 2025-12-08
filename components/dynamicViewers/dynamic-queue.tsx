// DynamicQueue.tsx
interface DynamicQueueProps {
  data: any[];
  caption?: string;
  renderCard: (row: any) => React.ReactNode; // <- render function
}

export default function DynamicQueue({ data, caption, renderCard }: DynamicQueueProps) {
  if (!data || data.length === 0) {
    return <div className="p-4 text-center">No queue items available :O</div>;
  }

  return (
    <div className="space-y-4">
      {caption && <h2 className="text-lg font-bold mb-2">{caption}</h2>}
      {data.map((row) => (
        <div key={row.id}>
          {renderCard(row)}
        </div>
      ))}
    </div>
  );
}
