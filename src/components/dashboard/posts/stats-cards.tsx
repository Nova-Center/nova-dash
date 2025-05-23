import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Heart, FileText } from "lucide-react";
import { PostsStats } from "@/store/usePostsStore";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
};

interface StatsCardsProps {
  stats: PostsStats;
}

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid gap-4 md:grid-cols-3"
    >
      <motion.div variants={itemVariants}>
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">
              Total Posts
            </CardTitle>
            <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-800 dark:text-blue-200">
              {stats.totalPosts}
            </div>
            <p className="text-xs text-blue-600 dark:text-blue-400">
              Nombre total de posts
            </p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-950 dark:to-pink-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-pink-700 dark:text-pink-300">
              Total Likes
            </CardTitle>
            <Heart className="h-4 w-4 text-pink-600 dark:text-pink-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-pink-800 dark:text-pink-200">
              {stats.totalLikes}
            </div>
            <p className="text-xs text-pink-600 dark:text-pink-400">
              Nombre total de likes
            </p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">
              Total Commentaires
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-green-600 dark:text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-800 dark:text-green-200">
              {stats.totalComments}
            </div>
            <p className="text-xs text-green-600 dark:text-green-400">
              Nombre total de commentaires
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
