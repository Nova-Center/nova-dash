"use client";

import { useEffect } from "react";
import { io } from "socket.io-client";
import { useUserStore } from "@/store/user-store";
import { toast } from "sonner";

export default function WebSocketProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    const userId = user?.id;

    if (!userId) return;

    const socket = io(process.env.NEXT_PUBLIC_API_URL || "", {
      auth: {
        userId,
      },
      transports: ["websocket", "polling"],
      timeout: 10000,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.on("connect", () => {
      console.log("Connected to WebSocket");
    });

    socket.on("connect_error", (error) => {
      console.error("WebSocket connection error:", error);
      toast.error("Failed to connect to real-time updates");
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from WebSocket");
    });

    return () => {
      socket.disconnect();
    };
  }, [user]);

  return <>{children}</>;
}
