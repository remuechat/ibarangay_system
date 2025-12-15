"use client";

import { useEffect, useState } from "react";
import { Incident } from "@/amplify/backend/functions/incidentsApi/src/Incident";

const BASE_URL = "https://f43zeymysuwd272xbsectc7xy40dsmps.lambda-url.ap-southeast-2.on.aws/"; 

export function useIncidents() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    refresh();
  }, []);

  // Fetch all incidents (GET /incidents)
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
        throw new Error(errorData.error || `HTTP ${res.status}: Failed to fetch incidents`);
      }
      
      const data: Incident[] = await res.json();
      setIncidents(data);
    } catch (err: any) {
      console.error("Error fetching incidents:", err);
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  // Add new incident (POST /incidents)
  async function add(incident: Omit<Incident, "incidentId" | "dateCreated" | "dateUpdated">) {
    setError(null);
    try {
      const res = await fetch(BASE_URL, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify(incident),
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${res.status}: Failed to create incident`);
      }
      
      const created: Incident = await res.json();
      setIncidents(prev => [...prev, created]);
      return created;
    } catch (err: any) {
      console.error("Error creating incident:", err);
      setError(err.message || "Unknown error");
      throw err;
    }
  }

  // Update existing incident (PUT /incidents/{id})
  async function update(id: string, updates: Partial<Omit<Incident, "incidentId" | "dateCreated" | "dateUpdated">>) {
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
        throw new Error(errorData.error || `HTTP ${res.status}: Failed to update incident`);
      }
      
      const updated: Incident = await res.json();
      setIncidents(prev =>
        prev.map(i => (i.incidentId === id ? { ...i, ...updated } : i))
      );
      return updated;
    } catch (err: any) {
      console.error("Error updating incident:", err);
      setError(err.message || "Unknown error");
      throw err;
    }
  }

  // Delete incident (DELETE /incidents/{id})
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
        throw new Error(errorData.error || `HTTP ${res.status}: Failed to delete incident`);
      }
      
      setIncidents(prev => prev.filter(i => i.incidentId !== id));
    } catch (err: any) {
      console.error("Error deleting incident:", err);
      setError(err.message || "Unknown error");
      throw err;
    }
  }

  return {
    incidents,
    loading,
    error,
    refresh,
    add,
    update,
    remove,
  };
}