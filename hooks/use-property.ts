import { Property } from "@/amplify/backend/functions/propertyApi/src/Property";

const BASE = "https://4odplrpc6atz6hvyij5gxtckgq0tjxmz.lambda-url.ap-southeast-2.on.aws/";

export async function listProperties(): Promise<Property[]> {
  const res = await fetch(BASE);
  return res.json();
}

export async function createProperty(
  data: Omit<Property, "propertyId" | "dateAdded" | "dateUpdated" | "availableQuantity" | "borrowRecords">
): Promise<Property> {
  const res = await fetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateProperty(
  id: string,
  updates: Partial<Property>
): Promise<Property> {
  const res = await fetch(`${BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  return res.json();
}

export async function deleteProperty(id: string) {
  await fetch(`${BASE}/${id}`, { method: "DELETE" });
}
