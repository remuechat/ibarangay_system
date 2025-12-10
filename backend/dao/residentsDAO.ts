import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  PutCommand,
  GetCommand,
  ScanCommand,
  UpdateCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";

import { Resident } from "../models/Resident.js";

const TABLE = process.env.RESIDENTS_TABLE!;
const client = new DynamoDBClient({});

export class ResidentsDAO {
  // CREATE
  static async create(item: Resident) {
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

  // READ SINGLE
  static async get(residentId: string) {
    const res = await client.send(
      new GetCommand({
        TableName: TABLE,
        Key: { residentId },
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
  static async update(residentId: string, updates: Partial<Resident>) {
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
        Key: { residentId },
        UpdateExpression: `SET ${expression.join(", ")}`,
        ExpressionAttributeNames: names,
        ExpressionAttributeValues: values,
      })
    );

    return { residentId, ...updates };
  }

  // DELETE
  static async remove(residentId: string) {
    await client.send(
      new DeleteCommand({
        TableName: TABLE,
        Key: { residentId },
      })
    );
    return true;
  }
}
