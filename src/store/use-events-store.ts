import api from "@/lib/axios";
import { create } from "zustand";

interface Participant {
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
  role: string;
  isBanned: boolean;
  banReason: string | null;
}

interface Event {
  id: number;
  userId: number;
  title: string;
  image: string;
  description: string;
  maxParticipants: number;
  location: string;
  date: string;
  createdAt: string;
  updatedAt: string;
  participants: Participant[];
}

interface Meta {
  total: number;
  perPage: number;
  currentPage: number;
  lastPage: number;
  firstPage: number;
  firstPageUrl: string;
  lastPageUrl: string;
  nextPageUrl: string | null;
  previousPageUrl: string | null;
}

interface EventStats {
  totalEvents: number;
  totalParticipants: number;
  upcomingEvents: number;
  averageParticipants: number;
  mostPopularEvents: Array<{
    id: number;
    title: string;
    participantCount: number;
  }>;
}

interface EventsState {
  events: Event[];
  meta: Meta | null;
  searchQuery: string;
  selectedEvent: Event | null;
  error: Error | null;
  setSearchQuery: (query: string) => void;
  setSelectedEvent: (event: Event | null) => void;
  fetchEvents: (page?: number) => Promise<{ data: Event[]; meta: Meta }>;
  deleteEvent: (eventId: number) => Promise<void>;
  removeParticipant: (eventId: number, userId: number) => Promise<void>;
  fetchStats: () => Promise<EventStats>;
}

export const useEventsStore = create<EventsState>((set, get) => ({
  events: [],
  meta: null,
  searchQuery: "",
  selectedEvent: null,
  error: null,

  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedEvent: (event) => set({ selectedEvent: event }),

  fetchEvents: async (page = 1) => {
    try {
      const response = await api.get(`/api/v1/events?page=${page}`);
      const { data, meta } = response.data;
      set({
        events: data,
        meta,
        error: null,
      });
      return { data, meta };
    } catch (error) {
      set({ error: error as Error });
      throw error;
    }
  },

  deleteEvent: async (eventId) => {
    try {
      await api.delete(`/api/v1/events/${eventId}`);
      set((state) => ({
        events: state.events.filter((event) => event.id !== eventId),
      }));
    } catch (error) {
      set({ error: error as Error });
      throw error;
    }
  },

  removeParticipant: async (eventId, userId) => {
    try {
      await api.post(`/api/v1/events/${eventId}/unsubscribe/${userId}`);
      set((state) => ({
        events: state.events.map((event) =>
          event.id === eventId
            ? {
                ...event,
                participants: event.participants.filter(
                  (participant) => participant.id !== userId
                ),
              }
            : event
        ),
      }));
    } catch (error) {
      set({ error: error as Error });
      throw error;
    }
  },

  fetchStats: async () => {
    const response = await api.get<EventStats>("/api/v1/events/stats");
    return response.data;
  },
}));
