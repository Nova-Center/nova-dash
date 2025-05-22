"use client";

import type React from "react";

import { usePathname } from "next/navigation";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { DashboardHeader } from "@/components/dashboard/header";
import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StoreProvider } from "@/lib/store-provider";

const queryClient = new QueryClient();

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const currentPath = pathname.split("/").pop() || "overview";

  return (
    <StoreProvider>
      <QueryClientProvider client={queryClient}>
        <div className="min-h-screen bg-[#FEF0ED]">
          <DashboardSidebar />
          <div className="flex flex-col md:pl-64">
            <DashboardHeader currentPath={currentPath} />
            <main className="flex-1 p-6">{children}</main>
          </div>
          <Toaster />
        </div>
      </QueryClientProvider>
    </StoreProvider>
  );
}
