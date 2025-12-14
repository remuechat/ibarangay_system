// lib/backend/residentsApi.ts
import { Resident } from "@/amplify/backend/functions/residentsApi/src/Resident"

const BASE_URL = "https://4tr9ypzxs8.execute-api.ap-southeast-2.amazonaws.com/dev/residents"

// Fetch all residents
export async function listResidents(): Promise<Resident[]> {
  const res = await fetch(BASE_URL)
  if (!res.ok) throw new Error("Failed to fetch residents")
  return res.json()
}

// Create a new resident
export async function createResident(resident: Omit<Resident, "residentId">): Promise<Resident> {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(resident),
  })
  if (!res.ok) throw new Error("Failed to create resident")
  return res.json()
}

// Update existing resident
export async function updateResident(id: string, updates: Partial<Resident>): Promise<Resident> {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  })
  if (!res.ok) throw new Error("Failed to update resident")
  return res.json()
}

// Delete a resident
export async function deleteResident(id: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" })
  if (!res.ok) throw new Error("Failed to delete resident")
}
