"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEventsStore } from "@/store/use-events-store";
import { useUsers } from "@/hooks/use-users";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
  Users,
  Trash,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  MapPin,
  Calendar,
  Info,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TooltipDateTime } from "@/components/dashboard/tootlip-datetime";
import Image from "next/image";
import { toast } from "sonner";
import BadgeRole from "@/components/dashboard/badge-role";
import { StatsCards } from "@/components/dashboard/events/stats-cards";
import { PopularEvents } from "@/components/dashboard/events/popular-events";

interface Event {
  id: number;
  userId: number;
  title: string;
  image: string;
  description: string;
  maxParticipants: number;
  location: string;
  date: string;
  createdAt: string;
  updatedAt: string;
  participants: Array<{
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    birthDate: string;
    email: string;
    createdAt: string;
    updatedAt: string;
    avatar: string | null;
    novaPoints: number;
    role: string;
    isBanned: boolean;
    banReason: string | null;
  }>;
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

export default function EventsPage() {
  const {
    events = [],
    selectedEvent,
    error: eventsError,
    meta,
    searchQuery,
    setSearchQuery,
    setSelectedEvent,
    fetchEvents,
    deleteEvent,
    removeParticipant,
  } = useEventsStore();

  const usersQuery = useUsers();
  const queryClient = useQueryClient();
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const {
    data: eventsData = [],
    isLoading,
    error,
  } = useQuery<Event[]>({
    queryKey: ["events", meta?.currentPage || 1],
    queryFn: async () => {
      const { data } = await fetchEvents(meta?.currentPage || 1);
      return data;
    },
    retry: 1,
  });

  const { data: stats } = useQuery({
    queryKey: ["events-stats"],
    queryFn: () => useEventsStore.getState().fetchStats(),
  });

  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    event: null as Event | null,
  });

  const [participantsDialog, setParticipantsDialog] = useState({
    isOpen: false,
    event: null as Event | null,
  });

  const [detailsDialog, setDetailsDialog] = useState({
    isOpen: false,
    event: null as Event | null,
  });

  const [showAllEvents, setShowAllEvents] = useState(false);
  const displayedEvents = showAllEvents ? eventsData : eventsData.slice(0, 9);

  // Filtrage local des événements
  const filteredEvents = eventsData.filter((event: Event) => {
    const searchLower = searchQuery.toLowerCase().trim();
    return (
      event.title.toLowerCase().includes(searchLower) ||
      event.description.toLowerCase().includes(searchLower) ||
      event.location.toLowerCase().includes(searchLower)
    );
  });

  const displayedFilteredEvents = showAllEvents
    ? filteredEvents
    : filteredEvents.slice(0, 9);

  const getUserById = (userId: number | null) => {
    if (!userId) return null;
    if (!usersQuery.data?.data) return null;
    return usersQuery.data.data.find((user) => user.id === userId) || null;
  };

  const handleDeleteEvent = async (eventId: number) => {
    try {
      await deleteEvent(eventId);
      await queryClient.invalidateQueries({ queryKey: ["events"] });
      await queryClient.invalidateQueries({
        queryKey: ["events", meta?.currentPage || 1],
      });
      await queryClient.invalidateQueries({
        queryKey: ["events-stats"],
      });
      setDeleteDialog({
        isOpen: false,
        event: null,
      });
      toast.success("Événement supprimé avec succès");
    } catch (error) {
      console.error("Erreur lors de la suppression de l'événement:", error);
      toast.error(
        "Une erreur est survenue lors de la suppression de l'événement"
      );
    }
  };

  const handleRemoveParticipant = async (eventId: number, userId: number) => {
    try {
      await removeParticipant(eventId, userId);
      setParticipantsDialog({
        isOpen: false,
        event: null,
      });
      await queryClient.invalidateQueries({ queryKey: ["events"] });
      await queryClient.invalidateQueries({
        queryKey: ["events", meta?.currentPage || 1],
      });
      await queryClient.invalidateQueries({
        queryKey: ["events-stats"],
      });
      toast.success("Participant retiré avec succès");
    } catch (error) {
      console.error("Erreur lors du retrait du participant:", error);
      toast.error("Une erreur est survenue lors du retrait du participant");
    }
  };

  const handlePageChange = async (page: number) => {
    await fetchEvents(page);
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
            <PopularEvents />
          </>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Liste des Événements</CardTitle>
            <CardDescription>
              Gérez les événements et leurs participants
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Rechercher un événement..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {isLoading ? (
              <div className="text-center py-8">Chargement...</div>
            ) : displayedFilteredEvents.length === 0 ? (
              <div className="text-center py-8">Aucun événement trouvé</div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {displayedFilteredEvents.map((event: Event) => (
                    <motion.div
                      key={event.id}
                      variants={itemVariants}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                    >
                      <Card className="h-full flex flex-col pt-0">
                        <div className="relative h-48 w-full">
                          {event.image ? (
                            <Image
                              src={event.image}
                              alt={event.title}
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              className="object-cover rounded-t-lg"
                            />
                          ) : (
                            <div className="h-full w-full bg-gray-100 rounded-t-lg flex items-center justify-center">
                              <ImageIcon className="w-16 h-16 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <CardHeader>
                          <CardTitle className="line-clamp-1">
                            {event.title}
                          </CardTitle>
                          <CardDescription className="line-clamp-2">
                            {event.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <MapPin className="w-4 h-4" />
                              <span className="line-clamp-1">
                                {event.location}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <Calendar className="w-4 h-4" />
                              <TooltipDateTime date={event.date} />
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <Users className="w-4 h-4" />
                              <span>
                                {event.participants.length}/
                                {event.maxParticipants} participants
                              </span>
                            </div>
                          </div>
                        </CardContent>
                        <div className="p-4 pt-0 flex gap-2 flex-col xl:flex-row">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() =>
                              setDetailsDialog({
                                isOpen: true,
                                event,
                              })
                            }
                          >
                            <Info className="w-4 h-4 mr-2" />
                            Détails
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() =>
                              setParticipantsDialog({
                                isOpen: true,
                                event,
                              })
                            }
                          >
                            <Users className="w-4 h-4 mr-2" />
                            Participants
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() =>
                              setDeleteDialog({
                                isOpen: true,
                                event,
                              })
                            }
                          >
                            <Trash className="w-4 h-4" />
                            <span className="block xl:hidden">Supprimer</span>
                          </Button>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
                {displayedFilteredEvents.length > 9 && (
                  <div className="flex justify-center mt-6">
                    <Button
                      variant="outline"
                      onClick={() => setShowAllEvents(!showAllEvents)}
                    >
                      {showAllEvents ? "Voir moins" : "Voir plus"}
                    </Button>
                  </div>
                )}
              </>
            )}

            {meta && (
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-gray-500">
                  Total: {meta.total} événements
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

        {/* Details Dialog */}
        <Dialog
          open={detailsDialog.isOpen}
          onOpenChange={() =>
            setDetailsDialog({
              isOpen: false,
              event: null,
            })
          }
        >
          <DialogContent
            className="max-w-3xl"
            aria-describedby="details-dialog-description"
          >
            <DialogHeader>
              <DialogTitle>{detailsDialog.event?.title}</DialogTitle>
              <DialogDescription id="details-dialog-description">
                Détails de l'événement
              </DialogDescription>
            </DialogHeader>
            {detailsDialog.event && (
              <div className="space-y-6">
                <div className="relative h-64 w-full">
                  {detailsDialog.event.image ? (
                    <Image
                      src={detailsDialog.event.image}
                      alt={detailsDialog.event.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover rounded-lg"
                    />
                  ) : (
                    <div className="h-full w-full bg-gray-100 rounded-lg flex items-center justify-center">
                      <ImageIcon className="w-24 h-24 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Description</h3>
                    <p className="text-gray-600 whitespace-pre-wrap">
                      {detailsDialog.event.description}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Participants</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Users className="w-4 h-4" />
                      <span>
                        {detailsDialog.event.participants.length}/
                        {detailsDialog.event.maxParticipants} participants
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Dialog */}
        <Dialog
          open={deleteDialog.isOpen}
          onOpenChange={() =>
            setDeleteDialog({
              isOpen: false,
              event: null,
            })
          }
        >
          <DialogContent aria-describedby="delete-dialog-description">
            <DialogHeader>
              <DialogTitle>Supprimer l'événement</DialogTitle>
              <DialogDescription id="delete-dialog-description">
                Êtes-vous sûr de vouloir supprimer cet événement ? Cette action
                est irréversible.
              </DialogDescription>
            </DialogHeader>
            <div className="flex items-center flex-col justify-center gap-2">
              <Button
                variant="destructive"
                onClick={() =>
                  deleteDialog.event && handleDeleteEvent(deleteDialog.event.id)
                }
                className="bg-red-500 hover:bg-red-600 cursor-pointer justify-center mt-4"
              >
                <Trash className="w-4 h-4" />
                Oui, je souhaite supprimer cet événement
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Participants Dialog */}
        <Dialog
          open={participantsDialog.isOpen}
          onOpenChange={() =>
            setParticipantsDialog({
              isOpen: false,
              event: null,
            })
          }
        >
          <DialogContent
            className="max-w-2xl"
            aria-describedby="participants-dialog-description"
          >
            <DialogHeader>
              <DialogTitle>Participants de l'événement</DialogTitle>
              <DialogDescription id="participants-dialog-description">
                Liste des participants inscrits à cet événement
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto">
              {!participantsDialog.event ||
              participantsDialog.event.participants.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  Aucun participant disponible
                </div>
              ) : (
                participantsDialog.event.participants.map((participant) => (
                  <motion.div
                    key={participant.id}
                    variants={itemVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={
                                participant.avatar ||
                                `https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=${participant.username}`
                              }
                              alt={participant.username}
                            />
                            <AvatarFallback>
                              {participant.username.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col gap-1">
                            <span className="text-sm font-medium">
                              {participant.username}
                            </span>
                            <BadgeRole role={participant.role as any} />
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-sm text-gray-500">
                            {participant.email}
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() =>
                          handleRemoveParticipant(
                            participantsDialog.event!.id,
                            participant.id
                          )
                        }
                      >
                        <Trash className="w-4 h-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
