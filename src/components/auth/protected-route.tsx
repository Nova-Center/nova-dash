"use client";

import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useUserStore } from "@/store/user-store";
import api from "@/lib/axios";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }

    if (status === "authenticated") {
      const getUser = async () => {
        const res = await api.get("/api/v1/me").catch((err) => {
          if (err.response.status === 401) {
            signOut();
          }
        });

        if (res) {
          setUser(res.data);
        }
      };
      getUser();
    }
  }, [status, router, session, setUser]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#E74B3B]"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return <>{children}</>;
}
