"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Sparkles, DollarSign, Zap, Clock, InfoIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";

export function ChooseModel({ models }: { models: any }) {
  const [searchFilter, setSearchFilter] = useState<string>("");

  return (
    <Select>
      <SelectTrigger className="w-full bg-slate-900 backdrop-blur-md border border-purple-500/30 text-white font-medium shadow-lg hover:shadow-purple-500/20 transition-all duration-300 focus:ring-2 focus:ring-purple-500/50 rounded-xl py-7 px-4 text-base">
        <SelectValue placeholder="Select a Model" />
      </SelectTrigger>
      <SelectContent className="bg-slate-900/95 backdrop-blur-xl border border-purple-500/20 shadow-2xl rounded-2xl w-full max-h-96 overflow-y-auto p-1 mt-1">
        {/* Sticky Search Bar */}
        <div className="sticky top-0 z-10 bg-slate-900/95 backdrop-blur-xl p-2">
          <input
            type="text"
            placeholder="Search..."
            className="w-full px-4 py-2 border-0 ring-2 ring-purple-700 rounded-full focus:outline-none focus:ring-purple-500 bg-slate-800 text-white"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            // 🎨 For prevents Radix from hijacking keys:=>
            onKeyDown={(e) => e.stopPropagation()}
            onKeyUp={(e) => e.stopPropagation()}
          />
        </div>
        {/* <div className="inset-0 bg-blue-500 sticky top-0"></div> */}
        <SelectGroup className="p-2">
          <SelectLabel className="text-cyan-400 font-semibold px-3 py-2 text-sm uppercase tracking-wide">
            Available Models
          </SelectLabel>
          {
            // availableModels.
            models
              .filter((model: any) => {
                if (searchFilter.trim() === "") return model;
                return model.id.includes(searchFilter);
              })
              .map((model: any) => (
                <SelectItem
                  key={model.id}
                  value={model.id}
                  className="focus:bg-purple-800! relative flex place-items-end-safe gap-3 p-3 mx-1 rounded-xl cursor-pointer transition-all duration-200  border border-transparent"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white truncate">
                        {model.name}
                      </span>
                    </div>
                    <p className="text-gray-400 text-xs truncate">{model.id}</p>
                  </div>

                  {/* HoverCard for Details */}
                  <HoverCard openDelay={200} closeDelay={100}>
                    <HoverCardTrigger asChild>
                      <div className="absolute right-12">
                        <InfoIcon className="w-4 h-4 text-gray-400" />
                      </div>
                    </HoverCardTrigger>
                    <HoverCardContent
                      align="end"
                      sideOffset={8}
                      className="w-80 bg-gradient-to-b from-slate-900/95 to-slate-950/95 backdrop-blur-xl border border-purple-500/30 shadow-2xl shadow-purple-600/30 rounded-2xl p-0 animate-in fade-in-0 zoom-in-95 duration-200"
                    >
                      <Card className="border-0 shadow-none bg-transparent overflow-hidden">
                        <CardHeader className="pb-3 px-4 pt-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                                <Sparkles className="w-5 h-5 text-white" />
                              </div>
                              <Badge
                                variant="outline"
                                className="border-cyan-500/50 text-cyan-400 bg-cyan-500/10 text-xs px-2 py-0.5"
                              >
                                {model.specification.provider}
                              </Badge>
                            </div>
                          </div>

                          <CardTitle className="text-lg font-bold text-white px-0">
                            {model.name}
                          </CardTitle>
                          <CardDescription className="text-gray-400 text-sm">
                            {model.description}
                          </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-4 pt-0 px-4 pb-4">
                          <Separator className="bg-purple-500/20" />

                          {/* Pricing */}
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between items-center">
                              <span className="flex items-center gap-1 text-gray-400">
                                <DollarSign className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                                Input
                              </span>
                              <span className="font-mono text-cyan-400">
                                ${model.pricing?.input ?? "—"} /M
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="flex items-center gap-1 text-gray-400">
                                <DollarSign className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                                Output
                              </span>
                              <span className="font-mono text-cyan-400">
                                ${model.pricing?.output ?? "—"} /M
                              </span>
                            </div>
                            {model.pricing?.cachedInputTokens && (
                              <div className="flex justify-between items-center">
                                <span className="flex items-center gap-1 text-gray-400">
                                  <Zap className="w-3.5 h-3.5 text-yellow-500 flex-shrink-0" />
                                  Cache Read
                                </span>
                                <span className="font-mono text-yellow-400 text-xs">
                                  ${model.pricing.cachedInputTokens} /M
                                </span>
                              </div>
                            )}
                            {model.pricing?.cacheCreationInputTokens && (
                              <div className="flex justify-between items-center">
                                <span className="flex items-center gap-1 text-gray-400">
                                  <Clock className="w-3.5 h-3.5 text-orange-500 flex-shrink-0" />
                                  Cache Write
                                </span>
                                <span className="font-mono text-orange-400 text-xs">
                                  ${model.pricing.cacheCreationInputTokens} /M
                                </span>
                              </div>
                            )}
                          </div>

                          <Separator className="bg-purple-500/20" />

                          {/* Specs */}
                          <div className="text-xs space-y-1.5 text-gray-500">
                            <div className="flex justify-between">
                              <span>ID</span>
                              <span className="font-mono text-cyan-400 truncate max-w-[140px]">
                                {model.specification.modelId}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Version</span>
                              <span className="font-mono text-purple-400">
                                v{model.specification.specificationVersion}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Type</span>
                              <span className="font-mono text-pink-400 capitalize">
                                {model.modelType}
                              </span>
                            </div>
                          </div>

                          {/* {model.contextLength && (
                            <div className="flex items-center justify-between text-xs pt-2 border-t border-purple-500/20">
                              <span className="text-gray-400">Context</span>
                              <span className="font-mono text-emerald-400">
                                {(model.contextLength / 1000).toFixed(0)}K tokens
                              </span>
                            </div>
                          )} */}
                        </CardContent>
                      </Card>
                    </HoverCardContent>
                  </HoverCard>
                </SelectItem>
              ))
          }
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
