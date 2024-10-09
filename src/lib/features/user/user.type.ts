export interface UserTable {
  id: string;
  username: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface User extends Pick<UserTable, "id" | "username"> {}
