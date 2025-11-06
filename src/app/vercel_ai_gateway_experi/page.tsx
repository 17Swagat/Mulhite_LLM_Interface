// import { gateway } from "ai";

// const availableModels = await gateway.getAvailableModels();

// export default function VercelAIGatewayExperiPage() {
//   console.log(availableModels.models.length);
//   return (
//     <div className="h-screen flex flex-col gap-3">
//       {availableModels.models.map((model) => {
//         return (
//           <div
//             key={model.id}
//             className="bg-amber-200 text-black flex flex-col gap-1.5"
//           >
//             <h2 className="font-bold">{model.name}</h2>
//             <h2>{model.description}</h2>
//             <hr />
//             <h2>{model.pricing?.input}</h2>
//             <h2>{model.pricing?.output}</h2>
//             <h2>{model.pricing?.cachedInputTokens}</h2>
//             <h2>{model.pricing?.cacheCreationInputTokens}</h2>
//             <hr />
//             <h2>{model.specification.modelId}</h2>
//             <h2>{model.specification.provider}</h2>
//             <h2>{model.specification.specificationVersion}</h2>
//             <hr />
//             <h2>{model.modelType}</h2>
//           </div>
//         );
//       })}
//     </div>
//   );
// }

import { gateway } from "ai";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Sparkles, Zap, Clock, DollarSign } from "lucide-react";

const availableModels = await gateway.getAvailableModels();

export default function VercelAIGatewayExperiPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-3">
            AI Playground
          </h1>
          <p className="text-gray-400 text-lg">
            Compare top AI models side-by-side
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableModels.models.map((model) => (
            <Card
              key={model.id}
              className="relative overflow-hidden bg-gradient-to-b from-slate-900/80 to-slate-950/90 backdrop-blur-xl border border-purple-500/20 shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 hover:scale-[1.02] group"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <Badge
                      variant="outline"
                      className="border-cyan-500/50 text-cyan-400 bg-cyan-500/10"
                    >
                      {model.specification.provider}
                    </Badge>
                  </div>
                  {/* {model.modelType === "Pro" && (
                    <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0">
                      Pro
                    </Badge>
                  )} */}
                </div>

                <CardTitle className="mt-4 text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                  {model.name}
                </CardTitle>
                <CardDescription className="text-gray-400 line-clamp-2">
                  {model.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <Separator className="bg-purple-500/20" />

                {/* Pricing Section */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1 text-gray-400">
                      <DollarSign className="w-4 h-4 text-green-500" />
                      Input
                    </span>
                    <span className="font-mono text-cyan-400">
                      ${model.pricing?.input || "—"} /M
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1 text-gray-400">
                      <DollarSign className="w-4 h-4 text-blue-500" />
                      Output
                    </span>
                    <span className="font-mono text-cyan-400">
                      ${model.pricing?.output || "—"} /M
                    </span>
                  </div>
                  {model.pricing?.cachedInputTokens && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-1 text-gray-400">
                        <Zap className="w-4 h-4 text-yellow-500" />
                        Cache Read
                      </span>
                      <span className="font-mono text-yellow-400">
                        ${model.pricing.cachedInputTokens} /M
                      </span>
                    </div>
                  )}
                  {model.pricing?.cacheCreationInputTokens && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-1 text-gray-400">
                        <Clock className="w-4 h-4 text-orange-500" />
                        Cache Write
                      </span>
                      <span className="font-mono text-orange-400">
                        ${model.pricing.cacheCreationInputTokens} /M
                      </span>
                    </div>
                  )}
                </div>

                <Separator className="bg-purple-500/20" />

                {/* Specs */}
                <div className="text-xs space-y-1 text-gray-500">
                  <div className="flex justify-between">
                    <span>Model ID</span>
                    <span className="font-mono text-cyan-400">
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

                {/* Uptime / Context (Optional Enhancement) */}
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
          ))}
        </div>
      </div>
    </div>
  );
}
