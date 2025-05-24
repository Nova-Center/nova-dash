import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Users, Calendar, MapPin, Users2 } from "lucide-react";

interface StatsCardsProps {
  stats: {
    totalEvents: number;
    totalParticipants: number;
    upcomingEvents: number;
    averageParticipants: number;
  };
}

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card className="hover:shadow-lg transition-shadow duration-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-semibold text-primary">
            Total des événements
          </CardTitle>
          <div className="p-2 bg-primary/10 rounded-full">
            <Calendar className="h-5 w-5 text-primary" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold tracking-tight">
            {stats.totalEvents}
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Nombre total d'événements créés
          </p>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow duration-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-semibold text-primary">
            Participants totaux
          </CardTitle>
          <div className="p-2 bg-primary/10 rounded-full">
            <Users className="h-5 w-5 text-primary" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold tracking-tight">
            {stats.totalParticipants}
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Nombre total de participants
          </p>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow duration-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-semibold text-primary">
            Moyenne de participants
          </CardTitle>
          <div className="p-2 bg-primary/10 rounded-full">
            <Users2 className="h-5 w-5 text-primary" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold tracking-tight">
            {stats.averageParticipants}
          </div>
          <p className="text-sm text-muted-foreground mt-2">Par événement</p>
        </CardContent>
      </Card>
    </div>
  );
}
