import {
  getVercelAvailableModels,
  // getVercelModelCreditsAvailable,
} from "@/utils/vercelModelFuncs";
import ChatArea from "./ChatArea";

export default async function ChatPage_ID({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const filteredModels = await getVercelAvailableModels();

  return <ChatArea id={id} availableModels={filteredModels} />;
}
