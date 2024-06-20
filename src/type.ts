export enum UserRole {
  Admin = 'Admin',
}

enum UserGroupRole {
  None = 'None',
  Viewer = 'Viewer',
  Editor = 'Editor',
  Owner = 'Owner',
}

export interface SaleReport {
  hashPower: number;
  amount: number;
  member: Record<string, number>;
}

export interface SaleReportInput {
  invoiceNo: number;
  username: string;
  mobile: string;
  email: string;
  productName: string;
  date: Date;
  paymentMethod: string;
  amount: number;
  hashPower: number;
  assetId: string;
}

export interface MineStatInput {
  date: Date;
  totalBlocks: number;
  newBlocks: number;
}

export interface UserGroupPermission {
  Report: UserGroupRole;
  Vendor: UserGroupRole;
  Account: UserGroupRole;
  Customer: UserGroupRole;
  CreditCard: UserGroupRole;
  BankAccount: UserGroupRole;
  BatchUpload: UserGroupRole;
  ApprovalAmount: number;
}

declare global {
  namespace PrismaJson {
    // you can use classes, interfaces, types, etc.
    type UserGroupPermissionJSON = UserGroupPermission;
  }
}
