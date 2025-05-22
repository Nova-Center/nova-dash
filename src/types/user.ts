export type Role = "superadmin" | "admin" | "user";

export type User = {
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
};
