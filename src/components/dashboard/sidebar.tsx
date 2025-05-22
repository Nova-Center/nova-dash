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
  Shield,
  ShieldUser,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { signOut } from "next-auth/react";
import api from "@/lib/axios";
import { useUserStore } from "@/store/user-store";
import { Badge } from "../ui/badge";

export function DashboardSidebar() {
  const pathname = usePathname();
  const user = useUserStore((state) => state.user);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

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

  if (!user) {
    return null;
  }

  // Desktop sidebar
  return (
    <>
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex flex-col flex-grow border-r border-gray-200 bg-[#FEF0ED] pt-5 overflow-y-auto">
          <div className="flex items-center justify-center flex-shrink-0 px-4">
            <Link href="/dashboard">
              <Image
                src="/nova-dash-logo.png"
                alt="NovaDash Logo"
                width={150}
                height={50}
                className="w-auto h-auto"
                priority
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
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center">
                <Image
                  src={
                    user?.avatar ||
                    `https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=Felix`
                  }
                  alt="Avatar"
                  width={80}
                  height={80}
                  className="rounded-full size-10"
                />
                <div className="ml-3 flex flex-col gap-1">
                  <Badge
                    variant="destructive"
                    className="bg-secondary text-white text-[10px]"
                  >
                    {user?.role === "admin" && <Shield className="size-4" />}
                    {user?.role === "superadmin" && (
                      <ShieldUser className="size-4" />
                    )}
                    {user?.role.toUpperCase()}
                  </Badge>
                  <p className="text-xs text-gray-500">{user?.username}</p>
                </div>
              </div>
              <div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="bg-white hover:bg-secondary group cursor-pointer hover:text-white transition-colors duration-300"
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
                  <LogOut className="size-4 text-secondary group-hover:text-white transition-colors duration-300" />
                  <span className="sr-only">Déconnexion</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
