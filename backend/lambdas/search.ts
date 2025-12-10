import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { ScanCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});

export const handler = async (event: any) => {
  const { table, filter, sort, sortBy } = JSON.parse(event.body || "{}");

  if (!table) return response(400, { error: "Table is required" });

  // Map table name to environment variables
  const TABLE_NAME =
    table === "residents"
      ? process.env.RESIDENTS_TABLE
      : table === "families"
      ? process.env.FAMILIES_TABLE
      : table === "vulnerables"
      ? process.env.VULNERABLES_TABLE
      : table === "documents"
      ? process.env.DOCUMENTS_TABLE
      : null;

  if (!TABLE_NAME) return response(400, { error: "Invalid table" });

  // Build Scan + FilterExpression dynamically
  let filterExpression = "";
  const expressionValues: any = {};

  if (filter) {
    const conditions: string[] = [];
    Object.keys(filter).forEach((key, i) => {
      const placeholder = `:val${i}`;
      conditions.push(`${key} = ${placeholder}`);
      expressionValues[placeholder] = filter[key];
    });
    filterExpression = conditions.join(" AND ");
  }

  // Execute Scan
  const result = await client.send(
    new ScanCommand({
      TableName: TABLE_NAME,
      FilterExpression: filterExpression || undefined,
      ExpressionAttributeValues: Object.keys(expressionValues).length
        ? expressionValues
        : undefined,
    })
  );

  let items = result.Items || [];

  // Sorting
  if (sort && sortBy) {
    items = items.sort((a: any, b: any) => {
      if (sort === "asc") return a[sortBy] > b[sortBy] ? 1 : -1;
      else return a[sortBy] < b[sortBy] ? 1 : -1;
    });
  }

  return response(200, items);
};

const response = (status: number, body: any) => ({
  statusCode: status,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});
