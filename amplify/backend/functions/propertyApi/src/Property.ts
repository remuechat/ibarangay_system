export interface BorrowRecord {
  borrowId: string;
  borrowedBy: string;
  quantity: number;
  borrowDate: string;
  returnDate: string;
  actualReturnDate?: string;
  status: "borrowed" | "returned";
}

export interface Property {
  propertyId: string;
  name: string;
  category: string;
  description: string;
  quantity: number;
  availableQuantity: number;
  condition: "Good" | "Fair" | "Needs Repair" | "Broken";
  location: string;
  dateAdded: string;
  dateUpdated: string;
  borrowRecords: BorrowRecord[];
}