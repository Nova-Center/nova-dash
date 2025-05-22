import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { User } from "@/types/user";

export const useUser = (token: string) => {
  return useQuery({
    queryKey: [token],
    queryFn: () => api.get<User>("/api/v1/me"),
  });
};
