"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useChatStore } from "@/stores/chatStore";
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";
import { Id } from "@/../convex/_generated/dataModel";
import { PromptInputField } from "@/components/my/PromptInputField";
// import { useSelectedAIModelStore } from "@/stores/modelSelectionStore";
import { LoadingScreen } from "@/components/my/LoadingScreen";
import { useUserQuestionStore } from "@/stores/userQuestionStore";
import { CreditsLeft } from "@/components/my/CreditsLeft";
import { useAboutDeviceInfo } from "@/stores/aboutDevice";
import { isDeviceTouch } from "@/utils/clientfuncs/isDeviceTouch";

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
  const [credits, setCredits] = useState(0);
  const { isTouchDevice, setIsTouchDevice } = useAboutDeviceInfo(); // "For, touch device Check"
  useEffect(() => {
    setHaveMounted(true);
    // Get credits left:
    fetch("/api/vercel-models/credits_left/")
      .then((res) => res.json())
      .then((data) => {
        setCredits(data.creditsLeft);
      });

    // REVISIT:
    // Check if device supports touch:
    // const checkTouch = () => {
    //   setIsTouchDevice(
    //     "ontouchstart" in window ||
    //       navigator.maxTouchPoints > 0 ||
    //       // @ts-ignore
    //       navigator.msMaxTouchPoints > 0 // "it it useful? TS: showing Errors"
    //   );
    // };

    setIsTouchDevice(isDeviceTouch());
    // checkTouch();

    // Also check on resize in case device orientation changes
    // REVISIT: "Check whether this is necessary or not"
    window.addEventListener("resize", isDeviceTouch);
    return () => window.removeEventListener("resize", isDeviceTouch);
  }, []);

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
        <CreditsLeft credits={credits} isTouchDevice={isTouchDevice} />

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
