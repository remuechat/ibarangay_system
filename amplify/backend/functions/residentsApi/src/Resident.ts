export interface Resident {
  residentId: string;

  firstName: string;
  middleName?: string;       // optional
  lastName: string;

  birthDate?: string;        // optional
  sex?: "Male" | "Female";   // optional
  civilStatus?: string;      // optional
  residentType?: string;     // optional

  houseNumber: string;
  street: string;
  city: string;
  purok: string;
  province?: string;         // optional

  contactNumber?: string;
  email?: string;            // optional
  familyId?: string;

  vulnerableTypes?: string[];
  status: "Active" | "Inactive" | "Transferred Out" | "Deceased";

  qrCode?: string;           // optional
  dateRegistered?: string;
  dateUpdated?: string;
}
