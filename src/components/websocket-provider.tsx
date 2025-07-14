"use client";

import { useEffect } from "react";
import { io } from "socket.io-client";
import { useUserStore } from "@/store/user-store";

export default function WebSocketProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    const userId = user?.id;

    if (!userId) return;

    const socket = io("http://localhost:3333", {
      auth: {
        userId,
      },
    });

    socket.emit("private:message", {
      receiverId: 1,
      content: "Hello!",
    });

    socket.on("connect", () => {
      console.log("Connected to WebSocket");
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
