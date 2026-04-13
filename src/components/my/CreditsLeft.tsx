import { CircleDollarSignIcon } from "lucide-react";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/ui/hover-card";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function CreditsLeft({
  credits,
  isTouchDevice,
}: {
  credits: number;
  isTouchDevice: boolean;
}) {
  const iconElement = (
    <CircleDollarSignIcon
      size={34}
      className="text-emerald-400 bg-emerald-500/15 border border-emerald-500/20 rounded-full mt-3 hover:bg-emerald-500/25 transition-all duration-200 p-1"
    />
  );

  const contentElement = (
    <div
      className="flex gap-2 bg-slate-900 text-white text-[16px] p-2 rounded-lg border border-white/5"
    >
      <span className="underline underline-offset-3">Credits-Left</span>
      <span className="text-emerald-400 font-semibold">
        <span className="text-white">$</span>
        {credits ?? 0}
        {/* THIS FIXED THE ISSUE of getting nothing when putting an Invalid API KEY & showing 0 when API-KEY is removed.!! Now, for invalid and empty API Key it will show 0.*/}
      </span>
    </div>
  );

  if (isTouchDevice) {
    return (
      <Popover>
        <PopoverTrigger asChild>{iconElement}</PopoverTrigger>
        {/* <PopoverContent className="w-full z-50000 p-1! bg-linear-to-r from-[#2dd4bf] to-[#95b5e0] border-0!"> */}
        {/* <PopoverContent className="w-full z-50000 p-1! bg-linear-to-r from-[#8e2dd4] to-[#95b5e0] border-0!"> */}
        <PopoverContent
          className="w-full z-50000 p-1! bg-slate-900 border border-white/10!"
        >
          {contentElement}
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <HoverCard openDelay={100} closeDelay={100}>
      <HoverCardTrigger asChild>
        <div>{iconElement}</div>
      </HoverCardTrigger>
      {/* <HoverCardContent className="w-full z-50000 p-1! bg-linear-to-r from-[#2dd4bf] to-[#95b5e0] border-0!"> */}
      <HoverCardContent
        className="w-full z-50000 p-1! bg-slate-900 border border-white/10!"
      >
        {contentElement}
      </HoverCardContent>
    </HoverCard>
  );
}
