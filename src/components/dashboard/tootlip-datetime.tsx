import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Label } from "../ui/label";
import { Calendar } from "lucide-react";

export const TooltipDateTime = ({ date }: { date: Date | string }) => {
  const formattedDate = format(new Date(date), "PP", { locale: fr });

  return (
    <TooltipProvider>
      <Tooltip delayDuration={500}>
        <TooltipTrigger asChild>
          <Button variant="outline" className="hover:bg-transparent text-xs">
            {formattedDate}
          </Button>
        </TooltipTrigger>
        <TooltipContent className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          <p>{format(new Date(date), "PPPP, HH:mm", { locale: fr })}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
