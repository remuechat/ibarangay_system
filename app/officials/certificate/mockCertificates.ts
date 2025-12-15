export interface Certificate {
  id: string;
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

export const mockCertificates: Certificate[] = [
  {
    id: 'CERT-001',
    residentId: 'RES-001',
    residentName: 'Juan Dela Cruz',
    familyId: 'FAM-001',
    certificateType: 'Barangay Clearance',
    purpose: 'Employment requirement',
    dateRequested: '2024-12-01',
    status: 'Completed',
    assignedOfficer: 'Secretary Ana Reyes',
    dateIssued: '2024-12-02',
    notes: 'Certificate issued and picked up',
  },
  {
    id: 'CERT-002',
    residentId: 'RES-004',
    residentName: 'Ana Gonzales',
    familyId: 'FAM-003',
    certificateType: 'Certificate of Indigency',
    purpose: 'Medical assistance',
    dateRequested: '2024-12-02',
    status: 'Approved',
    assignedOfficer: 'Secretary Ana Reyes',
    notes: 'Pending pickup',
  },
  {
    id: 'CERT-003',
    residentId: 'RES-003',
    residentName: 'Pedro Santos',
    familyId: 'FAM-002',
    certificateType: 'Certificate of Residency',
    purpose: 'Senior citizen ID application',
    dateRequested: '2024-12-01',
    status: 'Completed',
    assignedOfficer: 'Secretary Ana Reyes',
    dateIssued: '2024-12-01',
    notes: 'Certificate issued',
  },
  {
    id: 'CERT-004',
    residentId: 'RES-007',
    residentName: 'Jose Martinez',
    familyId: 'FAM-006',
    certificateType: 'Business Clearance',
    purpose: 'Sari-sari store permit',
    dateRequested: '2024-12-03',
    status: 'Pending',
    assignedOfficer: 'Secretary Ana Reyes',
    notes: 'Awaiting inspection',
  },
  {
    id: 'CERT-005',
    residentId: 'RES-002',
    residentName: 'Maria Dela Cruz',
    familyId: 'FAM-001',
    certificateType: 'Barangay Clearance',
    purpose: 'Loan application',
    dateRequested: '2024-11-30',
    status: 'Completed',
    assignedOfficer: 'Secretary Ana Reyes',
    dateIssued: '2024-12-01',
  },
  {
    id: 'CERT-006',
    residentId: 'RES-008',
    residentName: 'Elena Bautista',
    familyId: 'FAM-007',
    certificateType: 'Certificate of Indigency',
    purpose: 'PWD assistance',
    dateRequested: '2024-11-29',
    status: 'Approved',
    assignedOfficer: 'Secretary Ana Reyes',
    notes: 'For pickup',
  },
  {
    id: 'CERT-007',
    residentId: 'RES-005',
    residentName: 'Carlos Ramos',
    familyId: 'FAM-004',
    certificateType: 'Barangay Clearance',
    purpose: 'Police clearance requirement',
    dateRequested: '2024-12-02',
    status: 'Pending',
    assignedOfficer: 'Secretary Ana Reyes',
  },
];
