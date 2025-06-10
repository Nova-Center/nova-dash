import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { User } from "@/types/user";

export const useUsersNoPagination = () => {
  return useQuery({
    queryKey: ["users-no-pagination"],
    queryFn: async () => {
      const response = await api.get<User[]>("/api/v1/users/no-pagination");
      return response.data;
    },
  });
};
