import { create } from "zustand";
import { Service, ServicesResponse } from "@/types/service";
import api from "@/lib/axios";

interface ServicesState {
  services: Service[];
  meta: ServicesResponse["meta"] | null;
  isLoading: boolean;
  error: string | null;
  setServices: (response: ServicesResponse) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  fetchServices: (page?: number) => Promise<void>;
  deleteService: (serviceId: number) => Promise<void>;
}

export const useServicesStore = create<ServicesState>((set) => ({
  services: [],
  meta: null,
  isLoading: false,
  error: null,
  setServices: (response) =>
    set({ services: response.data, meta: response.meta }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  fetchServices: async (page = 1) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get<ServicesResponse>(
        `/api/v1/services?page=${page}`
      );
      set({ services: response.data.data, meta: response.data.meta });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch services";
      set({ error: errorMessage });
    } finally {
      set({ isLoading: false });
    }
  },
  deleteService: async (serviceId: number) => {
    try {
      await api.delete(`/api/v1/services/${serviceId}`);
      set((state) => ({
        services: state.services.filter((service) => service.id !== serviceId),
      }));
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete service";
      set({ error: errorMessage });
      throw error;
    }
  },
}));
