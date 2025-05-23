import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { User } from "@/types/user";

export function useUser(userId: number | null) {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: async () => {
      if (!userId) return null;
      try {
        const response = await api.get<User>(`/api/v1/users/${userId}`);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    enabled: !!userId,
  });
}
