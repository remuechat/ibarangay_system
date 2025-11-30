import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

const client = new DynamoDBClient({});

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const body = JSON.parse(event.body!);
    const residentId = crypto.randomUUID();

    const params = {
      TableName: process.env.RESIDENT_TABLE!,
      Item: {
        residentId: { S: residentId },
        firstName: { S: body.firstName },
        lastName: { S: body.lastName },
        birthDate: { S: body.birthDate },
        gender: { S: body.gender },
        civilStatus: { S: body.civilStatus },
        contactNumber: { S: body.contactNumber },
      },
    };

    await client.send(new PutItemCommand(params));

    return { statusCode: 200, body: JSON.stringify({ message: "Resident created", residentId }) };
  } catch (error: any) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};