export interface Maintenance {
  maintenanceId: string;         
  propertyId: string;
  date: string;                 
  type: string;                   
  details: string;
  staff: string;                  
  conditionBefore: string;
  conditionAfter: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
