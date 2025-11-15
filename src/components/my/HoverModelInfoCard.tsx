import Image from "next/image";
import {
  InfoIcon,
  BrainIcon,
  Sparkles,
  DollarSign,
  Zap,
  Clock,
} from "lucide-react";
import { HoverCard, HoverCardContent } from "../ui/hover-card";
import { HoverCardTrigger } from "@radix-ui/react-hover-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { Avatar } from "../ui/avatar";

// Model Info Hover Card Component:
export function HoverModelInfoCard({ model }: { model: any }) {
  const isModelReasoningCapable = model[1] === "reasoning";
  model = model[0]; //unpack
  return (
    <HoverCard key={model.id} openDelay={100} closeDelay={100}>
      <HoverCardTrigger asChild>
        <Button variant="link">
          <InfoIcon
            className="rounded-full text-amber-500"
            size={8}
            strokeWidth={3}
          />
        </Button>
      </HoverCardTrigger>
      <HoverCardContent
        align="end"
        sideOffset={8}
        className="w-80 bg-linear-to-b from-slate-900/95 to-slate-950/95 backdrop-blur-xl border border-purple-500/30 shadow-2xl shadow-purple-600/30 rounded-2xl p-0 animate-in fade-in-0 zoom-in-95 duration-200"
      >
        <Card className="border-0 shadow-none bg-transparent overflow-hidden">
          <CardHeader className="pb-2 px-3 pt-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Image
                  src="/assets/ai_provider3.svg"
                  alt=""
                  width={16}
                  height={16}
                  className="w-16 h-16"
                />
                <Badge
                  variant="outline"
                  className="border-cyan-500/30 text-cyan-300 bg-cyan-900/20 text-xs px-1.5 py-0.5"
                >
                  {model.specification.provider}
                </Badge>
              </div>
            </div>
            <CardTitle className="text-base font-semibold text-white px-0 flex gap-1.5 items-center">
              {model.name}
              <HoverCard openDelay={50} closeDelay={50}>
                <HoverCardTrigger asChild>
                  <InfoIcon className="w-5 h-5 inline-block text-pink-300 hover:text-gray-300" />
                </HoverCardTrigger>
                <HoverCardContent className="bg-gray-800 text-white p-2 rounded-md text-xs">
                  {model.description}
                </HoverCardContent>
              </HoverCard>
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-2.5 pt-0 px-3 pb-3">
            <div className="space-y-1.5 text-xs">
              {/* Pricing Section */}
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1 text-gray-400">
                  <DollarSign className="w-3 h-3 text-green-400" />
                  Input
                </span>
                <span className="font-mono text-cyan-300 text-sm">
                  ${model.pricing?.input ?? "—"} /M
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1 text-gray-400">
                  <DollarSign className="w-3 h-3 text-blue-400" />
                  Output
                </span>
                <span className="font-mono text-cyan-300 text-sm">
                  ${model.pricing?.output ?? "—"} /M
                </span>
              </div>
              {model.pricing?.cachedInputTokens && (
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1 text-gray-400">
                    <Zap className="w-3 h-3 text-yellow-400" />
                    Cache Read
                  </span>
                  <span className="font-mono text-yellow-300 text-xs">
                    ${model.pricing.cachedInputTokens} /M
                  </span>
                </div>
              )}
              {model.pricing?.cacheCreationInputTokens && (
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1 text-gray-400">
                    <Clock className="w-3 h-3 text-orange-400" />
                    Cache Write
                  </span>
                  <span className="font-mono text-orange-300 text-xs">
                    ${model.pricing.cacheCreationInputTokens} /M
                  </span>
                </div>
              )}
            </div>

            {/* Separator */}
            <Separator className="bg-purple-500/10 my-2" />

            {/* Model Info Section */}
            <div className="text-xs space-y-1 text-gray-400">
              <div className="flex justify-between">
                <span>Model ID</span>
                <span className="font-mono text-green-300 max-w-[120px] ">
                  {/* truncate */}
                  {model.specification.modelId}
                </span>
              </div>

              <Separator className="bg-purple-500/10 my-2" />

              <div className="flex justify-between mt-2">
                <span>Type</span>
                <span className="font-mono text-pink-300 capitalize flex items-center gap-1">
                  {isModelReasoningCapable ? (
                    <>
                      Reasoning
                      <BrainIcon className="w-4 h-4 text-green-400" />
                    </>
                  ) : (
                    "Non-Reasoning"
                  )}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </HoverCardContent>
    </HoverCard>
  );
}
