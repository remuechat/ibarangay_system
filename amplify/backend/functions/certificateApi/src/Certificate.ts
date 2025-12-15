export interface Certificate {
  certificateId: string;
  residentId: string;
  residentName: string;
  familyId: string;
  certificateType: string;
  purpose: string;
  dateRequested: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Completed';
  assignedOfficer: string;
  dateIssued?: string;
  notes?: string;
}