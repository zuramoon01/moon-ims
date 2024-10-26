export interface UserTable {
  id: string;
  username: string;
  passwordHash: string;
  companyName: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export type User = Pick<UserTable, "id" | "username" | "companyName">;
