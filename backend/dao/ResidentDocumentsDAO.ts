import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  PutCommand,
  GetCommand,
  ScanCommand,
  UpdateCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";

import { ResidentDocument } from "../models/ResidentDocument";

const TABLE = process.env.RESIDENT_DOCUMENTS_TABLE!;
const client = new DynamoDBClient({});

export class ResidentDocumentsDAO {
  // CREATE
  static async create(item: ResidentDocument) {
    item.createdAt = new Date().toISOString();
    item.updatedAt = new Date().toISOString();

    await client.send(
      new PutCommand({ TableName: TABLE, Item: item })
    );

    return item;
  }

  // READ SINGLE
  static async get(documentId: string) {
    const res = await client.send(
      new GetCommand({ TableName: TABLE, Key: { documentId } })
    );
    return res.Item ?? null;
  }

  // READ ALL
  static async list() {
    const res = await client.send(
      new ScanCommand({ TableName: TABLE })
    );
    return res.Items ?? [];
  }

  // LIST BY RESIDENT
  static async listByResident(residentId: string) {
    const res = await client.send(
      new ScanCommand({
        TableName: TABLE,
        FilterExpression: "residentId = :r",
        ExpressionAttributeValues: { ":r": residentId },
      })
    );
    return res.Items ?? [];
  }

  // UPDATE
  static async update(documentId: string, updates: Partial<ResidentDocument>) {
    updates.updatedAt = new Date().toISOString();

    const expression: string[] = [];
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
        Key: { documentId },
        UpdateExpression: `SET ${expression.join(", ")}`,
        ExpressionAttributeNames: names,
        ExpressionAttributeValues: values,
      })
    );

    return { documentId, ...updates };
  }

  // DELETE
  static async remove(documentId: string) {
    await client.send(
      new DeleteCommand({ TableName: TABLE, Key: { documentId } })
    );
    return true;
  }
}
