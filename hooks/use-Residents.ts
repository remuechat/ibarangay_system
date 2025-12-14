import { useState, useEffect } from "react";
import { Resident } from "@/amplify/backend/functions/residentsApi/src/Resident";

const API_BASE_URL = "https://4pmf2mgc4b3zqze3xzzad2f3540udldl.lambda-url.ap-southeast-2.on.aws";

export function useResidents() {
  const [residents, setResidents] = useState<Resident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all residents
  const refresh = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(API_BASE_URL);
      if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to fetch residents`);
      const data: Resident[] = await res.json();
      setResidents(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  // Add resident
  const add = async (data: Omit<Resident, "residentId">) => {
    try {
      const res = await fetch(API_BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to create resident`);
      const created: Resident = await res.json();
      setResidents(prev => [...prev, created]);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Unknown error");
      throw err;
    }
  };

  // Update resident
  const update = async (id: string, updates: Partial<Resident>) => {
    try {
      const res = await fetch(`${API_BASE_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to update resident`);
      const updated: Resident = await res.json();
      setResidents(prev => prev.map(r => r.residentId === id ? { ...r, ...updated } : r));
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Unknown error");
      throw err;
    }
  };

  // Delete resident
  const remove = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to delete resident`);
      setResidents(prev => prev.filter(r => r.residentId !== id));
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Unknown error");
      throw err;
    }
  };

  useEffect(() => {
    refresh(); // automatically load residents on mount
  }, []);

  return { residents, loading, error, refresh, add, update, remove };
}
