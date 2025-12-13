export interface ProcurementRecord {
  acquisitionId: string;
  dateAcquired: string;
  supplierName: string;
  cost: number;
  fundingSource: string; // e.g., Barangay Budget, Donations
  quantity: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
