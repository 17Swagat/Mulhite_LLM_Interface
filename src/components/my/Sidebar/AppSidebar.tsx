"use client";

import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
// import SidebarItem from "./SidebarItem";
import SidebarItem from "../SidebarItem";
import { useChatStore } from "@/stores/chatStore";
import { useEffect, useRef, useState } from "react";
import { useMutation, usePaginatedQuery, useConvexAuth } from "convex/react";
// import { api } from "../../../convex/_generated/api";
import { api } from "@/../convex/_generated/api";
import cssStyleSidebar from "./AppSidebar.module.css";

export function AppSidebar() {
  // ConvexClerk Auth
  const { isLoading: isLoadingAuth, isAuthenticated } = useConvexAuth();
  const { chats, setActiveChat, setChats } = useChatStore();

  // Ensure user exists in Convex on mount
  const ensureUser = useMutation(api.conversations.ensureUser);

  // Fetch conversations from Convex
  // const conversations = useQuery(api.conversations.listConversations); // *** 📌
  const [reset, setReset] = useState(false);
  const PAGINATE_LIMIT = 30;
  const {
    results: conversations,
    status: conversPagiStatus,
    isLoading,
    loadMore,
  } = usePaginatedQuery(
    api.conversations.listConversationsPaginate,
    {
      doReset: reset,
    },
    { initialNumItems: PAGINATE_LIMIT }
  );

  // Infinite scroll sentinel and guard
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const [autoLoading, setAutoLoading] = useState(false);

  // Create user if doesn't exist
  useEffect(() => {
    if (!isLoadingAuth && isAuthenticated) {
      ensureUser().catch((err: unknown) => {
        console.error("Failed to ensure user:", err);
        console.warn(
          "This may cause issues with chat storage and retrieval. Please refresh the page."
        );
      });
    }
  }, [ensureUser]);

  // Sync Convex data with store
  useEffect(() => {
    if (conversations) {
      setChats(conversations);
    }
  }, [conversations, setChats]);

  // Observe the sentinel to auto-load more when nearing the end
  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting) return;

        // Only trigger when we can load more and not already loading
        if (!isLoading && conversPagiStatus !== "Exhausted" && !autoLoading) {
          setAutoLoading(true);
          // Trigger loading next page
          loadMore(PAGINATE_LIMIT);
        }
      },
      {
        root: null, // viewport
        rootMargin: "200px", // prefetch before reaching the bottom
        threshold: 0,
      }
    );

    observer.observe(node);
    return () => {
      observer.unobserve(node);
      observer.disconnect();
    };
  }, [conversPagiStatus, isLoading, autoLoading, loadMore]);

  // Reset autoLoading flag when the load completes
  useEffect(() => {
    if (autoLoading && !isLoading) {
      setAutoLoading(false);
    }
  }, [autoLoading, isLoading]);

  return (
    <>
      <Sidebar
        // variant="inset"
        className="dark"
        style={{ scrollbarWidth: "thin" }}
      >
        <SidebarHeader>
          <Link href={"/"}>
            <div className="w-full bg-yellow-500 p-2 text-center font-semibold text-[22px] rounded-[19px]">
              Nody ➡️
            </div>
          </Link>
        </SidebarHeader>
        <SidebarContent className={cssStyleSidebar.sidebar_scrollbar}>
          <SidebarGroup>
            <SidebarGroupLabel>Chat History</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    className="bg-gray-800/80 hover:bg-gray-600 hover:brightness-125 hover:text-white text-white"
                  >
                    <Link href={`/chat/`} onClick={() => setActiveChat(null)}>
                      + New Chat
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <div className="h-1"></div>

                {/* {conversations === undefined ? ( */}
                {isLoading && conversPagiStatus == "LoadingFirstPage" ? (
                  // Loading Spinner:
                  <SidebarMenuItem className="w-full flex justify-center items-center">
                    <div className="w-8 h-8 animate-spin border-3 border-purple-800 rounded-full border-t-transparent"></div>
                  </SidebarMenuItem>
                ) : chats.length === 0 ? (
                  <SidebarMenuItem>
                    <span className="text-gray-400 text-sm px-2">
                      No chat history available
                    </span>
                  </SidebarMenuItem>
                ) : (
                  chats.map((chat) => (
                    <SidebarMenuItem key={chat._id}>
                      {/* My Custom Item:-=> */}
                      <SidebarItem
                        chatId={chat._id}
                        title={chat.title || `Chat ${chat._id.slice(0, 8)}`}
                        navLink={`/chat/${chat._id}`}
                      />
                    </SidebarMenuItem>
                  ))
                )}

                {/* Loading-more spinner (for subsequent pages) */}
                {isLoading && conversPagiStatus === "LoadingMore" && (
                  <SidebarMenuItem className="w-full flex justify-center items-center py-2">
                    <div className="w-6 h-6 animate-spin border-2 border-purple-800 rounded-full border-t-transparent"></div>
                  </SidebarMenuItem>
                )}

                {/* Sentinel for infinite scroll. Placed before the fallback button to pre-trigger loads. */}
                <SidebarMenuItem>
                  <div ref={sentinelRef} className="h-1 w-full" />
                </SidebarMenuItem>

                {/* Fallback manual loader (kept for accessibility and no-IO edge cases) */}
                {/* {conversPagiStatus !== "Exhausted" &&
                  conversPagiStatus !== "LoadingFirstPage" && (
                    <div
                      className="w-full bg-amber-700 text-white text-[15px] rounded-[10px] text-center cursor-pointer hover:brightness-125 active:brightness-90 active:text-white"
                      onClick={() => {
                        loadMore(PAGINATE_LIMIT);
                      }}
                    >
                      Load More
                    </div>
                  )} */}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </>
  );
}
