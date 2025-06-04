"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useServicesStore } from "@/store/services";
import {
  Calendar,
  Search,
  User,
  Plus,
  ChevronLeft,
  ChevronRight,
  Trash2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useUsers } from "@/hooks/use-users";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function ServicesPage() {
  const { services, meta, isLoading, error, fetchServices, deleteService } =
    useServicesStore();
  const { data: usersData } = useUsers();
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    serviceId: number | null;
  }>({
    isOpen: false,
    serviceId: null,
  });

  useEffect(() => {
    fetchServices().catch((error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "Erreur lors du chargement des services"
      );
    });
  }, [fetchServices]);

  const getUserById = (userId: number | null) => {
    if (!userId || !usersData?.data) return null;
    return usersData.data.find((user) => user.id === userId) || null;
  };

  const filteredServices = services.filter(
    (service) =>
      service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteService = async (serviceId: number) => {
    try {
      await deleteService(serviceId);
      toast.success("Service supprimé avec succès");
      setDeleteDialog({ isOpen: false, serviceId: null });
    } catch (error) {
      toast.error("Erreur lors de la suppression du service");
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-[200px]" />
          <Skeleton className="h-10 w-[300px]" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3 mt-2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="container mx-auto py-8"
      >
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600">Erreur</h2>
          <p className="text-gray-600">{error}</p>
          <Button
            onClick={() => fetchServices()}
            className="mt-4 bg-red-600 hover:bg-red-700 text-white"
          >
            Réessayer
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="container mx-auto py-8 space-y-6"
    >
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <CardTitle>Services</CardTitle>
              <CardDescription>
                {meta?.total} services au total • Page {meta?.currentPage || 1}{" "}
                sur {meta?.lastPage || 1}
              </CardDescription>
            </div>
            <div className="flex gap-4 w-full md:w-auto">
              <div className="relative flex-1 md:flex-none">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un service..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Nouveau Service
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence>
              {filteredServices.map((service, index) => {
                const owner = getUserById(service.ownerId);
                const volunteer = getUserById(service.volunteerId);

                return (
                  <motion.div
                    key={service.id}
                    custom={index}
                    variants={cardVariants}
                    whileHover={{ scale: 1.02 }}
                    className="group"
                  >
                    <Card className="hover:shadow-lg transition-all duration-300">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="line-clamp-1">
                              {service.title}
                            </CardTitle>
                            <CardDescription className="line-clamp-2 mt-1">
                              {service.description}
                            </CardDescription>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={
                                service.volunteerId ? "default" : "secondary"
                              }
                            >
                              {service.volunteerId ? "Assigné" : "Disponible"}
                            </Badge>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() =>
                                setDeleteDialog({
                                  isOpen: true,
                                  serviceId: service.id,
                                })
                              }
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-col gap-4">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {format(new Date(service.date), "PPP", {
                                locale: fr,
                              })}
                            </span>
                          </div>

                          <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4" />
                              <span className="text-sm font-medium">
                                Propriétaire :
                              </span>
                              {owner ? (
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <div className="flex items-center gap-2">
                                        <Avatar className="h-6 w-6">
                                          <AvatarImage
                                            src={
                                              owner.avatar ||
                                              `https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=${owner.username}`
                                            }
                                            alt={owner.username}
                                          />
                                          <AvatarFallback>
                                            {owner.username[0]}
                                          </AvatarFallback>
                                        </Avatar>
                                        <span className="text-sm">
                                          {owner.username}
                                        </span>
                                      </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>
                                        {owner.firstName} {owner.lastName}
                                      </p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              ) : (
                                <span className="text-sm text-muted-foreground">
                                  Inconnu
                                </span>
                              )}
                            </div>

                            {volunteer && (
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4" />
                                <span className="text-sm font-medium">
                                  Bénévole :
                                </span>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <div className="flex items-center gap-2">
                                        <Avatar className="h-6 w-6">
                                          <AvatarImage
                                            src={
                                              volunteer.avatar ||
                                              `https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=${volunteer.username}`
                                            }
                                            alt={volunteer.username}
                                          />
                                          <AvatarFallback>
                                            {volunteer.username[0]}
                                          </AvatarFallback>
                                        </Avatar>
                                        <span className="text-sm">
                                          {volunteer.username}
                                        </span>
                                      </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>
                                        {volunteer.firstName}{" "}
                                        {volunteer.lastName}
                                      </p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>

          {meta && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-center gap-2 mt-8"
            >
              <Button
                variant="outline"
                disabled={!meta.previousPageUrl}
                onClick={() =>
                  fetchServices(meta.currentPage ? meta.currentPage - 1 : 1)
                }
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Précédent
              </Button>
              <Button
                variant="outline"
                disabled={!meta.nextPageUrl}
                onClick={() =>
                  fetchServices(meta.currentPage ? meta.currentPage + 1 : 2)
                }
              >
                Suivant
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
          )}
        </CardContent>
      </Card>

      <AlertDialog
        open={deleteDialog.isOpen}
        onOpenChange={(isOpen: boolean) =>
          setDeleteDialog({ isOpen, serviceId: null })
        }
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Le service sera définitivement
              supprimé.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                deleteDialog.serviceId &&
                handleDeleteService(deleteDialog.serviceId)
              }
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
}
