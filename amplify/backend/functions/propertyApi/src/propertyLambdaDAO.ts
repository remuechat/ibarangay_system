import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  PutCommand,
  GetCommand,
  ScanCommand,
  UpdateCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";
import { Property } from "./Property";
import { v4 as uuidv4 } from "uuid";

const TABLE = process.env.PROPERTY_TABLE!;
const client = new DynamoDBClient({});

class PropertyDAO {
  static async create(item: Property) {
    item.createdAt = new Date().toISOString();
    item.updatedAt = new Date().toISOString();
    await client.send(new PutCommand({ TableName: TABLE, Item: item }));
    return item;
  }

  static async get(propertyId: string) {
    const res = await client.send(new GetCommand({ TableName: TABLE, Key: { propertyId } }));
    return res.Item ?? null;
  }

  static async list() {
    const res = await client.send(new ScanCommand({ TableName: TABLE }));
    return res.Items ?? [];
  }

  static async update(propertyId: string, updates: Partial<Property>) {
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
        Key: { propertyId },
        UpdateExpression: `SET ${expression.join(", ")}`,
        ExpressionAttributeNames: names,
        ExpressionAttributeValues: values,
      })
    );

    return { propertyId, ...updates };
  }

  static async remove(propertyId: string) {
    await client.send(new DeleteCommand({ TableName: TABLE, Key: { propertyId } }));
    return true;
  }
}

// Lambda handler
export const handler = async (event: any) => {
  const method = event.httpMethod;

  if (method === "POST") {
    const data = JSON.parse(event.body);
    const item = { propertyId: uuidv4(), ...data };
    const result = await PropertyDAO.create(item);
    return response(200, result);
  }

  if (method === "GET" && event.pathParameters?.id) {
    const result = await PropertyDAO.get(event.pathParameters.id);
    return response(200, result);
  }

  if (method === "GET") {
    const result = await PropertyDAO.list();
    return response(200, result);
  }

  if (method === "PUT") {
    const id = event.pathParameters.id;
    const updates = JSON.parse(event.body);
    const result = await PropertyDAO.update(id, updates);
    return response(200, result);
  }

  if (method === "DELETE") {
    const id = event.pathParameters.id;
    await PropertyDAO.remove(id);
    return response(200, { deleted: true });
  }

  return response(400, { error: "Invalid Request" });
};

const response = (status: number, body: any) => ({
  statusCode: status,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});
