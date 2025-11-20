"use client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  KeyIcon,
  Info,
  Construction,
  EyeClosed,
  Eye,
  Copy,
} from "lucide-react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import Link from "next/link";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

// convex:
import { useMutation, useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";
import {
  memo,
  startTransition,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useAPIVercelGateway } from "@/stores/aiprovidersKey";
// import { useAPIVercelGateway } from "@/stores/aiprovidersKey";

// export function APIKeys() {
export const APIKeys = memo(function APIKeys() {
  const [vercelAPIKey, setVercelAPIKey] = useState("");
  const { vercelAIGatewayAPIKey, setVercelGatewayAPIKey } =
    useAPIVercelGateway();

  const saveVercelAPIKey = useCallback(async () => {}, [vercelAPIKey]);

  const iconElement = (
    <KeyIcon
      size={34}
      className="text-white bg-purple-800 rounded-full mt-3 hover:opacity-80 transition-opacity hover:cursor-pointer"
    />
  );

  const [apikeyVisible, setApikeyVisible] = useState(false);
  const apiKeyRef = useRef<HTMLButtonElement>(null);
  let temporary_api_key =
    "temporary_api_key_placeholder_for_display_purposes_only";

  return (
    <Popover>
      <PopoverTrigger
        // className="fixed top-0 right-1 lg:right-8"
        className="p-1"
        asChild
      >
        {iconElement}
      </PopoverTrigger>
      <PopoverContent
        side="bottom"
        align="end"
        className="w-80 border-0 py-4 shadow-2xl"
        style={{
          background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
        }}
      >
        <div className="space-y-5">
          <div className="text-center">
            <h3 className="text-lg font-medium text-white">Secret API Key</h3>
          </div>

          <div className="space-y-2">
            <Label htmlFor="vercel-api-key" className="text-sm text-gray-300">
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

            {temporary_api_key.trim() !== "" && (
              <div className="flex items-center text-white">
                <p className="truncate max-w-[calc(100%-24px)] overflow-hidden">
                  {apikeyVisible
                    ? "*".repeat(temporary_api_key.length)
                    : temporary_api_key}
                </p>
                <Button
                  variant={"ghost"}
                  className="shrink-0 ml-1"
                  onClick={() => setApikeyVisible(!apikeyVisible)}
                >
                  {apikeyVisible ? <Eye /> : <EyeClosed />}
                </Button>
                <Button
                  variant={"ghost"}
                  // ref={apiKeyRef}
                  className="shrink-0 ml-1 active:brightness-50"
                  onClick={async () => {
                    // Use the Clipboard API to write the text to the clipboard
                    let textToCopy = temporary_api_key;
                    await navigator.clipboard.writeText(textToCopy);
                    // apiKeyRef.current?.focus();
                  }}
                >
                  <Copy />
                </Button>
              </div>
            )}

            <Input
              value={vercelAPIKey}
              onChange={(e) => {
                startTransition(() => {
                  setVercelAPIKey(e.target.value);
                });
              }}
              id="vercel-api-key"
              type="password"
              placeholder="Put Vercel AI Gateway API Key here..."
              className="dark h-8 bg-gray-300  border-gray-600  placeholder:text-gray-600 font-semibold focus-visible:ring-1 focus-visible:ring-purple-500"
              autoComplete="off"
            />
          </div>

          <Button
            className="w-full h-9 bg-purple-600 
            hover:bg-purple-700  
            active:bg-purple-900
            text-white font-medium"
            onClick={() => {
              if (
                vercelAPIKey.trim() !== ""
                //&& convex_vercelAPIKey !== vercelAPIKey // Don't seem to be necessary, as updation for the same value is not observed to make any changes
              ) {
                saveVercelAPIKey();
              }
            }}
          >
            Save Key
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
});
