import { useState, useEffect } from "react";
import { MaintenanceEntry } from "@/amplify/backend/functions/maintenanceApi/src/Maintenance";

const API = "https://fm4fr34nge6uqtv27yfl3mulsm0ewbsd.lambda-url.ap-southeast-2.on.aws";

// UI-safe type
export interface UIMaintenanceEntry extends MaintenanceEntry {
  id: string;
}

const mapEntry = (e: MaintenanceEntry): UIMaintenanceEntry => ({
  ...e,
  id: e.maintenanceId,
});

export function useMaintenance() {
  const [entries, setEntries] = useState<UIMaintenanceEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = async () => {
    setLoading(true);
    try {
      const res = await fetch(API);
      const data: MaintenanceEntry[] = await res.json();
      setEntries(data.map(mapEntry));
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const add = async (data: Omit<MaintenanceEntry, "maintenanceId">) => {
    const res = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const created = mapEntry(await res.json());
    setEntries(prev => [...prev, created]);
  };

  const update = async (id: string, updates: Partial<MaintenanceEntry>) => {
    const res = await fetch(`${API}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    const updated = mapEntry(await res.json());
    setEntries(prev =>
      prev.map(e => (e.id === id ? updated : e))
    );
  };

  const remove = async (id: string) => {
    await fetch(`${API}/${id}`, { method: "DELETE" });
    setEntries(prev => prev.filter(e => e.id !== id));
  };

  useEffect(() => {
    refresh();
  }, []);

  return { entries, loading, error, refresh, add, update, remove };
}
