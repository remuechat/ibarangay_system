// certificateLambdaDAO.ts
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  UpdateCommand,
  DeleteCommand,
  ScanCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const TABLE_NAME = process.env.CERTIFICATE_TABLE_NAME || "Certificates";

export interface Certificate {
  id: string;
  residentId: string;
  residentName: string;
  familyId: string;
  certificateType: string;
  purpose: string;
  dateRequested: string;
  status: "Pending" | "Approved" | "Rejected" | "Completed";
  assignedOfficer: string;
  notes?: string;
  captainName?: string;
  secretaryName?: string;
  captainSignature?: string;
  secretarySignature?: string;
  useDigitalSignature?: boolean;
  createdAt: string;
  updatedAt: string;
}

export class CertificateLambdaDAO {
  // Create a new certificate
  async createCertificate(certificate: Omit<Certificate, "id" | "createdAt" | "updatedAt">): Promise<Certificate> {
    const id = `CERT-${uuidv4().slice(0, 8).toUpperCase()}`;
    const timestamp = new Date().toISOString();

    const newCertificate: Certificate = {
      ...certificate,
      id,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    const command = new PutCommand({
      TableName: TABLE_NAME,
      Item: newCertificate,
    });

    await docClient.send(command);
    return newCertificate;
  }

  // Get certificate by ID
  async getCertificateById(id: string): Promise<Certificate | null> {
    const command = new GetCommand({
      TableName: TABLE_NAME,
      Key: { id },
    });

    const response = await docClient.send(command);
    return (response.Item as Certificate) || null;
  }

  // Get all certificates
  async getAllCertificates(): Promise<Certificate[]> {
    const command = new ScanCommand({
      TableName: TABLE_NAME,
    });

    const response = await docClient.send(command);
    return (response.Items as Certificate[]) || [];
  }

  // Get certificates by resident ID
  async getCertificatesByResidentId(residentId: string): Promise<Certificate[]> {
    const command = new ScanCommand({
      TableName: TABLE_NAME,
      FilterExpression: "residentId = :residentId",
      ExpressionAttributeValues: {
        ":residentId": residentId,
      },
    });

    const response = await docClient.send(command);
    return (response.Items as Certificate[]) || [];
  }

  // Get certificates by status
  async getCertificatesByStatus(status: string): Promise<Certificate[]> {
    const command = new ScanCommand({
      TableName: TABLE_NAME,
      FilterExpression: "#status = :status",
      ExpressionAttributeNames: {
        "#status": "status",
      },
      ExpressionAttributeValues: {
        ":status": status,
      },
    });

    const response = await docClient.send(command);
    return (response.Items as Certificate[]) || [];
  }

  // Get certificates by type
  async getCertificatesByType(certificateType: string): Promise<Certificate[]> {
    const command = new ScanCommand({
      TableName: TABLE_NAME,
      FilterExpression: "certificateType = :certificateType",
      ExpressionAttributeValues: {
        ":certificateType": certificateType,
      },
    });

    const response = await docClient.send(command);
    return (response.Items as Certificate[]) || [];
  }

  // Update certificate
  async updateCertificate(id: string, updates: Partial<Omit<Certificate, "id" | "createdAt">>): Promise<Certificate> {
    const timestamp = new Date().toISOString();

    // Build update expression dynamically
    const updateExpressions: string[] = [];
    const expressionAttributeNames: Record<string, string> = {};
    const expressionAttributeValues: Record<string, any> = {};

    Object.keys(updates).forEach((key) => {
      const value = updates[key as keyof typeof updates];
      if (value !== undefined) {
        updateExpressions.push(`#${key} = :${key}`);
        expressionAttributeNames[`#${key}`] = key;
        expressionAttributeValues[`:${key}`] = value;
      }
    });

    // Always update updatedAt
    updateExpressions.push("#updatedAt = :updatedAt");
    expressionAttributeNames["#updatedAt"] = "updatedAt";
    expressionAttributeValues[":updatedAt"] = timestamp;

    const command = new UpdateCommand({
      TableName: TABLE_NAME,
      Key: { id },
      UpdateExpression: `SET ${updateExpressions.join(", ")}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: "ALL_NEW",
    });

    const response = await docClient.send(command);
    return response.Attributes as Certificate;
  }

  // Update certificate status
  async updateCertificateStatus(id: string, status: Certificate["status"]): Promise<Certificate> {
    return this.updateCertificate(id, { status });
  }

  // Delete certificate
  async deleteCertificate(id: string): Promise<void> {
    const command = new DeleteCommand({
      TableName: TABLE_NAME,
      Key: { id },
    });

    await docClient.send(command);
  }

  // Search certificates by keyword
  async searchCertificates(keyword: string): Promise<Certificate[]> {
    const allCertificates = await this.getAllCertificates();
    const lowerKeyword = keyword.toLowerCase();

    return allCertificates.filter((cert) => {
      return (
        cert.id.toLowerCase().includes(lowerKeyword) ||
        cert.residentName.toLowerCase().includes(lowerKeyword) ||
        cert.residentId.toLowerCase().includes(lowerKeyword) ||
        cert.certificateType.toLowerCase().includes(lowerKeyword) ||
        cert.purpose.toLowerCase().includes(lowerKeyword) ||
        cert.status.toLowerCase().includes(lowerKeyword)
      );
    });
  }

  // Get certificates by date range
  async getCertificatesByDateRange(startDate: string, endDate: string): Promise<Certificate[]> {
    const command = new ScanCommand({
      TableName: TABLE_NAME,
      FilterExpression: "dateRequested BETWEEN :startDate AND :endDate",
      ExpressionAttributeValues: {
        ":startDate": startDate,
        ":endDate": endDate,
      },
    });

    const response = await docClient.send(command);
    return (response.Items as Certificate[]) || [];
  }

  // Get certificate statistics
  async getCertificateStatistics(): Promise<{
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    completed: number;
    byType: Record<string, number>;
  }> {
    const certificates = await this.getAllCertificates();

    const stats = {
      total: certificates.length,
      pending: 0,
      approved: 0,
      rejected: 0,
      completed: 0,
      byType: {} as Record<string, number>,
    };

    certificates.forEach((cert) => {
      // Count by status
      switch (cert.status) {
        case "Pending":
          stats.pending++;
          break;
        case "Approved":
          stats.approved++;
          break;
        case "Rejected":
          stats.rejected++;
          break;
        case "Completed":
          stats.completed++;
          break;
      }

      // Count by type
      stats.byType[cert.certificateType] = (stats.byType[cert.certificateType] || 0) + 1;
    });

    return stats;
  }
}

export const certificateDAO = new CertificateLambdaDAO();