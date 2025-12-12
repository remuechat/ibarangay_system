import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  PutCommand,
  GetCommand,
  ScanCommand,
  UpdateCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";
import { ResidentDocument } from "./ResidentDocument.js";
import { randomUUID } from "crypto";

const TABLE = process.env.RESIDENT_DOCUMENTS_TABLE!;
const client = new DynamoDBClient({});

class ResidentDocumentsDAO {
  static async create(item: ResidentDocument) {
    item.createdAt = new Date().toISOString();
    item.updatedAt = new Date().toISOString();
    await client.send(new PutCommand({ TableName: TABLE, Item: item }));
    return item;
  }

  static async get(documentId: string) {
    const res = await client.send(new GetCommand({
      TableName: TABLE,
      Key: { documentId },
    }));
    return res.Item ?? null;
  }

  static async list() {
    const res = await client.send(new ScanCommand({ TableName: TABLE }));
    return res.Items ?? [];
  }

  static async update(documentId: string, updates: Partial<ResidentDocument>) {
    updates.updatedAt = new Date().toISOString();
    const expression: string[] = [];
    const names: Record<string, string> = {};
    const values: Record<string, any> = {};

    for (const key in updates) {
      expression.push(`#${key} = :${key}`);
      names[`#${key}`] = key;
      values[`:${key}`] = (updates as any)[key];
    }

    await client.send(new UpdateCommand({
      TableName: TABLE,
      Key: { documentId },
      UpdateExpression: `SET ${expression.join(", ")}`,
      ExpressionAttributeNames: names,
      ExpressionAttributeValues: values,
    }));

    return { documentId, ...updates };
  }

  static async remove(documentId: string) {
    await client.send(new DeleteCommand({ TableName: TABLE, Key: { documentId } }));
    return true;
  }
}

// Lambda handler
export const handler = async (event: any) => {
  try {
    const method = event.httpMethod;

    if (method === "POST") {
      const data = JSON.parse(event.body);
      const item = { documentId: randomUUID(), ...data };
      return response(200, await ResidentDocumentsDAO.create(item));
    }

    if (method === "GET" && event.pathParameters?.id) {
      return response(200, await ResidentDocumentsDAO.get(event.pathParameters.id));
    }

    if (method === "GET") {
      return response(200, await ResidentDocumentsDAO.list());
    }

    if (method === "PUT") {
      const id = event.pathParameters.id;
      const updates = JSON.parse(event.body);
      return response(200, await ResidentDocumentsDAO.update(id, updates));
    }

    if (method === "DELETE") {
      const id = event.pathParameters.id;
      await ResidentDocumentsDAO.remove(id);
      return response(200, { deleted: true });
    }

    return response(400, { error: "Invalid Request" });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return response(500, { error: message });
  }
};

const response = (status: number, body: any) => ({
  statusCode: status,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});
