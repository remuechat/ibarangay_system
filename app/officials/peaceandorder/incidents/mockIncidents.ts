export interface Incident {
  incidentId: string; 
  dateReported: string;
  timeReported: string;
  type: string;
  location: string;
  purok: string;
  reportedBy: string;
  description: string;
  involvedParties: string[];
  status: string;
  assignedOfficer: string;
  dateResolved?: string;
  notes?: string;
}