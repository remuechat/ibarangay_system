import { Resident } from "@/amplify/backend/functions/residentsApi/src/Resident";

const BASE = "https://4pmf2mgc4b3zqze3xzzad2f3540udldl.lambda-url.ap-southeast-2.on.aws";

export async function listResidents(): Promise<Resident[]> {
  const res = await fetch(BASE);
  return res.json();
}

export async function createResident(data: Omit<Resident, "residentId">): Promise<Resident> {
  const res = await fetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateResident(id: string, updates: Partial<Resident>): Promise<Resident> {
  const res = await fetch(`${BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  return res.json();
}

export async function deleteResident(id: string) {
  await fetch(`${BASE}/${id}`, { method: "DELETE" });
}
