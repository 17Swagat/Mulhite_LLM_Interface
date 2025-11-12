import { CircleDollarSignIcon } from "lucide-react";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/ui/hover-card";

export function CreditsLeft({ credits }: { credits: number }) {
  return (
    <HoverCard openDelay={100} closeDelay={100}>
      <HoverCardTrigger className="fixed top-0 right-8" asChild>
        <CircleDollarSignIcon
          size={38}
          className="text-white bg-green-800 rounded-full mt-3"
        />
      </HoverCardTrigger>
      <HoverCardContent className="w-full z-50000 p-1! bg-linear-to-r from-[#2dd4bf]  to-[#95b5e0]  border-0!">
        <div className="flex gap-2 bg-black text-white text-[18px] p-1 rounded-sm">
          <span className="underline">Credits-Left:</span>
          <span className="text-green-500 font-semibold">
            <span className="text-white">$</span>
            {credits}
          </span>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
