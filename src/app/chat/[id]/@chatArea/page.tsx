import ChatArea from "./ChatArea";
export default async function ChatPage_ID({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ChatArea id={id} />;
}
