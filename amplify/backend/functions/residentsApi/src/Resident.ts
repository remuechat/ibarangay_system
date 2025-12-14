export interface Resident {
  residentId: string;

  firstName: string;
  lastName: string;

  houseNumber: string;
  street: string;
  city: string;
  purok: string;

  contactNumber: string;
  familyId?: string;

  vulnerableTypes?: string[];
  status: "Active" | "Inactive" | "Transferred Out" | "Deceased";

  dateRegistered?: string;
  dateUpdated?: string;
}
