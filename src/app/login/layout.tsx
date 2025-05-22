"use client";

import { SessionProvider, useSession } from "next-auth/react";
import DisconnectedRoute from "@/components/auth/disconnected-route";

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <DisconnectedRoute>{children}</DisconnectedRoute>
    </SessionProvider>
  );
}
