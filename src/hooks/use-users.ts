import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { User } from "@/types/user";

export const useUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await api.get<{ data: User[] }>("/api/v1/users");
      return response.data;
    },
  });
};
