"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  usePostsStore,
  Comment as CommentType,
  Like,
} from "@/store/use-posts-store";
import { useUsers } from "@/hooks/use-users";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Search,
  MessageSquare,
  Heart,
  Trash,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TooltipDateTime } from "@/components/dashboard/tootlip-datetime";
import Image from "next/image";
import { toast } from "sonner";
import BadgeRole from "@/components/dashboard/badge-role";
import { StatsCards } from "@/components/dashboard/posts/stats-cards";
import { PopularPosts } from "@/components/dashboard/posts/popular-posts";

interface Comment {
  id: number;
  post_id: number;
  user_id: number;
  content: string;
  likes: {
    id: number;
    comment_id: number;
    user_id: number;
    created_at: string;
    updated_at: string;
  }[];
  created_at: string;
  updated_at: string;
}

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

export default function PostsPage() {
  const {
    posts = [],
    selectedPost,
    error: postsError,
    meta,
    searchQuery,
    setSearchQuery,
    setSelectedPost,
    fetchPosts,
    deletePost,
    deleteComment,
    deleteLike,
  } = usePostsStore();

  const usersQuery = useUsers();
  const queryClient = useQueryClient();

  const {
    data: postsData = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["posts", meta?.currentPage || 1],
    queryFn: () => fetchPosts(meta?.currentPage || 1),
    retry: 1,
  });

  const { data: stats } = useQuery({
    queryKey: ["posts-stats"],
    queryFn: () => usePostsStore.getState().fetchStats(),
  });

  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    post: null as any,
  });

  const [commentDialog, setCommentDialog] = useState({
    isOpen: false,
    post: null as any,
  });

  const [likesDialog, setLikesDialog] = useState({
    isOpen: false,
    post: null as any,
  });

  const filteredPosts = (postsData || []).filter((post) =>
    post.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getUserById = (userId: number | null) => {
    if (!userId) return null;
    if (!usersQuery.data?.data) return null;
    return usersQuery.data.data.find((user) => user.id === userId) || null;
  };

  const handleDeletePost = async (postId: number) => {
    try {
      await deletePost(postId);
      await queryClient.invalidateQueries({ queryKey: ["posts"] });
      setDeleteDialog({
        isOpen: false,
        post: null,
      });
    } catch (error) {
      console.error("Erreur lors de la suppression du post:", error);
      toast.error("Une erreur est survenue lors de la suppression du post");
    }
  };

  const handlePageChange = async (page: number) => {
    await fetchPosts(page);
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-500">Erreur</h2>
          <p className="text-gray-600">
            {error instanceof Error ? error.message : "Une erreur est survenue"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="space-y-8">
        {stats && (
          <>
            <StatsCards stats={stats} />
            <PopularPosts stats={stats} />
          </>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Liste des Posts</CardTitle>
            <CardDescription>
              Gérez les posts et leurs interactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Rechercher un post..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Auteur</TableHead>
                    <TableHead>Image</TableHead>
                    <TableHead>Contenu</TableHead>
                    <TableHead>Commentaires</TableHead>
                    <TableHead>Likes</TableHead>
                    <TableHead>Date de création</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center">
                        Chargement...
                      </TableCell>
                    </TableRow>
                  ) : !postsData || postsData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center">
                        Aucun post trouvé
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredPosts.map((post) => {
                      const postUser = getUserById(post.userId);
                      return (
                        <TableRow key={post.id}>
                          <TableCell>{post.id}</TableCell>
                          <TableCell>
                            {postUser ? (
                              <div className="flex items-center gap-2">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage
                                    src={
                                      postUser.avatar ||
                                      `https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=${postUser.username}`
                                    }
                                    alt={postUser.username}
                                  />
                                  <AvatarFallback>
                                    {postUser.username.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col gap-1">
                                  <BadgeRole role={postUser.role} />
                                  <span className="text-sm font-medium">
                                    {postUser.username}
                                  </span>
                                </div>
                              </div>
                            ) : (
                              <span className="text-sm text-gray-500">
                                Utilisateur inconnu
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            {post.image ? (
                              <div className="relative w-16 h-16">
                                <Image
                                  src={post.image}
                                  alt="Post image"
                                  fill
                                  className="object-cover rounded-md"
                                />
                              </div>
                            ) : (
                              <div className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center">
                                <ImageIcon className="w-8 h-8 text-gray-400" />
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="max-w-md truncate">
                            {post.content}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              {post.comments.length}
                              <MessageSquare className="w-4 h-4" />
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              {post.likes.length}
                              <Heart className="w-4 h-4" />
                            </div>
                          </TableCell>
                          <TableCell>
                            <TooltipDateTime date={post.createdAt} />
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  setCommentDialog({
                                    isOpen: true,
                                    post,
                                  })
                                }
                              >
                                <MessageSquare className="w-4 h-4" />
                                Commentaires
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  setLikesDialog({
                                    isOpen: true,
                                    post,
                                  })
                                }
                              >
                                <Heart className="w-4 h-4" />
                                Likes
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() =>
                                  setDeleteDialog({
                                    isOpen: true,
                                    post,
                                  })
                                }
                              >
                                <Trash className="w-4 h-4" />
                                Supprimer
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>

            {meta && (
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-gray-500">
                  Total: {meta.total} posts
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={meta.currentPage === 1}
                    onClick={() => handlePageChange(meta.currentPage - 1)}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <span className="text-sm">
                    Page {meta.currentPage} sur {meta.lastPage}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={meta.currentPage === meta.lastPage}
                    onClick={() => handlePageChange(meta.currentPage + 1)}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Delete Dialog */}
        <Dialog
          open={deleteDialog.isOpen}
          onOpenChange={() =>
            setDeleteDialog({
              isOpen: false,
              post: null,
            })
          }
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Supprimer le post</DialogTitle>
            </DialogHeader>
            <p>
              Êtes-vous sûr de vouloir supprimer ce post ? Cette action est
              irréversible.
            </p>
            <div className="flex items-center flex-col justify-center gap-2">
              <Button
                variant="destructive"
                onClick={() => handleDeletePost(deleteDialog.post?.id)}
                className="bg-red-500 hover:bg-red-600 cursor-pointer justify-center mt-4"
              >
                <Trash className="w-4 h-4" />
                Oui, je souhaite supprimer ce post
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Comments Dialog */}
        <Dialog
          open={commentDialog.isOpen}
          onOpenChange={() =>
            setCommentDialog({
              isOpen: false,
              post: null,
            })
          }
        >
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Commentaires du post</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto">
              {commentDialog.post?.comments.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  Aucun commentaire disponible
                </div>
              ) : (
                commentDialog.post?.comments.map((comment: CommentType) => {
                  const commentUser = getUserById(comment.userId);
                  return (
                    <motion.div
                      key={comment.id}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {commentUser ? (
                              <>
                                <Avatar className="h-6 w-6">
                                  <AvatarImage
                                    src={
                                      commentUser.avatar ||
                                      `https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=${commentUser.username}`
                                    }
                                    alt={commentUser.username}
                                  />
                                  <AvatarFallback>
                                    {commentUser.username.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-sm font-medium">
                                  {commentUser.username}
                                </span>
                                <BadgeRole role={commentUser.role} />
                              </>
                            ) : (
                              <span className="text-sm text-gray-500">
                                Utilisateur inconnu
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">
                            {comment.content}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-sm text-gray-500">
                              <TooltipDateTime date={comment.createdAt} />
                            </span>
                            <span className="text-sm text-gray-500">
                              • {comment.likes.length} likes
                            </span>
                          </div>
                          {comment.likes.length > 0 && (
                            <div className="mt-2">
                              <p className="text-xs text-gray-500 mb-1">
                                Likes :
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {comment.likes.map((like) => {
                                  const likeUser = getUserById(like.userId);
                                  return (
                                    likeUser && (
                                      <div
                                        key={like.id}
                                        className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full text-xs"
                                      >
                                        <Avatar className="h-4 w-4">
                                          <AvatarImage
                                            src={
                                              likeUser.avatar ||
                                              `https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=${likeUser.username}`
                                            }
                                            alt={likeUser.username}
                                          />
                                          <AvatarFallback>
                                            {likeUser.username.charAt(0)}
                                          </AvatarFallback>
                                        </Avatar>
                                        <span>{likeUser.username}</span>
                                      </div>
                                    )
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            deleteComment(
                              commentDialog.post.id,
                              comment.id
                            ).then(() => {
                              queryClient.invalidateQueries({
                                queryKey: ["posts"],
                              });
                              queryClient.invalidateQueries({
                                queryKey: ["posts-stats"],
                              });
                              setCommentDialog({
                                isOpen: false,
                                post: null,
                              });
                            });
                          }}
                        >
                          <Trash className="w-4 h-4" />
                        </Button>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Likes Dialog */}
        <Dialog
          open={likesDialog.isOpen}
          onOpenChange={() =>
            setLikesDialog({
              isOpen: false,
              post: null,
            })
          }
        >
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Likes du post</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto">
              {likesDialog.post?.likes.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  Aucun like disponible
                </div>
              ) : (
                likesDialog.post?.likes.map((like: Like) => {
                  const likeUser = getUserById(like.userId);
                  return (
                    likeUser && (
                      <motion.div
                        key={like.id}
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                        className="border border-gray-200 rounded-lg p-4"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Avatar className="h-8 w-8">
                                <AvatarImage
                                  src={
                                    likeUser.avatar ||
                                    `https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=${likeUser.username}`
                                  }
                                  alt={likeUser.username}
                                />
                                <AvatarFallback>
                                  {likeUser.username.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex flex-col gap-1">
                                <span className="text-sm font-medium">
                                  {likeUser.username}
                                </span>
                                <BadgeRole role={likeUser.role} />
                              </div>
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-sm text-gray-500">
                                <TooltipDateTime date={like.createdAt} />
                              </span>
                            </div>
                          </div>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              deleteLike(likesDialog.post.id, likeUser.id);
                              setLikesDialog({
                                isOpen: false,
                                post: null,
                              });
                              queryClient.invalidateQueries({
                                queryKey: ["posts"],
                              });
                              queryClient.invalidateQueries({
                                queryKey: ["posts-stats"],
                              });
                            }}
                          >
                            <Trash className="w-4 h-4" />
                          </Button>
                        </div>
                      </motion.div>
                    )
                  );
                })
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
