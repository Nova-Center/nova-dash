"use client";

import { useQuery } from "@tanstack/react-query";
import { useEventsStore } from "@/store/use-events-store";
import { usePostsStore } from "@/store/use-posts-store";
import { usePointsStore } from "@/store/use-points-store";
import { useUsersStore } from "@/store/use-users-store";
import { StatsCards as EventStatsCards } from "@/components/dashboard/events/stats-cards";
import { PopularEvents } from "@/components/dashboard/events/popular-events";
import { StatsCards as PostStatsCards } from "@/components/dashboard/posts/stats-cards";
import { PopularPosts } from "@/components/dashboard/posts/popular-posts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  Users,
  ShieldUser,
  Shield,
  User as UserIcon,
  Coins,
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

export default function DashboardPage() {
  // Fetch events stats
  const { data: eventsStats } = useQuery({
    queryKey: ["events-stats"],
    queryFn: () => useEventsStore.getState().fetchStats(),
  });

  // Fetch posts stats
  const { data: postsStats } = useQuery({
    queryKey: ["posts-stats"],
    queryFn: () => usePostsStore.getState().fetchStats(),
  });

  // Fetch points stats
  const { data: pointsStats } = useQuery({
    queryKey: ["points-stats"],
    queryFn: () => usePointsStore.getState().fetchStats(),
  });

  // Fetch users stats
  const { data: usersStats } = useQuery({
    queryKey: ["users-stats"],
    queryFn: () => useUsersStore.getState().fetchStats(),
  });

  return (
    <div className="container mx-auto space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Tableau de bord</h1>
        <p className="text-sm text-gray-500">
          Vue d'ensemble de votre plateforme
        </p>
      </div>

      {/* Users Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          custom={0}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <Card className="bg-gradient-to-br bg-blue-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Utilisateurs
              </CardTitle>
              <Users className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {usersStats?.totalUsers || 0}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          custom={1}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <Card className="bg-gradient-to-br bg-nova-secondary text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Superadmins</CardTitle>
              <ShieldUser className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {usersStats?.usersByRole?.superadmin || 0}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          custom={2}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <Card className="bg-gradient-to-br bg-yellow-500 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Admins</CardTitle>
              <Shield className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {usersStats?.usersByRole?.admin || 0}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          custom={3}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <Card className="bg-gradient-to-br bg-green-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Utilisateurs
              </CardTitle>
              <UserIcon className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {usersStats?.usersByRole?.user || 0}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* NovaPoints Stats */}
      <motion.div
        custom={4}
        variants={cardVariants}
        initial="hidden"
        animate="visible"
      >
        <Card>
          <CardHeader>
            <CardTitle>Total des Nova Points</CardTitle>
            <CardDescription>
              Somme totale des points distribués
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <Coins className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-3xl font-bold">
                  {pointsStats?.totalPoints.toLocaleString() || 0}
                </p>
                <p className="text-sm text-gray-500">Nova Points</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Events Stats */}
      {eventsStats && (
        <motion.div
          custom={5}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <EventStatsCards stats={eventsStats} />
        </motion.div>
      )}

      {/* Posts Stats */}
      {postsStats && (
        <motion.div
          custom={6}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <PostStatsCards stats={postsStats} />
        </motion.div>
      )}

      {/* Popular Events */}
      <motion.div
        custom={7}
        variants={cardVariants}
        initial="hidden"
        animate="visible"
      >
        <PopularEvents />
      </motion.div>

      {/* Popular Posts */}
      {postsStats && (
        <motion.div
          custom={8}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <PopularPosts stats={postsStats} />
        </motion.div>
      )}
    </div>
  );
}
