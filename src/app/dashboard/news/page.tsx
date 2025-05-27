"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Search,
  Edit,
  Trash2,
  Eye,
  Plus,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import api from "@/lib/axios";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface Article {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  tags: string[];
  userId: number;
  createdAt: string;
  updatedAt: string;
}

interface Meta {
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

interface ApiResponse {
  meta: Meta;
  data: Article[];
}

export default function NewsPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    articleId: number | null;
    articleTitle: string;
  }>({
    isOpen: false,
    articleId: null,
    articleTitle: "",
  });

  useEffect(() => {
    fetchArticles(currentPage);
  }, [currentPage]);

  useEffect(() => {
    if (!Array.isArray(articles)) return;

    const filtered = articles.filter(
      (article) =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.tags.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );
    setFilteredArticles(filtered);
  }, [articles, searchTerm]);

  const fetchArticles = async (page: number) => {
    try {
      const response = await api.get<ApiResponse>(`/api/v1/news?page=${page}`);
      if (response.status === 200) {
        setArticles(response.data.data || []);
        setMeta(response.data.meta);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des articles:", error);
      setArticles([]);
      setMeta(null);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteArticle = async (id: number) => {
    try {
      const response = await api.delete(`/api/v1/news/${id}`);
      if (response.status === 204) {
        setArticles((prevArticles) =>
          prevArticles.filter((article) => article.id !== id)
        );
        if (articles.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        } else {
          fetchArticles(currentPage);
        }
        setDeleteDialog({ isOpen: false, articleId: null, articleTitle: "" });
        toast.success("Article supprimé avec succès");
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      toast.error("Erreur lors de la suppression");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center"
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Chargement des articles...</p>
        </div>
      </motion.div>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="bg-white dark:bg-slate-900">
          <CardHeader className="flex justify-between items-center mb-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <CardTitle className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                Les actualités
              </CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-400 mt-2">
                Gérez les actualités de Nova
              </CardDescription>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Link href="/dashboard/news/create-article">
                <Button className="bg-blue-600 transition-colors cursor-pointer text-white hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Nouvel Article
                </Button>
              </Link>
            </motion.div>
          </CardHeader>
          <CardContent>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-6"
            >
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input
                  placeholder="Rechercher dans vos articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </motion.div>

            <AnimatePresence mode="wait">
              {filteredArticles.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card>
                    <CardContent className="text-center py-12">
                      <p className="text-slate-500 dark:text-slate-400 mb-4">
                        {articles.length === 0
                          ? "Aucun article trouvé"
                          : "Aucun résultat pour votre recherche"}
                      </p>
                      <Link href="/dashboard/news/create-article">
                        <Button className="bg-blue-600 text-white hover:bg-blue-700 transition-colors cursor-pointer">
                          <Plus className="h-4 w-4 mr-2" />
                          Créer votre premier article
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              ) : (
                <motion.div
                  key="articles"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid gap-6"
                >
                  <AnimatePresence>
                    {filteredArticles.map((article, index) => (
                      <motion.div
                        key={article.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card className="hover:shadow-lg transition-shadow">
                          <CardHeader>
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <CardTitle className="text-xl">
                                    {article.title}
                                  </CardTitle>
                                </div>
                                <CardDescription className="text-base">
                                  {article.excerpt ||
                                    "Pas de résumé disponible"}
                                </CardDescription>
                              </div>
                              <div className="flex gap-2 ml-4">
                                <Link href={`/dashboard/news/${article.id}`}>
                                  <Button variant="outline" size="sm">
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </Link>
                                <Link
                                  href={`/dashboard/news/${article.id}/edit`}
                                >
                                  <Button variant="outline" size="sm">
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                </Link>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    setDeleteDialog({
                                      isOpen: true,
                                      articleId: article.id,
                                      articleTitle: article.title,
                                    })
                                  }
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="flex flex-wrap gap-2 mb-4">
                              {article.tags.map((tag, index) => (
                                <Badge key={index} variant="outline">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            <div className="text-sm text-slate-500 dark:text-slate-400">
                              Créé le {formatDate(article.createdAt)}
                              {article.updatedAt &&
                                article.updatedAt !== article.createdAt && (
                                  <span>
                                    {" "}
                                    • Modifié le {formatDate(article.updatedAt)}
                                  </span>
                                )}
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>

            {meta && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex items-center justify-between mt-6"
              >
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  Total: {meta.total} articles
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!meta.previousPageUrl}
                    onClick={() => setCurrentPage(currentPage - 1)}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm">
                    Page {meta.currentPage} sur {meta.lastPage}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!meta.nextPageUrl}
                    onClick={() => setCurrentPage(currentPage + 1)}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <Dialog
        open={deleteDialog.isOpen}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteDialog({
              isOpen: false,
              articleId: null,
              articleTitle: "",
            });
          }
        }}
      >
        <DialogContent>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                Confirmer la suppression
              </DialogTitle>
              <DialogDescription>
                Êtes-vous sûr de vouloir supprimer l'article "
                {deleteDialog.articleTitle}" ? Cette action est irréversible.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() =>
                  setDeleteDialog({
                    isOpen: false,
                    articleId: null,
                    articleTitle: "",
                  })
                }
              >
                Annuler
              </Button>
              <Button
                variant="destructive"
                onClick={() =>
                  deleteDialog.articleId &&
                  deleteArticle(deleteDialog.articleId)
                }
              >
                Supprimer
              </Button>
            </DialogFooter>
          </motion.div>
        </DialogContent>
      </Dialog>
    </>
  );
}
