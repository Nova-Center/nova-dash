"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  LayoutDashboard,
  Users,
  Calendar,
  Settings,
  AlertTriangle,
  Coins,
  Menu,
  X,
  ShoppingCart,
  File,
  HeartHandshake,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { signOut } from "next-auth/react";
import api from "@/lib/axios";
import { useUserStore } from "@/store/user-store";

export function DashboardSidebar() {
  const pathname = usePathname();
  const user = useUserStore((state) => state.user);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    console.log("User", useUserStore.getState().user);
  }, [user]);

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Utilisateurs", href: "/dashboard/users", icon: Users },
    {
      name: "Signalements",
      href: "/dashboard/reports",
      icon: AlertTriangle,
    },
    { name: "NovaPoints", href: "/dashboard/points", icon: Coins },
    { name: "Évènements", href: "/dashboard/events", icon: Calendar },
    { name: "Boutique", href: "/dashboard/shop", icon: ShoppingCart },
    { name: "Services", href: "/dashboard/services", icon: HeartHandshake },
    { name: "Posts", href: "/dashboard/posts", icon: File },
    { name: "Paramètres", href: "/dashboard/settings", icon: Settings },
  ];

  // Animation variants
  const sidebarVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
      },
    },
  };

  // Mobile sidebar
  const MobileSidebar = () => (
    <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="size-6" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 bg-[#FEF0ED] w-72">
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
            <div className="flex items-center gap-2">
              <Image
                src="/nova-dash-logo.png"
                alt="NovaDash Logo"
                width={120}
                height={40}
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileOpen(false)}
            >
              <X className="size-5" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
          <ScrollArea className="flex-1 px-2 py-4">
            <nav className="flex flex-col gap-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    pathname === item.href
                      ? "bg-[#E74B3B] text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => setIsMobileOpen(false)}
                >
                  <item.icon className="size-5" />
                  {item.name}
                </Link>
              ))}
            </nav>
          </ScrollArea>
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center">
              <div className="size-8 rounded-full bg-gray-200" />
              <div className="ml-3">
                <p className="text-sm font-medium">Admin User</p>
                <p className="text-xs text-gray-500">admin@example.com</p>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );

  // Desktop sidebar
  return (
    <>
      <MobileSidebar />

      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex flex-col flex-grow border-r border-gray-200 bg-[#FEF0ED] pt-5 overflow-y-auto">
          <div className="flex items-center justify-center flex-shrink-0 px-4">
            <Link href="/dashboard">
              <Image
                src="/nova-dash-logo.png"
                alt="NovaDash Logo"
                width={150}
                height={50}
              />
            </Link>
          </div>
          <div className="mt-5 flex-grow flex flex-col">
            <motion.nav
              className="flex-1 px-2 pb-4 space-y-2"
              initial="hidden"
              animate="visible"
              variants={sidebarVariants}
            >
              {navigation.map((item) => (
                <motion.div key={item.name} variants={itemVariants}>
                  <Link
                    href={item.href}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      pathname === item.href
                        ? "bg-[#E74B3B] text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <item.icon
                      className={`mr-3 flex-shrink-0 size-5 ${
                        pathname === item.href ? "text-white" : "text-gray-500"
                      }`}
                    />
                    {item.name}
                  </Link>
                </motion.div>
              ))}
            </motion.nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <div className="flex items-center">
              <div className="size-8 rounded-full bg-gray-200" />
              <div className="flex items-center justify-between w-full gap-2">
                <div className="ml-3">
                  <p className="text-sm font-medium">
                    {user?.username} {user?.lastName[0]}.
                  </p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
                <div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="bg-white hover:bg-red-500 group cursor-pointer hover:text-white transition-colors duration-300"
                    onClick={async () => {
                      try {
                        await api.post("/api/v1/auth/logout");

                        await signOut({
                          redirect: true,
                          callbackUrl: "/login",
                        });
                      } catch (error) {
                        console.error("Erreur lors de la déconnexion:", error);
                      }
                    }}
                  >
                    <LogOut className="size-4 text-red-500 group-hover:text-white transition-colors duration-300" />
                    <span className="sr-only">Déconnexion</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
