// app/officials/mockOfficials.ts
export interface Official {
  officialId: string;
  fullName: string;
  position: "Barangay Captain" | "Barangay Secretary";
  termStartDate: string; // ISO string
  termEndDate: string;   // ISO string
  status: "Active" | "Inactive";
  signatureImage?: string; // URL or Base64 string of digital signature
  dateAdded: string;       // ISO string
  dateUpdated: string;     // ISO string
}

// MOCK DATA
export const mockOfficials: Official[] = [
  {
    officialId: "OFF-001",
    fullName: "Juan Dela Cruz",
    position: "Barangay Captain",
    termStartDate: "2025-01-01",
    termEndDate: "2025-12-31",
    status: "Active",
    signatureImage: "/signatures/captain-sign.png",
    dateAdded: "2025-01-01",
    dateUpdated: "2025-01-01"
  },
  {
    officialId: "OFF-002",
    fullName: "Maria Santos",
    position: "Barangay Secretary",
    termStartDate: "2025-01-01",
    termEndDate: "2025-12-31",
    status: "Active",
    signatureImage: "/signatures/secretary-sign.png",
    dateAdded: "2025-01-01",
    dateUpdated: "2025-01-01"
  },
  // Historical records (inactive)
  {
    officialId: "OFF-003",
    fullName: "Pedro Reyes",
    position: "Barangay Captain",
    termStartDate: "2024-01-01",
    termEndDate: "2024-12-31",
    status: "Inactive",
    signatureImage: "/signatures/captain-old.png",
    dateAdded: "2024-01-01",
    dateUpdated: "2024-12-31"
  },
]
