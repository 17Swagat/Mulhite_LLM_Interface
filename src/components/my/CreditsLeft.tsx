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
      size={38}
      className="text-white bg-green-800 rounded-full mt-3 hover:opacity-80 transition-opacity"
    />
  );

  const contentElement = (
    <div className="flex gap-2 bg-black text-white text-[18px] p-1 rounded-sm">
      <span className="underline">Credits-Left:</span>
      <span className="text-green-500 font-semibold">
        <span className="text-white">$</span>
        {credits}
      </span>
    </div>
  );

  if (isTouchDevice) {
    return (
      <Popover>
        <PopoverTrigger className="fixed top-0 right-1 lg:right-8" asChild>
          <button type="button">{iconElement}</button>
        </PopoverTrigger>
        <PopoverContent className="w-full z-50000 p-1! bg-linear-to-r from-[#2dd4bf] to-[#95b5e0] border-0!">
          {contentElement}
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <HoverCard openDelay={100} closeDelay={100}>
      <HoverCardTrigger className="fixed top-0 right-8" asChild>
        <div>{iconElement}</div>
      </HoverCardTrigger>
      <HoverCardContent className="w-full z-50000 p-1! bg-linear-to-r from-[#2dd4bf] to-[#95b5e0] border-0!">
        {contentElement}
      </HoverCardContent>
    </HoverCard>
  );
}
