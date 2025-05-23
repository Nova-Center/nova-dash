import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Heart } from "lucide-react";
import { PostsStats } from "@/store/usePostsStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@/hooks/use-user";

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
  hidden: { x: -20, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
};

interface PopularPostsProps {
  stats: PostsStats;
}

export function PopularPosts({ stats }: PopularPostsProps) {
  const mostLikedPost = stats.mostLikedPosts[0];
  const mostCommentedPost = stats.mostCommentedPosts[0];

  console.log("Most liked post:", mostLikedPost);
  console.log("Most commented post:", mostCommentedPost);

  const { data: likedPostUser, isLoading: isLoadingLikedUser } = useUser(
    mostLikedPost?.userId || null
  );
  const { data: commentedPostUser, isLoading: isLoadingCommentedUser } =
    useUser(mostCommentedPost?.userId || null);

  console.log("Liked post user:", likedPostUser);
  console.log("Commented post user:", commentedPostUser);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid gap-4 md:grid-cols-2"
    >
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Post le plus liké
            </CardTitle>
          </CardHeader>
          <CardContent>
            {mostLikedPost ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage
                      src={
                        likedPostUser?.avatar ||
                        `https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=${likedPostUser?.username}`
                      }
                      alt={likedPostUser?.username}
                    />
                    <AvatarFallback>
                      {likedPostUser?.username?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {isLoadingLikedUser
                        ? "Chargement..."
                        : likedPostUser?.username || "Utilisateur inconnu"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {likedPostUser?.role && (
                        <Badge variant="secondary">{likedPostUser.role}</Badge>
                      )}
                    </p>
                  </div>
                </div>
                <p className="text-sm">{mostLikedPost.content}</p>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Heart className="h-4 w-4" />
                  <span>{mostLikedPost.likes?.length || 0} likes</span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Aucun post liké</p>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Post le plus commenté
            </CardTitle>
          </CardHeader>
          <CardContent>
            {mostCommentedPost ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage
                      src={
                        commentedPostUser?.avatar ||
                        `https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=${commentedPostUser?.username}`
                      }
                      alt={commentedPostUser?.username}
                    />
                    <AvatarFallback>
                      {commentedPostUser?.username?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {isLoadingCommentedUser
                        ? "Chargement..."
                        : commentedPostUser?.username || "Utilisateur inconnu"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {commentedPostUser?.role && (
                        <Badge variant="secondary">
                          {commentedPostUser.role}
                        </Badge>
                      )}
                    </p>
                  </div>
                </div>
                <p className="text-sm">{mostCommentedPost.content}</p>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <MessageSquare className="h-4 w-4" />
                  <span>
                    {mostCommentedPost.comments?.length || 0} commentaires
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Aucun commentaire</p>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
