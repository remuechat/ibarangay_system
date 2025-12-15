import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  PutCommand,
  GetCommand,
  ScanCommand,
  UpdateCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";
import { Property, BorrowRecord } from "./Property";

const TABLE = process.env.PROPERTY_TABLE!;
const client = new DynamoDBClient({});

class PropertyDAO {
  static async create(item: Omit<Property, "propertyId" | "dateAdded" | "dateUpdated" | "availableQuantity" | "borrowRecords">) {
    const now = new Date().toISOString();

    const property: Property = {
      propertyId: uuidv4(),
      ...item,
      dateAdded: now,
      dateUpdated: now,
      availableQuantity: item.quantity,
      borrowRecords: [],
    };

    await client.send(
      new PutCommand({
        TableName: TABLE,
        Item: property,
      })
    );

    return property;
  }

  static async get(propertyId: string) {
    const res = await client.send(
      new GetCommand({
        TableName: TABLE,
        Key: { propertyId },
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

  static async update(propertyId: string, updates: Partial<Property>) {
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
        Key: { propertyId },
        UpdateExpression: `SET ${expressions.join(", ")}`,
        ExpressionAttributeNames: names,
        ExpressionAttributeValues: values,
      })
    );

    return { propertyId, ...updates };
  }

  static async remove(propertyId: string) {
    await client.send(
      new DeleteCommand({
        TableName: TABLE,
        Key: { propertyId },
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
    const match = path.match(/\/([^/]+)$/);
    const propertyId = match ? match[1] : null;

    if (method === "OPTIONS") return response(200, {});

    if (method === "POST") {
      const body = JSON.parse(event.body || "{}");
      return response(200, await PropertyDAO.create(body));
    }

    if (method === "GET" && propertyId) {
      return response(200, await PropertyDAO.get(propertyId));
    }

    if (method === "GET") {
      return response(200, await PropertyDAO.list());
    }

    if (method === "PUT" && propertyId) {
      const updates = JSON.parse(event.body || "{}");
      return response(200, await PropertyDAO.update(propertyId, updates));
    }

    if (method === "DELETE" && propertyId) {
      await PropertyDAO.remove(propertyId);
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
