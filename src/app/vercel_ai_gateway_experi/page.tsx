import { gateway } from "ai";
import { ChooseModel } from "./ChooseModel";

// import GatewayLanguageModelEntry from "@/lib/ai/gateway/models/GatewayLanguageModelEntry";
// import GatewayLanguageModelEntry from "@/lib/ai/gateway/models/GatewayLanguageModelEntry";

export default async function VercelAIGatewayExperiPage() {
  const availableModels = await gateway.getAvailableModels();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <ChooseModel models={availableModels.models} />
      </div>
    </div>
  );
}
