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

export const mockIncidents: Incident[] = [
  {
    id: 'INC-001',
    dateReported: '2024-12-01',
    timeReported: '14:30',
    type: 'Noise Complaint',
    location: 'House #456, Rizal Avenue',
    purok: 'Purok 2',
    reportedBy: 'Maria Santos',
    description: 'Loud music and karaoke during afternoon hours disturbing neighbors',
    involvedParties: ['Carlos Ramos', 'Maria Santos (Complainant)'],
    status: 'Resolved',
    assignedOfficer: 'Tanod Roberto Cruz',
    dateResolved: '2024-12-01',
    notes: 'Parties agreed to keep noise levels down after 8 PM',
  },
  {
    id: 'INC-002',
    dateReported: '2024-12-02',
    timeReported: '22:15',
    type: 'Curfew Violation',
    location: 'Luna Street corner Mabini',
    purok: 'Purok 3',
    reportedBy: 'Tanod Juan Mercado',
    description: 'Minors found outside during curfew hours without guardian',
    involvedParties: ['3 minors (names withheld)'],
    status: 'Resolved',
    assignedOfficer: 'Tanod Juan Mercado',
    dateResolved: '2024-12-02',
    notes: 'Parents contacted and minors sent home',
  },
  {
    id: 'INC-003',
    dateReported: '2024-12-02',
    timeReported: '09:00',
    type: 'Theft',
    location: 'House #123, Mabini Street',
    purok: 'Purok 1',
    reportedBy: 'Juan Dela Cruz',
    description: 'Bicycle stolen from front yard during early morning hours',
    involvedParties: ['Juan Dela Cruz (Victim)', 'Unknown suspect'],
    status: 'Investigating',
    assignedOfficer: 'Tanod Roberto Cruz',
    notes: 'Checking CCTV footage from nearby establishments',
  },
  {
    id: 'INC-004',
    dateReported: '2024-11-30',
    timeReported: '16:45',
    type: 'Disturbance',
    location: 'Bonifacio Road',
    purok: 'Purok 4',
    reportedBy: 'Elena Bautista',
    description: 'Verbal altercation between neighbors over property boundary',
    involvedParties: ['Elena Bautista', 'Pedro Santos'],
    status: 'Pending',
    assignedOfficer: 'Barangay Captain',
    notes: 'Scheduled for mediation on December 5',
  },
  {
    id: 'INC-005',
    dateReported: '2024-11-28',
    timeReported: '20:30',
    type: 'Traffic Violation',
    location: 'Aguinaldo Avenue',
    purok: 'Purok 2',
    reportedBy: 'Tanod Jose Garcia',
    description: 'Motorcycle blocking public sidewalk and pedestrian path',
    involvedParties: ['Carlos Martinez'],
    status: 'Resolved',
    assignedOfficer: 'Tanod Jose Garcia',
    dateResolved: '2024-11-28',
    notes: 'Vehicle moved, owner warned about proper parking',
  },
  {
    id: 'INC-006',
    dateReported: '2024-11-27',
    timeReported: '11:20',
    type: 'Vandalism',
    location: 'Barangay Basketball Court',
    purok: 'Purok 1',
    reportedBy: 'SK Chairman',
    description: 'Graffiti on basketball court walls',
    involvedParties: ['Unknown'],
    status: 'Investigating',
    assignedOfficer: 'Tanod Juan Mercado',
    notes: 'Community members organizing cleanup; investigating suspects',
  },
  {
    id: 'INC-007',
    dateReported: '2024-11-25',
    timeReported: '08:00',
    type: 'Domestic Dispute',
    location: 'House #789, Luna Street',
    purok: 'Purok 3',
    reportedBy: 'Concerned Neighbor',
    description: 'Family dispute with raised voices heard by neighbors',
    involvedParties: ['Gonzales Family'],
    status: 'Closed',
    assignedOfficer: 'Barangay Captain',
    dateResolved: '2024-11-26',
    notes: 'Mediation conducted, family counseling recommended',
  },
];
