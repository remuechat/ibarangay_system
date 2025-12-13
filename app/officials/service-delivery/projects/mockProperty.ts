// mockProperty.ts
export interface Property {
  id: string;
  name: string;
  category: string;
  description: string;
  quantity: number;
  condition: 'Good' | 'Fair' | 'Needs Repair' | 'Broken';
  location: string;
  dateAdded: string;
  dateUpdated: string;
  currentlyBorrowed?: boolean;
  borrowedBy?: string;
  borrowDate?: string;
  returnDate?: string;
}

export const mockProperties: Property[] = [
  {
    id: 'PROP-001',
    name: 'Sound System (Complete Set)',
    category: 'Audio Equipment',
    description: 'Professional sound system with speakers, mixer, and microphones',
    quantity: 1,
    condition: 'Good',
    location: 'Barangay Hall - Storage Room A',
    dateAdded: '2024-01-10',
    dateUpdated: '2024-11-28',
    currentlyBorrowed: true,
    borrowedBy: 'SK Council',
    borrowDate: '2024-12-02',
    returnDate: '2024-12-05',
  },
  {
    id: 'PROP-002',
    name: 'Plastic Chairs',
    category: 'Furniture',
    description: 'White plastic monobloc chairs for events',
    quantity: 100,
    condition: 'Good',
    location: 'Barangay Hall - Storage Room B',
    dateAdded: '2024-01-15',
    dateUpdated: '2024-12-01',
    currentlyBorrowed: false,
  },
  {
    id: 'PROP-003',
    name: 'Folding Tables',
    category: 'Furniture',
    description: '6-seater folding tables for community events',
    quantity: 20,
    condition: 'Good',
    location: 'Barangay Hall - Storage Room B',
    dateAdded: '2024-01-15',
    dateUpdated: '2024-11-25',
    currentlyBorrowed: false,
  },
  {
    id: 'PROP-004',
    name: 'Laptop (Dell)',
    category: 'Electronics',
    description: 'Dell Latitude laptop for barangay administrative work',
    quantity: 2,
    condition: 'Fair',
    location: 'Barangay Hall - Office',
    dateAdded: '2024-02-01',
    dateUpdated: '2024-11-20',
    currentlyBorrowed: false,
  },
  {
    id: 'PROP-005',
    name: 'Projector',
    category: 'Electronics',
    description: 'LCD projector for meetings and presentations',
    quantity: 1,
    condition: 'Good',
    location: 'Barangay Hall - Conference Room',
    dateAdded: '2024-02-10',
    dateUpdated: '2024-11-30',
    currentlyBorrowed: false,
  },
  {
    id: 'PROP-006',
    name: 'Tents (5x5 meters)',
    category: 'Event Equipment',
    description: 'Large tents for outdoor events',
    quantity: 4,
    condition: 'Good',
    location: 'Barangay Hall - Storage Yard',
    dateAdded: '2024-03-05',
    dateUpdated: '2024-12-01',
    currentlyBorrowed: true,
    borrowedBy: 'Health Committee',
    borrowDate: '2024-12-01',
    returnDate: '2024-12-04',
  },
  {
    id: 'PROP-007',
    name: 'Basketball',
    category: 'Sports Equipment',
    description: 'Official size basketballs for sports programs',
    quantity: 10,
    condition: 'Good',
    location: 'Barangay Hall - Sports Equipment Room',
    dateAdded: '2024-03-15',
    dateUpdated: '2024-11-15',
    currentlyBorrowed: false,
  },
  {
    id: 'PROP-008',
    name: 'First Aid Kit',
    category: 'Medical Equipment',
    description: 'Complete first aid kit for emergencies',
    quantity: 3,
    condition: 'Good',
    location: 'Barangay Hall - Health Office',
    dateAdded: '2024-04-01',
    dateUpdated: '2024-12-02',
    currentlyBorrowed: false,
  },
  {
    id: 'PROP-009',
    name: 'Generator (5kW)',
    category: 'Power Equipment',
    description: 'Portable generator for power outages',
    quantity: 1,
    condition: 'Needs Repair',
    location: 'Barangay Hall - Storage Yard',
    dateAdded: '2024-05-10',
    dateUpdated: '2024-11-18',
    currentlyBorrowed: false,
  },
  {
    id: 'PROP-010',
    name: 'Cleaning Equipment Set',
    category: 'Maintenance',
    description: 'Brooms, mops, and cleaning supplies',
    quantity: 5,
    condition: 'Fair',
    location: 'Barangay Hall - Janitorial Room',
    dateAdded: '2024-06-01',
    dateUpdated: '2024-11-28',
    currentlyBorrowed: false,
  },
];
