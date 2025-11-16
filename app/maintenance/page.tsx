import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { Input } from "@/components/ui/input";

export default function MaintenancePage() {
    const location = "Piapi Boulevard";
    return (
        <div>
            <Input></Input>
            <h1 className="scroll-m-20 text-center text-3xl font-bold tracking-tight text-balance">
                {location} Maintenance Logs
            </h1>
            <Table>
                <TableCaption>Property Maintenance Logs In {location}</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Property ID</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Last Serviced</TableHead>                        
                        <TableHead>Next Service Due</TableHead>
                        <TableHead>Assigned</TableHead>
                        <TableHead>History</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {assets.map((assets)=> (
                        <TableRow key={assets.propertyId}>
                            <TableCell>{assets.propertyId}</TableCell>
                            <TableCell>{assets.type}</TableCell>
                            <TableCell>{assets.status}</TableCell>
                            <TableCell>{assets.lastServiced}</TableCell>
                            <TableCell>{assets.nextServiceDue}</TableCell>
                            <TableCell>{assets.assigned}</TableCell>
                            <TableCell>{assets.history}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};


const assets = [
  {
    propertyId: "PR-0012",
    type: "Air Conditioning Unit",
    status: "Operational",
    lastServiced: "2025-01-12",
    nextServiceDue: "2025-04-12",
    assigned: "John Santos",
    history: "View"
  },
  {
    propertyId: "PR-0047",
    type: "Generator",
    status: "Under Maintenance",
    lastServiced: "2025-02-05",
    nextServiceDue: "2025-05-05",
    assigned: "Maria Dela Cruz",
    history: "View"
  },
  {
    propertyId: "PR-0153",
    type: "Water Pump",
    status: "Operational",
    lastServiced: "2025-01-28",
    nextServiceDue: "2025-04-28",
    assigned: "Carlo Reyes",
    history: "View"
  },
  {
    propertyId: "PR-0098",
    type: "Fire Extinguisher",
    status: "For Replacement",
    lastServiced: "2024-12-10",
    nextServiceDue: "2025-06-10",
    assigned: "N/A",
    history: "View"
  },
  {
    propertyId: "PR-0221",
    type: "CCTV Camera",
    status: "Operational",
    lastServiced: "2025-02-10",
    nextServiceDue: "2025-08-10",
    assigned: "Security Team",
    history: "View"
  }
];
