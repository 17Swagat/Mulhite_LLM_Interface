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
      size={24}
      className="text-blue-500 bg-transparent rounded-full mt-3"
    />
  );

  const displayContentHoverCard = (
    <HoverCardContent className="w-full z-50000 p-1! bg-linear-to-r from-[#2dd4bf]  to-[#95b5e0] border-0!">
      <div className="flex items-center gap-1 bg-black text-white text-[18px] p-2 rounded-sm">
        Total-Tokens:
        <span className="text-green-600 font-semibold">
          {totalTokensConsumed}
        </span>
      </div>
    </HoverCardContent>
  );

  const displayContentPopover = (
    <PopoverContent className="w-full z-50000 p-1! bg-linear-to-r from-[#2dd4bf] to-[#95b5e0] border-0!">
      {/* {contentElement} */}
      <div className="flex items-center gap-1 bg-black text-white text-[18px] p-2 rounded-sm">
        Total-Tokens:
        <span className="text-green-600 font-semibold">
          {totalTokensConsumed}
        </span>
      </div>
    </PopoverContent>
  );

  if (isTouchDevice) {
    return (
      <Popover>
        <PopoverTrigger>
          <button type="button">{iconElement}</button>
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
