enum UserRole {
  PROCUREMENT = 'procurement',
  MANAGER = 'manager',
  INVENTORY = 'inventory',
  FINANCE = 'finance',
}

enum Permission {
  CREATE_PO = 'create_po',
  APPROVE_PO = 'approve_po',
  STOCK_IN = 'stock_in',
  VIEW_FINANCIAL = 'view_financial',
}

enum PurchaseOrderStatus {
  DRAFT = 'draft',
  PENDING_REVIEW = 'pending_review',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled',
}

export { UserRole, PurchaseOrderStatus, Permission };
