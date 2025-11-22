"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useChatStore } from "@/stores/chatStore";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";
import { Id } from "@/../convex/_generated/dataModel";
import { PromptInputField } from "@/components/my/PromptInputField";
// import { useSelectedAIModelStore } from "@/stores/modelSelectionStore";
import { LoadingScreen } from "@/components/my/LoadingScreen";
import { useUserQuestionStore } from "@/stores/userQuestionStore";
import { CreditsLeft } from "@/components/my/CreditsLeft";
import { useAboutDeviceInfo } from "@/stores/aboutDevice";
import { isDeviceTouch } from "@/utils/clientfuncs/isDeviceTouch";
import { APIKeys } from "@/components/my/APIKeys";
import { useAPIVercelGateway } from "@/stores/aiprovidersKeyStore";
import { useVercelAICreditsLeft } from "@/stores/aiprovidersCreditsStore";

export function ChatPage_ClientComponent({
  availableModels,
}: {
  availableModels: any;
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addChat, setActiveChat } = useChatStore();
  const { question, setQuestion } = useUserQuestionStore();

  // Convex mutation
  const createConversation = useMutation(api.conversations.createConversation);

  // Clear active chat when landing on /chat page
  useEffect(() => {
    setActiveChat(null);
  }, [setActiveChat]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (question.trim() && !isSubmitting) {
      setIsSubmitting(true);

      try {
        // Create conversation in Convex
        const title =
          question.substring(0, 50) + (question.length > 50 ? "..." : "");
        const result = await createConversation({ title });
        // if (!result) return;

        const conversationId = result._id;
        const now = Date.now();
        // Add the new chat to Zustand store
        addChat({
          _id: conversationId,
          title,
          updatedAt: now,
          userId: "" as Id<"users">,
        });
        // Set as active chat
        setActiveChat(conversationId);
        // Store the initial message in sessionStorage with the conversation ID as key
        sessionStorage.setItem(`pendingMessage_${conversationId}`, question);

        // Navigate to the chat page with the new ID
        router.push(`/chat/${conversationId}`);

        setQuestion("");
      } catch (error) {
        console.error("Error creating chat:", error);
        alert("Failed to create chat. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Component Mount Check [Otherwise Zustand store has hydration issues]
  const [haveMounted, setHaveMounted] = useState(false);
  const [credits, setCredits] = useState(-1);
  const { isTouchDevice, setIsTouchDevice } = useAboutDeviceInfo(); // "For, touch device Check"
  const { vercelAIGatewayAPIKey, hydrated } = useAPIVercelGateway();

  useEffect(() => {
    if (!hydrated) return;
    setHaveMounted(true);
    fetch(`/api/vercel-models/credits_left/${vercelAIGatewayAPIKey}`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        setCredits(data.creditsLeft);
      })
      .catch((err) => {});

    // is Touch Device Check:
    const touchValidation = () => {
      setIsTouchDevice(isDeviceTouch());
    };
    touchValidation();
    window.addEventListener("resize", touchValidation); // CHECK: "Whether this is necessary or not"
    return () => window.removeEventListener("resize", touchValidation);
  }, [vercelAIGatewayAPIKey, hydrated]);

  if (!haveMounted) {
    return <LoadingScreen />;
  }

  return (
    haveMounted && (
      <div
        className="w-full h-screen 
     bg-linear-to-r from-[#374151] via-[#f43f5e] to-[#fb923c] 
      text-white flex justify-center items-center"
      >
        <div className="fixed top-0 right-1 lg:right-8 flex gap-2 items-center">
          <CreditsLeft credits={credits} isTouchDevice={isTouchDevice} />
          <APIKeys />
        </div>

        <div className="flex flex-col items-center">
          <h1 className="text-3xl mb-2 font-semibold">
            Let's Start Learning 😊
          </h1>

          {/* <div className="w-sm mx-auto   max-w-3xl md:w-2xl py-2 px-1 md:px-2 bg-linear-to-r from-blue-500 via-green-400 to-purple-500 shadow-md rounded-2xl "> */}
          <PromptInputField
            availableModels={availableModels}
            handleSubmit={handleSubmit}
            chatStatus={"ready"}
          />
          {/* </div> */}
        </div>
      </div>
    )
  );
}
