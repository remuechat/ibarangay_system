import { Incident } from "@/amplify/backend/functions/incidentsApi/src/Incident"

const BASE_URL = "https://f43zeymysuwd272xbsectc7xy40dsmps.lambda-url.ap-southeast-2.on.aws/" 

// Fetch all incidents
export async function listIncidents(): Promise<Incident[]> {
  const res = await fetch(BASE_URL)
  if (!res.ok) throw new Error("Failed to fetch incidents")
  return res.json()
}

// Create a new incident
export async function createIncident(incident: Omit<Incident, "incidentId">): Promise<Incident> {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(incident),
  })
  if (!res.ok) throw new Error("Failed to create incident")
  return res.json()
}

// Update existing incident
export async function updateIncident(id: string, updates: Partial<Incident>): Promise<Incident> {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  })
  if (!res.ok) throw new Error("Failed to update incident")
  return res.json()
}

// Delete an incident
export async function deleteIncident(id: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" })
  if (!res.ok) throw new Error("Failed to delete incident")
}
