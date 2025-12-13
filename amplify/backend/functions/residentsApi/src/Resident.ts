export interface Resident {
  /** Identifiers */
  residentId: string;

  /** Personal Information */
  firstName: string;
  middleName?: string;
  lastName: string;
  birthDate: string;                 // ISO string (YYYY-MM-DD)
  gender: "Male" | "Female" | "Other";
  civilStatus: "Single" | "Married" | "Widowed" | "Separated";

  /** Contact Information */
  contactNumber: string;
  email?: string;
  emergencyContact?: string;

  /** Address Information */
  address: string;
  purok: string;
  householdId?: string;

  /** Residency Classification */
  residentType: "Local" | "Boarder" | "Old Resident";
  headOfFamily: boolean;
  voterStatus?: "Registered" | "Unregistered";

  /** Socio-Economic Info */
  occupation?: string;
  vulnerableTypes?: Array<
    "PWD" | "Senior Citizen" | "Solo Parent" | "Indigent"
  >;

  /** System / Status */
  status: "Active" | "Inactive";
  dateRegistered: string;             // ISO string
  dateUpdated: string;                // ISO string
  notes?: string;
}
