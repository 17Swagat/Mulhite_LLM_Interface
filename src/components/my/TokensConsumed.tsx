import { CpuIcon } from "lucide-react";
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

export function TokensConsumed({
  totalTokensConsumed,
  isTouchDevice,
}: {
  totalTokensConsumed: number;
  isTouchDevice: boolean;
}) {
  const iconElement = (
    <CpuIcon
      size={22}
      className="text-indigo-400 bg-transparent rounded-full mt-3 hover:text-indigo-300 transition-colors duration-200"
    />
  );

  const displayContentHoverCard = (
    <HoverCardContent className="w-full z-50000 p-1! bg-slate-900 border border-white/10!">
      <div className="flex items-center gap-1 bg-slate-900 text-white text-[16px] p-2 rounded-lg">
        Total-Tokens:
        <span className="text-emerald-400 font-semibold">
          {totalTokensConsumed}
        </span>
      </div>
    </HoverCardContent>
  );

  const displayContentPopover = (
    <PopoverContent className="w-full z-50000 p-1! bg-slate-900 border border-white/10!">
      <div className="flex items-center gap-1 bg-slate-900 text-white text-[16px] p-2 rounded-lg">
        Total-Tokens:
        <span className="text-emerald-400 font-semibold">
          {totalTokensConsumed}
        </span>
      </div>
    </PopoverContent>
  );

  if (isTouchDevice) {
    return (
      <Popover>
        <PopoverTrigger>
          {/* <button type="button"> */}
          {iconElement}
          {/* </button> */}
        </PopoverTrigger>
        {displayContentPopover}
      </Popover>
    );
  }

  return (
    <HoverCard openDelay={100} closeDelay={100}>
      <HoverCardTrigger asChild>{iconElement}</HoverCardTrigger>
      {displayContentHoverCard}
    </HoverCard>
  );
}
