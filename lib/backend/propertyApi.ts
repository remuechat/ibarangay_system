import { PropertyDisc } from "@/amplify/backend/functions/propertyApi/src/Property";

const BASE = "https://4odplrpc6atz6hvyij5gxtckgq0tjxmz.lambda-url.ap-southeast-2.on.aws/"; // Replace with your actual Function URL

export async function listProperties(): Promise<PropertyDisc[]> {
  const res = await fetch(BASE);
  return res.json();
}

export async function createProperty(data: Omit<PropertyDisc, "propertyId" | "dateAdded" | "dateUpdated" | "availableQuantity" | "borrowRecords">): Promise<PropertyDisc> {
  const res = await fetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateProperty(id: string, updates: Partial<PropertyDisc>): Promise<PropertyDisc> {
  const res = await fetch(`${BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  return res.json();
}

export async function deleteProperty(id: string): Promise<void> {
  await fetch(`${BASE}/${id}`, { method: "DELETE" });
}

// Borrow feature - now with quantity
export async function borrowProperty(
  id: string,
  borrowedBy: string,
  quantity: number,
  borrowDate: string,
  returnDate: string
): Promise<PropertyDisc> {
  const res = await fetch(`${BASE}/${id}/borrow`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ borrowedBy, quantity, borrowDate, returnDate }),
  });
  return res.json();
}

// Return feature - requires borrowId
export async function returnProperty(id: string, borrowId: string): Promise<PropertyDisc> {
  const res = await fetch(`${BASE}/${id}/return/${borrowId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  return res.json();
}