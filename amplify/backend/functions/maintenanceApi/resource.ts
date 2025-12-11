import { defineFunction } from "@aws-amplify/backend";

export const maintenanceFunction = defineFunction({
  name: "maintenanceApi",
  runtime: { name: "nodejs18.x" },
  entry: "./lambdas/maintenance.ts",
  environment: {
    MAINTENANCE_TABLE: "Maintenance",
  },
});
