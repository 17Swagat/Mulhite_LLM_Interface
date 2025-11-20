import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { KeyIcon, Info } from "lucide-react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import Link from "next/link";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export function APIKeys() {
  const iconElement = (
    <KeyIcon
      size={34}
      className="text-white bg-purple-800 rounded-full mt-3 hover:opacity-80 transition-opacity hover:cursor-pointer"
    />
  );

  return (
    <Popover>
      <PopoverTrigger
        // className="fixed top-0 right-1 lg:right-8"
        className="p-1"
        asChild
      >
        {iconElement}
      </PopoverTrigger>
      {/* <PopoverContent className="w-full z-50000 p-1! bg-linear-to-r from-[#2dd4bf] to-[#95b5e0] border-0!">
      </PopoverContent> */}
      <PopoverContent
        side="bottom"
        align="end"
        className="w-80 border-0 p-5 shadow-2xl"
        style={{
          background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
        }}
      >
        <div className="space-y-5">
          <div className="text-center">
            <h3 className="text-lg font-medium text-white">Secret API Key</h3>
            {/* <p className="mt-1 text-xs text-gray-400">
              Stored only in your browser
            </p> */}
          </div>

          <div className="space-y-2">
            <Label htmlFor="api-key" className="text-sm text-gray-300">
              Vercel AI Gateway API Key
              <sup>
                <Link href={"https://vercel.com/ai-gateway"} target="_blank">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info
                        size={16}
                        className="inline-block ml-1 text-purple-300 hover:brightness-90 cursor-pointer"
                        strokeWidth={3}
                      />
                    </TooltipTrigger>
                    <TooltipContent className="p-2 bg-purple-700">
                      <p className="font-semibold">
                        Get Vercel AI Gateway API Key
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Link>
              </sup>
            </Label>
            <Input
              id="api-key"
              type="password"
              placeholder="Put Vercel AI Gateway API Key here..."
              className="dark h-8 bg-gray-300  border-gray-600  placeholder:text-gray-600 font-semibold focus-visible:ring-1 focus-visible:ring-purple-500"
              autoComplete="off"
            />
          </div>

          <Button className="w-full h-9 bg-purple-600 hover:bg-purple-700 text-white font-medium">
            Save Key
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
