"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useChatStore } from "@/stores/chatStore";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { Id } from "../../../convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";

export default function SidebarItem({
  chatId,
  title,
  navLink,
}: {
  chatId: Id<"conversations">;
  title: string;
  navLink: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { activeChat, setActiveChat, updateChatTitle, removeChat } =
    useChatStore();
  const isActive = activeChat === chatId;
  const [isRenaming, setIsRenaming] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const [isDeleting, setIsDeleting] = useState(false);

  // Convex mutations
  const updateConversation = useMutation(api.conversations.updateConversation);
  const deleteConversation = useMutation(api.conversations.deleteConversation);

  // Update active chat when pathname changes
  useEffect(() => {
    if (pathname === navLink) {
      setActiveChat(chatId);
    }
  }, [pathname, navLink, chatId, setActiveChat]);

  const handleRename = async () => {
    if (newTitle.trim() && newTitle !== title) {
      try {
        // Update in Convex
        await updateConversation({
          conversationId: chatId,
          title: newTitle.trim(),
        });

        // Update local store
        updateChatTitle(chatId, newTitle.trim());
      } catch (error) {
        console.error("Failed to rename chat:", error);
        alert("Failed to rename chat. Please try again.");
      }
    }
    setIsRenaming(false);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isDeleting) return;

    const confirmed = confirm(`Are you sure you want to delete "${title}"?`);
    if (!confirmed) return;

    setIsDeleting(true);

    // If we're currently viewing this chat, redirect FIRST to prevent query errors
    const shouldRedirect = pathname === navLink;
    if (shouldRedirect) {
      router.push("/chat");
    }

    try {
      // Delete from Convex
      await deleteConversation({ conversationId: chatId });

      // Remove from Zustand store
      removeChat(chatId);
    } catch (error) {
      console.error("Error deleting chat:", error);
      alert("Failed to delete chat. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (isRenaming) {
    return (
      <div
        className={`text-white w-full h-full ${
          isActive ? "bg-teal-800 brightness-125" : "bg-yellow-700"
        } flex items-center gap-1 p-1 rounded-2xl`}
      >
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onBlur={handleRename}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleRename();
            if (e.key === "Escape") {
              setNewTitle(title);
              setIsRenaming(false);
            }
          }}
          autoFocus
          placeholder="Enter chat title"
          aria-label="Rename chat"
          className="flex-1 bg-pink-500 text-white outline-none border-b border-white px-1"
        />
      </div>
    );
  }

  return (
    <div
      // className={`text-white font-semibold hover:bg-linear-to-br hover:from-[#6b46c1] hover:to-[#b83280] bg-black w-full h-full 
      //       ${
      //         isActive
      //           ? "brightness-125 text-black bg-linear-to-r from-[#001f3f] via-[#083358] to-[#0da574]"
      //           : "brightness-125 bg-linear-to-tl from-[#8719ee] via-[#3c0753] to-[#720455]"
      //       } flex items-center gap-1 rounded-xl transition-colors duration-500 group relative`}
      className={`text-white font-semibold hover:bg-linear-to-br hover:from-[#6b46c1] hover:to-[#b83280] bg-black w-full h-full 
            ${
              isActive
                ? "brightness-125 text-black bg-blue-900"
                : "brightness-125 bg-gray-700"
            } flex items-center gap-1 rounded-xl transition-colors duration-500 group relative`}
    >
      <Link
        href={`${navLink}`}
        onClick={() => setActiveChat(chatId)}
        className="flex-1 flex items-center p-1 rounded-l-2xl min-w-0"
      >
        <span className="text-white text-ellipsis truncate p-1">
          {title || "Untitled Chat"}
        </span>
      </Link>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="p-2 hover:bg-pink-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => e.stopPropagation()}
            aria-label="Chat options"
            title="Chat options"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              setIsRenaming(true);
            }}
            className="cursor-pointer"
          >
            <Pencil className="w-4 h-4 mr-2" />
            Rename Chat
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleDelete}
            className="cursor-pointer text-red-600 focus:text-red-600"
            disabled={isDeleting}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            {isDeleting ? "Deleting..." : "Delete Chat"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
