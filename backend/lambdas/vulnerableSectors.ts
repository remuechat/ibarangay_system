import { VulnerableSectorsDAO } from "./DAO/VulnerableSectorsDAO.js";
import { randomUUID } from "crypto";

export const handler = async (event: any) => {
  const method = event.httpMethod;

  // CREATE
  if (method === "POST") {
    const data = JSON.parse(event.body);
    const item = {
      vulnerableId: randomUUID(),
      ...data,
    };
    const result = await VulnerableSectorsDAO.create(item);
    return response(200, result);
  }

  // READ SINGLE
  if (method === "GET" && event.pathParameters?.id) {
    const result = await VulnerableSectorsDAO.get(event.pathParameters.id);
    return response(200, result);
  }

  // READ ALL
  if (method === "GET") {
    const result = await VulnerableSectorsDAO.list();
    return response(200, result);
  }

  // UPDATE
  if (method === "PUT") {
    const id = event.pathParameters.id;
    const updates = JSON.parse(event.body);
    const result = await VulnerableSectorsDAO.update(id, updates);
    return response(200, result);
  }

  // DELETE
  if (method === "DELETE") {
    const id = event.pathParameters.id;
    await VulnerableSectorsDAO.remove(id);
    return response(200, { deleted: true });
  }

  return response(400, { error: "Invalid Request" });
};

const response = (status: number, body: any) => ({
  statusCode: status,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});
