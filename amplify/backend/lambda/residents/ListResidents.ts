import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyResult } from "aws-lambda";

const client = new DynamoDBClient({});

export const handler = async (): Promise<APIGatewayProxyResult> => {
  try {
    const params = { TableName: process.env.RESIDENT_TABLE! };
    const data = await client.send(new ScanCommand(params));

    return { statusCode: 200, body: JSON.stringify({ residents: data.Items }) };
  } catch (error: any) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
