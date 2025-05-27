"use client";

import type React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Save, Eye, Loader2 } from "lucide-react";
import Link from "next/link";
import remarkGfm from "remark-gfm";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";
import api from "@/lib/axios";
import { toast } from "sonner";
import { z } from "zod";

const schema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  content: z
    .string()
    .min(10, "Le contenu doit contenir au moins 10 caractères"),
  excerpt: z.string().min(10, "Le résumé doit contenir au moins 10 caractères"),
  tags: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function CreateArticlePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      content: "",
      excerpt: "",
      tags: "",
    },
  });

  const watchedContent = watch("content");
  const watchedTags = watch("tags");

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);

    try {
      const response = await api.post("/api/v1/news", {
        ...data,
        tags: data.tags
          ? data.tags
              .split(",")
              .map((tag) => tag.trim())
              .filter(Boolean)
          : [],
      });

      if (response.status === 201) {
        toast.success("Article créé avec succès");
        router.push("/dashboard/news");
      } else {
        toast.error("Erreur lors de la sauvegarde");
        throw new Error("Erreur lors de la sauvegarde");
      }
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Erreur lors de la sauvegarde de l'article");
    } finally {
      setIsLoading(false);
    }
  };

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
            Retour à l'actualités
          </Link>
        </div>

        <Card>
          <CardHeader>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <CardTitle className="text-2xl">
                Créer un Nouvel Article
              </CardTitle>
              <CardDescription>
                Rédigez votre article avec une mise en page professionnelle
              </CardDescription>
            </motion.div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid lg:grid-cols-2 gap-8 w-full">
                {/* Formulaire d'édition */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-6 overflow-hidden"
                >
                  <div>
                    <Label htmlFor="title">Titre de l'article</Label>
                    <Input
                      id="title"
                      {...register("title")}
                      placeholder="Entrez le titre de votre article..."
                      className="mt-2"
                    />
                    {errors.title && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.title.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="excerpt">Résumé (optionnel)</Label>
                    <Textarea
                      id="excerpt"
                      {...register("excerpt")}
                      placeholder="Un bref résumé de votre article..."
                      className="mt-2"
                      rows={3}
                    />
                    {errors.excerpt && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.excerpt.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="tags">
                      Tags (séparés par des virgules)
                    </Label>
                    <Input
                      id="tags"
                      {...register("tags")}
                      placeholder="technologie, web, développement..."
                      className="mt-2"
                    />
                    {watchedTags && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {watchedTags.split(",").map((tag, index) => (
                          <Badge key={index} variant="secondary">
                            {tag.trim()}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="content">Contenu de l'article</Label>
                    <div className="mt-2 text-sm text-slate-600 dark:text-slate-400 mb-2">
                      Utilisez la syntaxe Markdown : # pour les titres,
                      **gras**, *italique*
                    </div>
                    <Textarea
                      id="content"
                      {...register("content")}
                      placeholder={`# Titre principal

## Sous-titre

Votre contenu ici... Utilisez **gras** et *italique* pour la mise en forme.

### Autre section

Plus de contenu...`}
                      className="min-h-[400px] font-mono whitespace-pre-wrap overflow-x-auto resize-none"
                    />
                    {errors.content && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.content.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="bg-blue-600 cursor-pointer hover:bg-blue-700 transition-colors"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    Publier l'article
                  </Button>
                </motion.div>

                {/* Aperçu */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="lg:border-l lg:pl-8 w-full"
                >
                  <h3 className="text-lg font-semibold mb-4">Aperçu</h3>
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border min-h-[500px] w-full">
                    {watchedContent && (
                      <h1 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100 break-words">
                        {watch("title")}
                      </h1>
                    )}

                    {watch("excerpt") && (
                      <p className="text-lg text-slate-600 dark:text-slate-400 mb-6 italic break-words">
                        {watch("excerpt")}
                      </p>
                    )}

                    {watchedTags && (
                      <div className="flex flex-wrap gap-2 mb-6">
                        {watchedTags.split(",").map((tag, index) => (
                          <Badge key={index} variant="outline">
                            {tag.trim()}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <div className="w-full overflow-x-auto">
                      {watchedContent ? (
                        <div className="prose">
                          <Markdown
                            remarkPlugins={[remarkGfm]}
                            rehypePlugins={[rehypeRaw]}
                            components={{
                              code({
                                node,
                                inline,
                                className,
                                children,
                                ...props
                              }: any) {
                                const match = /language-(\w+)/.exec(
                                  className || ""
                                );

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
                            {watchedContent}
                          </Markdown>
                        </div>
                      ) : (
                        <p className="text-slate-400 italic">
                          Le contenu apparaîtra ici...
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </>
  );
}
