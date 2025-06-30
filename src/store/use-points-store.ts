import { create } from "zustand";
import { toast } from "sonner";
import api from "@/lib/axios";

interface PointHistory {
  id: number;
  userId: number;
  points: number;
  action: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

interface User {
  id: number;
  username: string;
  novaPoints: number;
}

interface PointsStats {
  totalPoints: number;
  averagePoints: number;
  pointsDistribution: {
    range: string;
    count: number;
  }[];
  pointsHistory: {
    date: string;
    total: number;
  }[];
}

interface PointsState {
  users: User[];
  selectedUser: User | null;
  userHistory: PointHistory[];
  error: string | null;
  isLoading: boolean;
  isHistoryLoading: boolean;
  stats: PointsStats | null;
  meta: {
    total: number;
    currentPage: number;
    lastPage: number;
    perPage: number;
  } | null;
  setSelectedUser: (user: User | null) => void;
  fetchUsers: (page?: number) => Promise<User[]>;
  fetchUserHistory: (userId: number) => Promise<void>;
  resetUserHistory: () => void;
  fetchStats: () => Promise<PointsStats>;
  addPoints: (
    userId: number,
    points: number,
    description: string
  ) => Promise<void>;
  removePoints: (
    userId: number,
    points: number,
    description: string
  ) => Promise<void>;
}

export const usePointsStore = create<PointsState>((set, get) => ({
  users: [],
  selectedUser: null,
  userHistory: [],
  error: null,
  isLoading: false,
  isHistoryLoading: false,
  stats: null,
  meta: null,

  setSelectedUser: (user) => set({ selectedUser: user }),

  resetUserHistory: () => set({ userHistory: [], isHistoryLoading: false }),

  fetchUsers: async (page = 1) => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.get(`/api/v1/users?page=${page}`);
      const data = response.data;

      if (response.status !== 200) {
        throw new Error(
          data.message || "Erreur lors de la récupération des utilisateurs"
        );
      }

      set({
        users: data.data,
        meta: {
          total: data.meta.total,
          currentPage: data.meta.current_page,
          lastPage: data.meta.last_page,
          perPage: data.meta.per_page,
        },
      });

      return data.data;
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Une erreur est survenue",
      });
      toast.error("Erreur lors de la récupération des utilisateurs");
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  fetchUserHistory: async (userId: number) => {
    try {
      set({ isHistoryLoading: true, error: null });
      const response = await api.get(`/api/v1/nova-points/history/${userId}`);
      const data = response.data;

      if (response.status !== 200) {
        throw new Error(
          data.message || "Erreur lors de la récupération de l'historique"
        );
      }

      set({ userHistory: data || [] });
    } catch (error) {
      console.error("Error fetching history:", error);
      set({
        error:
          error instanceof Error ? error.message : "Une erreur est survenue",
      });
      toast.error("Erreur lors de la récupération de l'historique");
    } finally {
      set({ isHistoryLoading: false });
    }
  },

  fetchStats: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.get("/api/v1/nova-points/stats");
      const data = response.data;

      if (response.status !== 200) {
        throw new Error(
          data.message || "Erreur lors de la récupération des statistiques"
        );
      }

      set({ stats: data });
      return data;
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Une erreur est survenue",
      });
      toast.error("Erreur lors de la récupération des statistiques");
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  addPoints: async (userId: number, points: number, description: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.post(`/api/v1/nova-points/${userId}/add`, {
        points,
        description,
        action: "CUSTOM_POINTS",
      });

      const data = response.data;

      if (response.status !== 201) {
        throw new Error(data.message || "Erreur lors de l'ajout des points");
      }

      set((state) => ({
        users: state.users.map((user) =>
          user.id === userId
            ? { ...user, novaPoints: user.novaPoints + points }
            : user
        ),
      }));

      toast.success("Points ajoutés avec succès");
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Une erreur est survenue",
      });
      toast.error("Erreur lors de l'ajout des points");
    } finally {
      set({ isLoading: false });
    }
  },

  removePoints: async (userId: number, points: number, description: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.post(`/api/v1/nova-points/${userId}/remove`, {
        points: points,
        description,
        action: "CUSTOM_POINTS",
      });

      const data = response.data;

      if (response.status !== 200) {
        throw new Error(data.message || "Erreur lors du retrait des points");
      }

      set((state) => ({
        users: state.users.map((user) =>
          user.id === userId
            ? { ...user, novaPoints: Math.max(0, user.novaPoints - points) }
            : user
        ),
      }));

      toast.success("Points retirés avec succès");
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Une erreur est survenue",
      });
      toast.error("Erreur lors du retrait des points");
    } finally {
      set({ isLoading: false });
    }
  },
}));
