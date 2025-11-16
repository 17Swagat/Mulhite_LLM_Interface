import { ChatPage_ClientComponent } from "./ClientPage";
// import { gateway } from "ai";

import { getVercelAvailableModels } from "@/utils/vercelModelFuncs";

export default async function ChatPage() {
  const filteredModels = await getVercelAvailableModels();
  return <ChatPage_ClientComponent availableModels={filteredModels} />;
}