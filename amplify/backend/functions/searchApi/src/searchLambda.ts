import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { ScanCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});

// Helper: build DynamoDB filter expression
const buildFilterExpression = (filters: Record<string, any>) => {
  const expression: string[] = [];
  const names: Record<string, string> = {};
  const values: Record<string, any> = {};

  for (const key in filters) {
    expression.push(`#${key} = :${key}`);
    names[`#${key}`] = key;
    values[`:${key}`] = filters[key];
  }

  return {
    FilterExpression: expression.join(" AND "),
    ExpressionAttributeNames: names,
    ExpressionAttributeValues: values,
  };
};

export const handler = async (event: any) => {
  try {
    const { table, filter } = JSON.parse(event.body);

    if (!table) {
      return response(400, { error: "Table name is required" });
    }

    const params: any = { TableName: table };

    if (filter && Object.keys(filter).length > 0) {
      Object.assign(params, buildFilterExpression(filter));
    }

    const result = await client.send(new ScanCommand(params));

    return response(200, result.Items ?? []);
  } catch (err: unknown) {
    // Safely handle unknown type error
    const message = err instanceof Error ? err.message : String(err);
    return response(500, { error: message });
  }
};

const response = (status: number, body: any) => ({
  statusCode: status,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});
