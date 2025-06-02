export type Role = "superadmin" | "admin" | "user";

export interface User {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  avatar: string | null;
  novaPoints: number;
  role: Role;
  isBanned: boolean;
  banReason: string | null;
  isOnline: boolean;
  lastSeenAt: Date | null;
}
