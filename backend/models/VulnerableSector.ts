export interface VulnerableSector {
  vulnerableId: string;
  residentId: string;

  type: string; // PWD, Senior, SoloParent, Indigent

  documents: {
    fileName: string;
    fileType: string;
    url: string;
    uploadedAt: string;
  }[];

  status: string; // Active / Inactive

  createdAt: string;
  updatedAt: string;
}
