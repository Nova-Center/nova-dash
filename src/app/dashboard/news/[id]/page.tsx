"use client";

import api from "@/lib/axios";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { use } from "react";
import { motion } from "framer-motion";

export default function NewsArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { data: session } = useSession();
  const [article, setArticle] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const resolvedParams = use(params);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await api.get(`/api/v1/news/${resolvedParams.id}`);
        setArticle(response.data);
      } catch (error) {
        console.error("Erreur lors du chargement de l'article:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (session?.accessToken) {
      fetchArticle();
    }
  }, [resolvedParams.id, session]);

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
        className="min-h-screen flex items-center justify-center"
      >
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#E74B3B]"></div>
      </motion.div>
    );
  }

  if (!article) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="min-h-screen flex items-center justify-center"
      >
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            Article non trouvé
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            L'article que vous recherchez n'existe pas ou a été supprimé.
          </p>
          <Link
            href="/dashboard/news"
            className="inline-flex items-center text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour aux actualités
          </Link>
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
        <div className="mb-6">
          <Link
            href="/dashboard/news"
            className="inline-flex items-center text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour aux actualités
          </Link>
        </div>

        <Card>
          <CardHeader>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <CardTitle className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                {article.title}
              </CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-400 mt-2">
                Publié le {formatDate(article.createdAt)}
                {article.updatedAt &&
                  article.updatedAt !== article.createdAt && (
                    <span> • Modifié le {formatDate(article.updatedAt)}</span>
                  )}
              </CardDescription>
            </motion.div>
          </CardHeader>
          <CardContent>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {article.excerpt && (
                <p className="text-lg text-slate-600 dark:text-slate-400 mb-6 italic">
                  {article.excerpt}
                </p>
              )}

              {article.tags && article.tags.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex flex-wrap gap-2 mb-6"
                >
                  {article.tags.map((tag: string, index: number) => (
                    <Badge key={index} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="prose dark:prose-invert max-w-none"
              >
                <Markdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]}
                  components={{
                    code({ node, inline, className, children, ...props }: any) {
                      const match = /language-(\w+)/.exec(className || "");

                      return !inline && match ? (
                        <SyntaxHighlighter
                          style={dracula}
                          PreTag="div"
                          language={match[1]}
                          {...props}
                        >
                          {String(children).replace(/\n$/, "")}
                        </SyntaxHighlighter>
                      ) : (
                        <code className={className} {...props}>
                          {children}
                        </code>
                      );
                    },
                  }}
                >
                  {article.content}
                </Markdown>
              </motion.div>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </>
  );
}
