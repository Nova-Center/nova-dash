import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { User } from "@/types/user";

export function useUser(userId: number | null) {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: async () => {
      if (!userId) return null;
      console.log("Fetching user with ID:", userId);
      try {
        const response = await api.get<User>(`/api/v1/users/${userId}`);
        console.log("User response:", response.data);
        return response.data;
      } catch (error) {
        console.error("Error fetching user:", error);
        throw error;
      }
    },
    enabled: !!userId,
  });
}
