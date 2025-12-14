import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  PutCommand,
  GetCommand,
  ScanCommand,
  UpdateCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";
import { Resident } from "./Resident";
import { v4 as uuidv4 } from "uuid";

const TABLE = process.env.RESIDENTS_TABLE!;
const client = new DynamoDBClient({});

class ResidentDAO {
  static async create(item: Resident) {
    item.dateRegistered = new Date().toISOString();
    item.dateUpdated = new Date().toISOString();
    await client.send(new PutCommand({ TableName: TABLE, Item: item }));
    return item;
  }

  static async get(residentId: string) {
    const res = await client.send(
      new GetCommand({ TableName: TABLE, Key: { residentId } })
    );
    return res.Item ?? null;
  }

  static async list() {
    const res = await client.send(new ScanCommand({ TableName: TABLE }));
    return res.Items ?? [];
  }

  static async update(residentId: string, updates: Partial<Resident>) {
    updates.dateUpdated = new Date().toISOString();
    const expression: string[] = [];
    const names: Record<string, string> = {};
    const values: Record<string, any> = {};

    for (const key in updates) {
      expression.push(`#${key} = :${key}`);
      names[`#${key}`] = key;
      values[`:${key}`] = (updates as any)[key];
    }

    await client.send(
      new UpdateCommand({
        TableName: TABLE,
        Key: { residentId },
        UpdateExpression: `SET ${expression.join(", ")}`,
        ExpressionAttributeNames: names,
        ExpressionAttributeValues: values,
      })
    );

    return { residentId, ...updates };
  }

  static async remove(residentId: string) {
    await client.send(
      new DeleteCommand({ TableName: TABLE, Key: { residentId } })
    );
    return true;
  }
}

// Lambda handler
export const handler = async (event: any) => {
  try {
    const method = event.httpMethod;

    // CORS Preflight
    if (method === "OPTIONS") {
      return response(200, {});
    }

    // CREATE
    if (method === "POST") {
      const data = JSON.parse(event.body || "{}");
      const item = { residentId: uuidv4(), ...data };
      const result = await ResidentDAO.create(item);
      return response(200, result);
    }

    // READ SINGLE
    if (method === "GET" && event.pathParameters?.id) {
      const result = await ResidentDAO.get(event.pathParameters.id);
      return response(200, result);
    }

    // READ ALL
    if (method === "GET") {
      const result = await ResidentDAO.list();
      return response(200, result);
    }

    // UPDATE
    if (method === "PUT") {
      const id = event.pathParameters?.id;
      const updates = JSON.parse(event.body || "{}");
      const result = await ResidentDAO.update(id, updates);
      return response(200, result);
    }

    // DELETE
    if (method === "DELETE") {
      const id = event.pathParameters?.id;
      await ResidentDAO.remove(id);
      return response(200, { deleted: true });
    }

    return response(400, { error: "Invalid Request" });
  } catch (err: any) {
    console.error("Lambda Error:", err);
    return response(500, { error: err.message || "Internal Server Error" });
  }
};

// Updated response helper with CORS headers
const response = (status: number, body: any) => ({
  statusCode: status,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS"
  },
  body: JSON.stringify(body),
});