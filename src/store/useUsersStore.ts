import { create } from "zustand";
import api from "@/lib/axios";
import { User } from "@/types/user";
import { AxiosError } from "axios";

interface Meta {
  total: number;
  perPage: number;
  currentPage: number | null;
  lastPage: number;
  firstPage: number;
  firstPageUrl: string;
  lastPageUrl: string;
  nextPageUrl: string | null;
  previousPageUrl: string | null;
  usersByRole?: {
    superadmin: number;
    admin: number;
    user: number;
  };
}

interface ApiResponse {
  meta: Meta;
  data: User[];
}

interface UsersStore {
  users: User[];
  meta: Meta | null;
  selectedUser: User | null;
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  stats: {
    totalUsers: number;
    usersByRole: {
      superadmin: number;
      admin: number;
      user: number;
    };
  } | null;
  setSearchQuery: (query: string) => void;
  setSelectedUser: (user: User | null) => void;
  fetchUsers: (page?: number) => Promise<ApiResponse>;
  fetchUserStats: () => Promise<void>;
  banUser: (userId: number, reason: string) => Promise<void>;
  unbanUser: (userId: number) => Promise<void>;
  updateUser: (userId: number, data: Partial<User>) => Promise<void>;
  deleteUser: (userId: number) => Promise<void>;
}

export const useUsersStore = create<UsersStore>((set, get) => ({
  users: [],
  meta: null,
  selectedUser: null,
  isLoading: false,
  error: null,
  searchQuery: "",
  stats: null,

  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedUser: (user) => set({ selectedUser: user }),

  fetchUserStats: async () => {
    try {
      const response = await api.get("/api/v1/users/stats");
      set({ stats: response.data });
      return response.data;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch user stats";
      set({ error: errorMessage });
      throw error;
    }
  },

  fetchUsers: async (page = 1) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get<ApiResponse>(`/api/v1/users?page=${page}`);
      const data = response.data;
      set({
        users: data.data,
        meta: data.meta,
        isLoading: false,
      });
      return data;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch users";
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  banUser: async (userId, reason) => {
    try {
      await api.post(`/api/v1/users/${userId}/ban`, {
        reason,
      });
      set((state) => ({
        users: state.users.map((user) =>
          user.id === userId ? { ...user, isBanned: true } : user
        ),
      }));
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to ban user";
      set({ error: errorMessage });
      throw error;
    }
  },

  unbanUser: async (userId) => {
    try {
      await api.post(`/api/v1/users/${userId}/unban`);
      set((state) => ({
        users: state.users.map((user) =>
          user.id === userId ? { ...user, role: "user" } : user
        ),
      }));
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to unban user";
      set({ error: errorMessage });
      throw error;
    }
  },

  updateUser: async (userId, data) => {
    try {
      const headers =
        data instanceof FormData
          ? {
              "Content-Type": "multipart/form-data",
            }
          : {};

      await api.patch(`/api/v1/users/${userId}`, data, { headers });
      set((state) => ({
        users: state.users.map((user) =>
          user.id === userId
            ? {
                ...user,
                ...(data instanceof FormData ? Object.fromEntries(data) : data),
              }
            : user
        ),
      }));
    } catch (error) {
      const errorMessage =
        error instanceof AxiosError
          ? error.response?.data.message
          : "Failed to update user";
      set({ error: errorMessage });
      throw error;
    }
  },

  deleteUser: async (userId) => {
    try {
      await api.delete(`/api/v1/users/${userId}`);
      set((state) => ({
        users: state.users.filter((user) => user.id !== userId),
      }));
    } catch (error) {
      const errorMessage =
        error instanceof AxiosError
          ? error.response?.data.message
          : "Failed to delete user";
      set({ error: errorMessage });
      throw error;
    }
  },
}));
