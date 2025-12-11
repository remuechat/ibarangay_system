import { useState, useEffect, useCallback } from "react";
import { Maintenance } from "../backend/Maintenance";
import { MaintenanceDAO } from "../backend/dao/MaintenanceDAO";

export function useMaintenance() {
  const [data, setData] = useState<Maintenance[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch all maintenance entries
  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const items = await MaintenanceDAO.list();
      setData(items as Maintenance[]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Call fetchAll on mount
  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // Reactive operations
  const create = async (item: Maintenance) => {
    const newItem = await MaintenanceDAO.create(item);
    await fetchAll(); // retrigger read all
    return newItem;
  };

  const update = async (maintenanceId: string, updates: Partial<Maintenance>) => {
    const updatedItem = await MaintenanceDAO.update(maintenanceId, updates);
    await fetchAll(); // retrigger read all
    return updatedItem;
  };

  const remove = async (maintenanceId: string) => {
    await MaintenanceDAO.remove(maintenanceId);
    await fetchAll(); // retrigger read all
    return true;
  };

  return { data, loading, fetchAll, create, update, remove };
}
