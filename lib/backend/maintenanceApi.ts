import { MaintenanceEntry } from "@/amplify/backend/functions/maintenanceApi/src/Maintenance";
const BASE = "https://fm4fr34nge6uqtv27yfl3mulsm0ewbsd.lambda-url.ap-southeast-2.on.aws";

export async function listMaintenance(): Promise<MaintenanceEntry[]> {
  const res = await fetch(BASE);
  return res.json();
}

export async function createMaintenance(data: Omit<MaintenanceEntry, "id" | "dateCreated" | "dateUpdated">): Promise<MaintenanceEntry> {
  const res = await fetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateMaintenance(id: string, updates: Partial<MaintenanceEntry>): Promise<MaintenanceEntry> {
  const res = await fetch(`${BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  return res.json();
}

export async function deleteMaintenance(id: string) {
  await fetch(`${BASE}/${id}`, { method: "DELETE" });
}
