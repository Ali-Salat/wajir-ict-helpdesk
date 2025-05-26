
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'requester' | 'approver' | 'technician' | 'admin';
  department?: string;
  skills?: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  category: 'hardware' | 'software' | 'network' | 'email' | 'phone' | 'other';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'pending' | 'in_progress' | 'resolved' | 'closed';
  requesterId: string;
  requesterName: string;
  assignedTechnicianId?: string;
  assignedTechnicianName?: string;
  approverId?: string;
  approverName?: string;
  attachments?: string[];
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  slaDeadline?: string;
}

export interface Comment {
  id: string;
  ticketId: string;
  authorId: string;
  authorName: string;
  content: string;
  isInternal: boolean;
  createdAt: string;
}

export interface KnowledgeArticle {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  authorId: string;
  authorName: string;
  isPublished: boolean;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  ticketId?: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  resource: string;
  resourceId: string;
  details: string;
  ipAddress: string;
  userAgent: string;
  createdAt: string;
}

export interface TicketStats {
  total: number;
  open: number;
  inProgress: number;
  resolved: number;
  closed: number;
  byCategory: Record<string, number>;
  byPriority: Record<string, number>;
  averageResolutionTime: number;
  slaCompliance: number;
}
