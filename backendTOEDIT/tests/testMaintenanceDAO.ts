// testMaintenanceDAO.ts

import { MaintenanceDAO } from "../dao/MaintenanceDAO";
import { Maintenance } from "../Maintenance";

// Utility for generating random IDs
function randomId() {
  return "m-" + Math.random().toString(36).slice(2, 10);
}

async function testCRUD() {
  const maintenanceId = randomId();

  console.log("=== CREATE ===");
  const newItem: Maintenance = {
    maintenanceId,
    propertyId: "property-01",
    date: new Date().toISOString(),
    type: "Electrical",
    details: "Light bulb replacement",
    staff: "John Doe",
    conditionBefore: "Broken bulb",
    conditionAfter: "New bulb installed",
    notes: "Performed at night",
    createdAt: "",
    updatedAt: "",
  };

  const created = await MaintenanceDAO.create(newItem);
  console.log("Created:", created);

  console.log("\n=== READ: get() ===");
  const fetched = await MaintenanceDAO.get(maintenanceId);
  console.log("Fetched:", fetched);

  console.log("\n=== READ ALL: list() ===");
  const all = await MaintenanceDAO.list();
  console.log("All Items:", all);

  console.log("\n=== UPDATE ===");
  const updated = await MaintenanceDAO.update(maintenanceId, {
    notes: "Updated notes",
    conditionAfter: "Fixed and tested",
  });
  console.log("Updated:", updated);

  console.log("\n=== DELETE ===");
  const deleted = await MaintenanceDAO.remove(maintenanceId);
  console.log("Deleted:", deleted);

  console.log("\n=== FINAL CHECK: get() after delete ===");
  const afterDelete = await MaintenanceDAO.get(maintenanceId);
  console.log("Should be null:", afterDelete);
}

testCRUD().catch((err) => {
  console.error("ERROR during CRUD test:", err);
});
