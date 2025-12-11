import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  PutCommand,
  GetCommand,
  ScanCommand,
  UpdateCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";

import { Family } from "../models/Family.js";

const TABLE = process.env.FAMILIES_TABLE!;
const client = new DynamoDBClient({});

export class FamiliesDAO {
  // CREATE
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

  // READ SINGLE
  static async get(familyId: string) {
    const res = await client.send(
      new GetCommand({
        TableName: TABLE,
        Key: { familyId },
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

  // DELETE
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
