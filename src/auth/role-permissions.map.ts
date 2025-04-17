import { UserRole } from '../common/enums';
import { Permission } from '../common/enums/permission.enum';

export const RolePermissions: Record<UserRole, Permission[]> = {
  [UserRole.PROCUREMENT]: [Permission.CREATE_PURCHASE_ORDER],
  [UserRole.MANAGER]: [
    Permission.CREATE_PURCHASE_ORDER,
    Permission.APPROVE_PURCHASE_ORDER,
    Permission.VIEW_FINANCIAL_FIELDS,
  ],
  [UserRole.INVENTORY]: [
    Permission.STOCK_IN,
    Permission.STOCK_OUT,
    Permission.VIEW_INVENTORY,
  ],
  [UserRole.FINANCE]: [
    Permission.APPROVE_PURCHASE_ORDER,
    Permission.VIEW_FINANCIAL_FIELDS,
  ],
};
