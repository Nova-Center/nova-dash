"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { ShopItemForm } from "@/components/shop/ShopItemForm";
import { useUsersNoPagination } from "@/hooks/use-users-no-pagination";
import api from "@/lib/axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface User {
  id: number;
  name: string;
  email: string;
}

interface ShopItem {
  id: number;
  ownerId: number;
  clientId: number | null;
  name: string;
  description: string;
  price: number;
  image: string;
  datePurchase: string;
}

interface PaginationMeta {
  total: number;
  perPage: number;
  currentPage: number | null;
  lastPage: number;
  firstPage: number;
  firstPageUrl: string;
  lastPageUrl: string;
  nextPageUrl: string | null;
  previousPageUrl: string | null;
}

interface ApiResponse {
  meta: PaginationMeta;
  data: ShopItem[];
}

const getItems = async (page: number = 1) => {
  const response = await api.get<ApiResponse>(
    `/api/v1/shop-items?page=${page}`
  );
  return response.data;
};

export default function ShopPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ShopItem | undefined>();
  const queryClient = useQueryClient();

  const { data: users } = useUsersNoPagination();

  const {
    data,
    isLoading: isLoadingItems,
    error,
  } = useQuery<ApiResponse>({
    queryKey: ["items", currentPage],
    queryFn: () => getItems(currentPage),
  });

  const createMutation = useMutation({
    mutationFn: (formData: FormData) => {
      const newItem: Omit<ShopItem, "id" | "datePurchase" | "clientId"> = {
        ownerId: parseInt(formData.get("ownerId") as string),
        name: formData.get("name") as string,
        description: formData.get("description") as string,
        price: parseInt(formData.get("price") as string),
        image: formData.get("image") as string,
      };
      return api.post("/api/v1/shop-items", newItem);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
      setIsFormOpen(false);
      toast.success("Article créé avec succès");
    },
    onError: (error) => {
      toast.error("Erreur lors de la création de l'article");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (item: ShopItem) =>
      api.put(`/api/v1/shop-items/${item.id}`, item),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
      setIsFormOpen(false);
      setSelectedItem(undefined);
      toast.success("Article modifié avec succès");
    },
    onError: (error) => {
      toast.error("Erreur lors de la modification de l'article");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/api/v1/shop-items/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
      toast.success("Article supprimé avec succès");
    },
    onError: (error) => {
      toast.error("Erreur lors de la suppression de l'article");
    },
  });

  const handleSubmit = (formData: FormData) => {
    if (selectedItem) {
      updateMutation.mutate({
        id: selectedItem.id,
        ownerId: parseInt(formData.get("ownerId") as string),
        name: formData.get("name") as string,
        description: formData.get("description") as string,
        price: parseInt(formData.get("price") as string),
        image: formData.get("image") as string,
        datePurchase: selectedItem.datePurchase,
        clientId: selectedItem.clientId,
      });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (item: ShopItem) => {
    setSelectedItem(item);
    setIsFormOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet article ?")) {
      deleteMutation.mutate(id);
    }
  };

  const getUserById = (userId: number | null) => {
    if (!userId) return null;
    return users?.find((user) => user.id === userId);
  };

  if (isLoadingItems) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!data || !users) {
    return <div>No data available</div>;
  }

  const { meta, data: items } = data;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Liste des articles de la boutique</CardTitle>
            <CardDescription>Gérez la boutique</CardDescription>
          </div>
          <Button onClick={() => setIsFormOpen(true)}>
            Ajouter un article
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item: ShopItem) => {
              const owner = getUserById(item.ownerId);
              const buyer = item.clientId ? getUserById(item.clientId) : null;

              return (
                <Card key={item.id} className="overflow-hidden">
                  <div className="relative h-48 w-full">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={500}
                      height={500}
                      priority
                      className="object-cover"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle>{item.name}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {item.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold">
                          {item.price} €
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {new Date(item.datePurchase).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">
                            Propriétaire:
                          </span>
                          <span className="text-sm">
                            {owner?.username || "Inconnu"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">Statut:</span>
                          {buyer ? (
                            <Badge variant="secondary">
                              Acheté par {buyer.username}
                            </Badge>
                          ) : (
                            <Badge variant="outline">Disponible</Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(item)}
                        >
                          Modifier
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(item.id)}
                        >
                          Supprimer
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="mt-8">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    className={
                      meta.previousPageUrl
                        ? ""
                        : "pointer-events-none opacity-50"
                    }
                  />
                </PaginationItem>

                {Array.from({ length: meta.lastPage }, (_, i) => i + 1).map(
                  (page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href="#"
                        onClick={() => setCurrentPage(page)}
                        isActive={currentPage === page}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  )
                )}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={() =>
                      setCurrentPage((prev) =>
                        Math.min(prev + 1, meta.lastPage)
                      )
                    }
                    className={
                      meta.nextPageUrl ? "" : "pointer-events-none opacity-50"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>

      <ShopItemForm
        item={selectedItem}
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedItem(undefined);
        }}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
