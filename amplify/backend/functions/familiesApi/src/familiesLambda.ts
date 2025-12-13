import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  PutCommand,
  GetCommand,
  ScanCommand,
  UpdateCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";
import { Family } from "./families.js";
import { randomUUID } from "crypto";

const TABLE = process.env.FAMILIES_TABLE!;
const client = new DynamoDBClient({});

// DAO class inside the Lambda file
class FamiliesDAO {
  static async create(item: Family) {
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

  static async get(familyId: string) {
    const res = await client.send(
      new GetCommand({
        TableName: TABLE,
        Key: { familyId },
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

  static async update(familyId: string, updates: Partial<Family>) {
    updates.updatedAt = new Date().toISOString();

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
        Key: { familyId },
        UpdateExpression: `SET ${expression.join(", ")}`,
        ExpressionAttributeNames: names,
        ExpressionAttributeValues: values,
      })
    );

    return { familyId, ...updates };
  }

  static async remove(familyId: string) {
    await client.send(
      new DeleteCommand({
        TableName: TABLE,
        Key: { familyId },
      })
    );
    return true;
  }
}

// Lambda handler
export const handler = async (event: any) => {
  try {
    const method = event.httpMethod;

    // CREATE
    if (method === "POST") {
      const data = JSON.parse(event.body);
      const item = { familyId: randomUUID(), ...data };
      const result = await FamiliesDAO.create(item);
      return response(200, result);
    }

    // READ SINGLE
    if (method === "GET" && event.pathParameters?.id) {
      const result = await FamiliesDAO.get(event.pathParameters.id);
      return response(200, result);
    }

    // READ ALL
    if (method === "GET") {
      const result = await FamiliesDAO.list();
      return response(200, result);
    }

    // UPDATE
    if (method === "PUT") {
      const id = event.pathParameters.id;
      const updates = JSON.parse(event.body);
      const result = await FamiliesDAO.update(id, updates);
      return response(200, result);
    }

    // DELETE
    if (method === "DELETE") {
      const id = event.pathParameters.id;
      await FamiliesDAO.remove(id);
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
