import { create } from "zustand";
import { toast } from "sonner";
import api from "@/lib/axios";
import { User } from "@/types/user";

export interface Meta {
  total: number;
  perPage: number;
  currentPage: number;
  lastPage: number;
  firstPage: number;
  firstPageUrl: string;
  lastPageUrl: string;
  nextPageUrl: string | null;
  previousPageUrl: string | null;
}

export interface Post {
  id: number;
  userId: number | null;
  user: User | null;
  content: string;
  image: string | null;
  createdAt: string;
  updatedAt: string;
  comments: Comment[];
  likes: Like[];
}

export interface Comment {
  id: number;
  postId: number;
  userId: number | null;
  user: User | null;
  content: string;
  createdAt: string;
  updatedAt: string;
  likes: Like[];
}

export interface Like {
  id: number;
  postId: number | null;
  commentId: number | null;
  userId: number | null;
  user: User | null;
  createdAt: string;
  updatedAt: string;
}

export interface PostsStats {
  totalPosts: number;
  totalLikes: number;
  totalComments: number;
  mostLikedPosts: Array<{
    id: number;
    content: string;
    userId: number;
    likes: Array<{
      id: number;
      userId: number;
    }>;
  }>;
  mostCommentedPosts: Array<{
    id: number;
    content: string;
    userId: number;
    comments: Array<{
      id: number;
      userId: number;
      content: string;
    }>;
  }>;
}

interface PostsState {
  posts: Post[];
  selectedPost: Post | null;
  error: string | null;
  meta: Meta | null;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  setSelectedPost: (post: Post | null) => void;
  fetchPosts: (page?: number) => Promise<Post[]>;
  fetchStats: () => Promise<PostsStats>;
  deletePost: (postId: number) => Promise<void>;
  deleteComment: (postId: number, commentId: number) => Promise<void>;
  deleteLike: (postId: number, likeId: number) => Promise<void>;
}

export const usePostsStore = create<PostsState>((set, get) => ({
  posts: [],
  selectedPost: null,
  error: null,
  meta: null,
  searchQuery: "",
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedPost: (post) => set({ selectedPost: post }),
  fetchPosts: async (page = 1) => {
    try {
      const response = await api.get<{ data: Post[]; meta: Meta }>(
        `/api/v1/posts?page=${page}&include=user,comments.user,likes.user`
      );

      set({ posts: response.data.data, meta: response.data.meta, error: null });
      return response.data.data;
    } catch (error) {
      console.error("Error fetching posts:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Une erreur est survenue";
      set({ error: errorMessage, posts: [], meta: null });
      toast.error(errorMessage);
      return [];
    }
  },
  fetchStats: async () => {
    try {
      const response = await api.get<PostsStats>("/api/posts/stats");
      return response.data;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Une erreur est survenue";
      toast.error(errorMessage);
      throw error;
    }
  },
  deletePost: async (postId) => {
    try {
      await api.delete(`/api/v1/posts/${postId}`);
      set((state) => ({
        posts: state.posts.filter((post) => post.id !== postId),
      }));
      toast.success("Post supprimé avec succès");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Une erreur est survenue";
      toast.error(errorMessage);
      throw error;
    }
  },
  deleteComment: async (postId, commentId) => {
    try {
      await api.delete(`/api/v1/posts/${postId}/comments/${commentId}`);
      set((state) => ({
        posts: state.posts.map((post) =>
          post.id === postId
            ? {
                ...post,
                comments: post.comments.filter(
                  (comment) => comment.id !== commentId
                ),
              }
            : post
        ),
      }));
      toast.success("Commentaire supprimé avec succès");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Une erreur est survenue";
      toast.error(errorMessage);
      throw error;
    }
  },
  deleteLike: async (postId, userId) => {
    try {
      await api.post(`/api/v1/posts/${postId}/unlike/${userId}`);
      set((state) => ({
        posts: state.posts.map((post) =>
          post.id === postId
            ? {
                ...post,
                likes: post.likes.filter((like) => like.id !== postId),
              }
            : post
        ),
      }));
      toast.success("Like supprimé avec succès");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Une erreur est survenue";
      toast.error(errorMessage);
      throw error;
    }
  },
}));
