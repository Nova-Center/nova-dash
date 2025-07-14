"use client";

import type React from "react";

import { usePathname } from "next/navigation";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { DashboardHeader } from "@/components/dashboard/header";
import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StoreProvider } from "@/store/store-provider";
import ProtectedRoute from "@/components/auth/protected-route";
import { SessionProvider } from "next-auth/react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  Users,
  Coins,
  Calendar,
  ShoppingCart,
  HeartHandshake,
  File,
  Newspaper,
} from "lucide-react";
import WebSocketProvider from "@/components/websocket-provider";

const queryClient = new QueryClient();

const navigation = [
  { name: "Actualités", href: "/dashboard/news", icon: Newspaper },
  { name: "Utilisateurs", href: "/dashboard/users", icon: Users },
  { name: "NovaPoints", href: "/dashboard/points", icon: Coins },
  { name: "Évènements", href: "/dashboard/events", icon: Calendar },
  { name: "Boutique", href: "/dashboard/shop", icon: ShoppingCart },
  { name: "Services", href: "/dashboard/services", icon: HeartHandshake },
  { name: "Posts", href: "/dashboard/posts", icon: File },
];

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  return (
    <SessionProvider>
      <ProtectedRoute>
        <StoreProvider>
          <QueryClientProvider client={queryClient}>
            <WebSocketProvider>
              <div className="min-h-screen bg-[#FEF0ED]">
                <DashboardSidebar navigation={navigation} />
                <div className="flex flex-col md:pl-64">
                  <DashboardHeader
                    currentPath={
                      navigation.find((item) => item.href === pathname)?.name ||
                      "Dashboard"
                    }
                  />
                  <main className="flex-1 p-6 relative">{children}</main>
                </div>
                <Toaster />
              </div>
            </WebSocketProvider>
            <ReactQueryDevtools initialIsOpen={false} />
          </QueryClientProvider>
        </StoreProvider>
      </ProtectedRoute>
    </SessionProvider>
  );
}
