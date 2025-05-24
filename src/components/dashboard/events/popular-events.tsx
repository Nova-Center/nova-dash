import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion, Variants } from "framer-motion";
import { Users, MapPin, Calendar, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { useEventsStore } from "@/store/useEventsStore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useState } from "react";
import { TooltipDateTime } from "@/components/dashboard/tootlip-datetime";

interface PopularEvent {
  id: number;
  title: string;
  participantCount: number;
}

interface Event {
  id: number;
  title: string;
  image: string;
  description: string;
  location: string;
  date: string;
  maxParticipants: number;
  participants: Array<{
    id: number;
    username: string;
    avatar: string | null;
    role: string;
  }>;
}

interface Stats {
  totalEvents: string;
  averageParticipants: number;
  mostPopularEvents: PopularEvent[];
  eventsByMonth: Array<{
    month: string;
    count: number;
  }>;
  totalParticipants: number;
}

const cardVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: (i: number) => ({
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
      delay: i * 0.1,
    },
  }),
};

export function PopularEvents() {
  const [selectedEvent, setSelectedEvent] = useState<PopularEvent | null>(null);
  const { data: stats } = useQuery<Stats>({
    queryKey: ["events-stats"],
    queryFn: () => useEventsStore.getState().fetchStats(),
  });

  const { data: events } = useQuery<Event[]>({
    queryKey: ["events"],
    queryFn: async () => {
      const allEvents: Event[] = [];
      let currentPage = 1;
      let hasMorePages = true;

      while (hasMorePages) {
        const response = await useEventsStore
          .getState()
          .fetchEvents(currentPage);
        allEvents.push(...response.data);

        hasMorePages = currentPage < response.meta.lastPage;
        currentPage++;
      }

      return allEvents;
    },
    enabled: !!stats?.mostPopularEvents?.length,
  });

  const selectedEventDetails = selectedEvent
    ? events?.find((event) => event.id === selectedEvent.id)
    : null;

  if (!stats?.mostPopularEvents?.length || !events) {
    return null;
  }

  // Trier les événements populaires par nombre de participants
  const sortedPopularEvents = stats.mostPopularEvents
    .map((event) => {
      const eventDetails = events.find((e) => e.id === event.id);
      return eventDetails ? { ...event, ...eventDetails } : null;
    })
    .filter((event): event is NonNullable<typeof event> => event !== null)
    .sort((a, b) => b.participantCount - a.participantCount);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Événements populaires</CardTitle>
          <CardDescription>
            Les événements avec le plus de participants
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {sortedPopularEvents.slice(0, 3).map((event, index) => (
              <motion.div
                key={event.id}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                custom={index}
                className="relative group cursor-pointer"
                onClick={() => setSelectedEvent(event)}
              >
                <div className="relative h-48 w-full overflow-hidden rounded-lg">
                  {event.image ? (
                    <>
                      <Image
                        src={event.image}
                        alt={event.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform group-hover:scale-110 blur-[2px]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-br from-black/60 to-black/40" />
                    </>
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600" />
                  )}
                  <div className="absolute inset-0 p-6 flex flex-col justify-between">
                    <h3 className="font-semibold text-xl text-white line-clamp-2">
                      {event.title}
                    </h3>
                    <div className="flex items-center gap-2 text-white/90">
                      <Users className="w-5 h-5" />
                      <span className="text-lg font-medium">
                        {event.participantCount} participants
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog
        open={!!selectedEvent}
        onOpenChange={() => setSelectedEvent(null)}
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{selectedEvent?.title}</DialogTitle>
            {selectedEventDetails && (
              <div className="space-y-1 mt-2">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <MapPin className="w-4 h-4" />
                  {selectedEventDetails.location}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="w-4 h-4" />
                  <TooltipDateTime date={selectedEventDetails.date} />
                </div>
              </div>
            )}
          </DialogHeader>
          {selectedEventDetails && (
            <div className="space-y-6">
              <div className="relative h-64 w-full">
                {selectedEventDetails.image ? (
                  <Image
                    src={selectedEventDetails.image}
                    alt={selectedEventDetails.title}
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
                    {selectedEventDetails.description}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Participants</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Users className="w-4 h-4" />
                    <span>
                      {selectedEventDetails.participants.length}/
                      {selectedEventDetails.maxParticipants} participants
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
