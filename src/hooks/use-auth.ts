import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useAuthStore } from "@/store/auth-store";

export const useSyncAuth = () => {
  const { data: session } = useSession();
  const setToken = useAuthStore((s) => s.setToken);

  useEffect(() => {
    if (session?.accessToken) {
      setToken(session.accessToken);
    }
  }, [session]);
};
