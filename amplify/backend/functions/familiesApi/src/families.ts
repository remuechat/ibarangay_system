import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  PutCommand,
  GetCommand,
  ScanCommand,
  UpdateCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";

const client = new DynamoDBClient({});
const TABLE = process.env.FAMILIES_TABLE!;

// Data Model
interface Family {
  familyId: string;
  headName: string;
  address: string;
  purok: string;
  members?: string[];
  createdAt: string;
  updatedAt: string;
}

// DAO
class FamiliesDAO {
  static async create(item: Family) {
    item.createdAt = new Date().toISOString();
    item.updatedAt = new Date().toISOString();
    await client.send(new PutCommand({ TableName: TABLE, Item: item }));
    return item;
  }

  static async get(familyId: string) {
    const res = await client.send(new GetCommand({ TableName: TABLE, Key: { familyId } }));
    return res.Item ?? null;
  }

  static async list() {
    const res = await client.send(new ScanCommand({ TableName: TABLE }));
    return res.Items ?? [];
  }

  static async update(familyId: string, updates: Partial<Family>) {
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
        Key: { familyId },
        UpdateExpression: `SET ${expression.join(", ")}`,
        ExpressionAttributeNames: names,
        ExpressionAttributeValues: values,
      })
    );
    return { familyId, ...updates };
  }

  static async remove(familyId: string) {
    await client.send(new DeleteCommand({ TableName: TABLE, Key: { familyId } }));
    return true;
  }
}

// Lambda handler
export const handler = async (event: any) => {
  const method = event.httpMethod;
  try {
    if (method === "POST") {
      const data = JSON.parse(event.body);
      const item = { familyId: uuidv4(), ...data };
      const result = await FamiliesDAO.create(item);
      return respond(200, result);
    }

    if (method === "GET" && event.pathParameters?.id) {
      const result = await FamiliesDAO.get(event.pathParameters.id);
      return respond(200, result);
    }

    if (method === "GET") {
      const result = await FamiliesDAO.list();
      return respond(200, result);
    }

    if (method === "PUT") {
      const id = event.pathParameters.id;
      const updates = JSON.parse(event.body);
      const result = await FamiliesDAO.update(id, updates);
      return respond(200, result);
    }

    if (method === "DELETE") {
      const id = event.pathParameters.id;
      await FamiliesDAO.remove(id);
      return respond(200, { deleted: true });
    }

    return respond(400, { error: "Invalid request" });
  } catch (err: any) {
    return respond(500, { error: err.message });
  }
};

const respond = (status: number, body: any) => ({
  statusCode: status,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});
