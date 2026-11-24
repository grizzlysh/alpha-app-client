export interface AuditChange {
  from: unknown;
  to: unknown;
}

export interface AuditLog {
  uuid: string;
  action: string;
  entityType: string;
  entityUuid: string | null;
  entityLabel: string | null;
  changes: Record<string, AuditChange> | null;
  metadata: Record<string, unknown> | null;
  user: { uuid: string; name: string } | null;
  ipAddress: string | null;
  createdAt: string;
}

export interface AuditActionCount {
  action: string;
  count: number;
}

export interface AuditLogListParams {
  action?: string;
  userUuid?: string;
  entityUuid?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}
