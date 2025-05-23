"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { LogOut, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import api from "@/lib/axios";
import { useUserStore } from "@/store/user-store";
import BadgeRole from "@/components/dashboard/badge-role";
import { NavigationItem } from "@/types/navigation.interface";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useState } from "react";

export function DashboardSidebar({
  navigation,
}: {
  navigation: NavigationItem[];
}) {
  const pathname = usePathname();
  const user = useUserStore((state) => state.user);
  const [isOpen, setIsOpen] = useState(false);

  if (!user) {
    return null;
  }

  const SidebarContent = () => (
    <div className="flex flex-col flex-grow border-r border-gray-200 bg-[#FEF0ED] pt-5 overflow-y-auto h-full">
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
        <nav className="flex-1 px-2 pb-4 space-y-2">
          {navigation.map((item) => (
            <div key={item.name}>
              <Link
                href={item.href}
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  pathname === item.href
                    ? "bg-[#E74B3B] text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => setIsOpen(false)}
              >
                <item.icon
                  className={`mr-3 flex-shrink-0 size-5 ${
                    pathname === item.href ? "text-white" : "text-gray-500"
                  }`}
                />
                {item.name}
              </Link>
            </div>
          ))}
        </nav>
      </div>
      <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center">
            <Image
              src={
                user?.avatar ||
                `https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=${user?.username}`
              }
              alt="Avatar"
              width={80}
              height={80}
              className="rounded-full size-10 border border-gray-200"
            />
            <div className="ml-3 flex flex-col gap-1">
              <BadgeRole role={user?.role} />
              <p className="text-xs text-gray-500">{user?.username}</p>
            </div>
          </div>
          <div>
            <Button
              variant="ghost"
              size="icon"
              className="bg-white hover:bg-nova-secondary group cursor-pointer hover:text-white transition-colors duration-300"
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
              <LogOut className="size-4 text-nova-secondary group-hover:text-white transition-colors duration-300" />
              <span className="sr-only">Déconnexion</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Sidebar */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="bg-white">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-72">
            <SheetTitle asChild>
              <VisuallyHidden>Menu de navigation</VisuallyHidden>
            </SheetTitle>
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <SidebarContent />
      </div>
    </>
  );
}
