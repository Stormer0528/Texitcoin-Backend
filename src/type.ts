export enum UserRole {
  Admin = 'Admin',
}

enum UserGroupRole {
  None = 'None',
  Viewer = 'Viewer',
  Editor = 'Editor',
  Owner = 'Owner',
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
