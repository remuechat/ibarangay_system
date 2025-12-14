import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  PutCommand,
  GetCommand,
  ScanCommand,
  UpdateCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";
import { MaintenanceEntry } from "./Maintenance";

const TABLE = process.env.MAINTENANCE_TABLE!;
const client = new DynamoDBClient({});

class MaintenanceDAO {
  static async create(item: MaintenanceEntry) {
    item.dateCreated = new Date().toISOString();
    item.dateUpdated = new Date().toISOString();

    await client.send(
      new PutCommand({
        TableName: TABLE,
        Item: item,
      })
    );

    return item;
  }

  static async get(maintenanceId: string) {
    const res = await client.send(
      new GetCommand({
        TableName: TABLE,
        Key: { maintenanceId },
      })
    );
    return res.Item ?? null;
  }

  static async list() {
    const res = await client.send(
      new ScanCommand({ TableName: TABLE })
    );
    return res.Items ?? [];
  }

  static async update(maintenanceId: string, updates: Partial<MaintenanceEntry>) {
    updates.dateUpdated = new Date().toISOString();

    const expressions: string[] = [];
    const names: Record<string, string> = {};
    const values: Record<string, any> = {};

    for (const key in updates) {
      expressions.push(`#${key} = :${key}`);
      names[`#${key}`] = key;
      values[`:${key}`] = (updates as any)[key];
    }

    await client.send(
      new UpdateCommand({
        TableName: TABLE,
        Key: { maintenanceId },
        UpdateExpression: `SET ${expressions.join(", ")}`,
        ExpressionAttributeNames: names,
        ExpressionAttributeValues: values,
      })
    );

    return { maintenanceId, ...updates };
  }

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

// ================= LAMBDA HANDLER =================

export const handler = async (event: any) => {
  try {
    const method =
      event.requestContext?.http?.method || event.httpMethod;
    const path = event.rawPath || event.path || "/";
    const match = path.match(/\/([a-zA-Z0-9\-]+)$/);
    const maintenanceId = match ? match[1] : null;

    if (method === "OPTIONS") return response(200, {});

    if (method === "POST") {
      const body = JSON.parse(event.body || "{}");
      const item: MaintenanceEntry = {
        maintenanceId: uuidv4(),
        ...body,
      };
      return response(200, await MaintenanceDAO.create(item));
    }

    if (method === "GET" && maintenanceId) {
      return response(200, await MaintenanceDAO.get(maintenanceId));
    }

    if (method === "GET") {
      return response(200, await MaintenanceDAO.list());
    }

    if (method === "PUT" && maintenanceId) {
      const updates = JSON.parse(event.body || "{}");
      return response(
        200,
        await MaintenanceDAO.update(maintenanceId, updates)
      );
    }

    if (method === "DELETE" && maintenanceId) {
      await MaintenanceDAO.remove(maintenanceId);
      return response(200, { deleted: true });
    }

    return response(400, { error: "Invalid request" });
  } catch (err: any) {
    console.error(err);
    return response(500, { error: err.message });
  }
};

const response = (status: number, body: any) => ({
  statusCode: status,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  },
  body: JSON.stringify(body),
});
