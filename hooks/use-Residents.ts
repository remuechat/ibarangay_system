// hooks/useResidents.ts
"use client";

import { useEffect, useState } from "react";
import { Resident } from "@/amplify/backend/functions/residentsApi/src/Resident";

const BASE_URL = "https://4tr9ypzxs8.execute-api.ap-southeast-2.amazonaws.com/dev/residents";

export function useResidents() {
  const [residents, setResidents] = useState<Resident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    refresh();
  }, []);

  // Fetch all residents (GET /residents)
  async function refresh() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(BASE_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${res.status}: Failed to fetch residents`);
      }
      
      const data: Resident[] = await res.json();
      setResidents(data);
    } catch (err: any) {
      console.error("Error fetching residents:", err);
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  // Add new resident (POST /residents)
  async function add(resident: Omit<Resident, "residentId" | "dateRegistered" | "dateUpdated">) {
    setError(null);
    try {
      const res = await fetch(BASE_URL, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify(resident),
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${res.status}: Failed to create resident`);
      }
      
      const created: Resident = await res.json();
      setResidents(prev => [...prev, created]);
      return created;
    } catch (err: any) {
      console.error("Error creating resident:", err);
      setError(err.message || "Unknown error");
      throw err;
    }
  }

  // Update existing resident (PUT /residents/{id})
  async function update(id: string, updates: Partial<Omit<Resident, "residentId" | "dateRegistered" | "dateUpdated">>) {
    setError(null);
    try {
      const res = await fetch(`${BASE_URL}/${id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${res.status}: Failed to update resident`);
      }
      
      const updated: Resident = await res.json();
      setResidents(prev =>
        prev.map(r => (r.residentId === id ? { ...r, ...updated } : r))
      );
      return updated;
    } catch (err: any) {
      console.error("Error updating resident:", err);
      setError(err.message || "Unknown error");
      throw err;
    }
  }

  // Delete resident (DELETE /residents/{id})
  async function remove(id: string) {
    setError(null);
    try {
      const res = await fetch(`${BASE_URL}/${id}`, { 
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${res.status}: Failed to delete resident`);
      }
      
      setResidents(prev => prev.filter(r => r.residentId !== id));
    } catch (err: any) {
      console.error("Error deleting resident:", err);
      setError(err.message || "Unknown error");
      throw err;
    }
  }

  return {
    residents,
    loading,
    error,
    refresh,
    add,
    update,
    remove,
  };
}