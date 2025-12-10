import { defineFunction } from "@aws-amplify/backend";

export const propertyFunction = defineFunction({
  runtime: "nodejs18",
  entry: "./lambdas/property.ts",
  environment: {
    PROPERTY_TABLE: "Property",
  },
});
