import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  PutCommand,
  GetCommand,
  ScanCommand,
  UpdateCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";

import { Maintenance } from "../Maintenance.js";

const TABLE = process.env.MAINTENANCE_TABLE!;
const client = new DynamoDBClient({});

export class MaintenanceDAO {
  // CREATE
  static async create(item: Maintenance) {
    item.createdAt = new Date().toISOString();
    item.updatedAt = new Date().toISOString();

    await client.send(
      new PutCommand({
        TableName: TABLE,
        Item: item,
      })
    );

    return item;
  }

  // READ 
  static async get(maintenanceId: string) {
    const res = await client.send(
      new GetCommand({
        TableName: TABLE,
        Key: { maintenanceId },
      })
    );
    return res.Item ?? null;
  }

  // READ ALL
  static async list() {
    const res = await client.send(
      new ScanCommand({
        TableName: TABLE,
      })
    );
    return res.Items ?? [];
  }

  // UPDATE
  static async update(maintenanceId: string, updates: Partial<Maintenance>) {
    updates.updatedAt = new Date().toISOString();

    const expression = [];
    const names: any = {};
    const values: any = {};

    for (const key in updates) {
      expression.push(`#${key} = :${key}`);
      names[`#${key}`] = key;
      values[`:${key}`] = (updates as any)[key];
    }

    await client.send(
      new UpdateCommand({
        TableName: TABLE,
        Key: { maintenanceId },
        UpdateExpression: `SET ${expression.join(", ")}`,
        ExpressionAttributeNames: names,
        ExpressionAttributeValues: values,
      })
    );

    return { maintenanceId, ...updates };
  }

  // DELETE
  static async remove(maintenanceId: string) {
    await client.send(
      new DeleteCommand({
        TableName: TABLE,
        Key: { maintenanceId },
      })
    );
    return true;
  }
}
