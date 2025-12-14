// Maintenance.ts
export interface MaintenanceEntry {
  maintenanceId: string;
  type: string;
  status: string;
  priority: number;
  assignedTo: string;
  lastServiced?: string;
  nextServiceDue?: string;
  scheduledDate?: string;
  issue?: string;
  dateCreated?: string;
  dateUpdated?: string;
}
