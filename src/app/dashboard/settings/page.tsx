"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import {
  LayoutDashboard,
  Users,
  AlertTriangle,
  Coins,
  Calendar,
  ShoppingCart,
  HeartHandshake,
  File,
} from "lucide-react";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: "easeOut",
    },
  }),
};

export default function SettingsPage() {
  return (
    <div className="container mx-auto space-y-8 py-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">
          <span className="font-bold text-yellow-500">
            <span className="flex items-center gap-2 mb-12">
              <AlertTriangle className="w-4 h-4" />
              Work In Progress
            </span>
          </span>
          Paramètres
        </h1>
        <p className="text-sm text-gray-500">
          Gérez les paramètres de votre application
        </p>
      </div>

      <motion.div
        custom={0}
        variants={cardVariants}
        initial="hidden"
        animate="visible"
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LayoutDashboard className="w-5 h-5" />
              Modules du Dashboard
            </CardTitle>
            <CardDescription>
              Activez ou désactivez les différents modules du dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Utilisateurs
                </Label>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Signalements
                </Label>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <Coins className="w-4 h-4" />
                  NovaPoints
                </Label>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Évènements
                </Label>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4" />
                  Boutique
                </Label>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <HeartHandshake className="w-4 h-4" />
                  Services
                </Label>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <File className="w-4 h-4" />
                  Posts
                </Label>
                <Switch />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
