import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Id } from '@/../convex/_generated/dataModel';

export interface ChatItem {
  _id: Id<"conversations">;
  _creationTime?: number;
  title?: string;
  // createdAt: number;
  ai_model?: string;
  updatedAt: number;
  userId: Id<"users">;
}

interface ChatStore {
  chats: ChatItem[];
  activeChat: Id<"conversations"> | null;

  // Actions
  setChats: (chats: ChatItem[]) => void;
  addChat: (chat: ChatItem) => void;
  removeChat: (id: Id<"conversations">) => void;
  setActiveChat: (id: Id<"conversations"> | null) => void;
  updateChatTitle: (id: Id<"conversations">, title: string) => void;
  getChatById: (id: Id<"conversations">) => ChatItem | undefined;
  clearChats: () => void;
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      chats: [],
      activeChat: null,

      setChats: (chats: ChatItem[]) =>
        set({ chats: chats.sort((a, b) => (b._creationTime! - a._creationTime!)) }),

      addChat: (chat: ChatItem) =>
        set((state) => {
          // Check if chat already exists
          const exists = state.chats.some((c) => c._id === chat._id);
          if (exists) {
            return state; // Don't add duplicates
          }

          // Add new chat at the beginning (top)
          return {
            chats: [chat, ...state.chats],
            activeChat: chat._id,
          };
        }),

      removeChat: (id: Id<"conversations">) =>
        set((state) => ({
          chats: state.chats.filter((chat) => chat._id !== id),
          activeChat: state.activeChat === id ? null : state.activeChat,
        })),

      setActiveChat: (id: Id<"conversations"> | null) =>
        set({ activeChat: id }),

      updateChatTitle: (id: Id<"conversations">, title: string) =>
        set((state) => ({
          chats: state.chats.map(
            (chat) =>
              (chat._id === id) ? { ...chat, title, updatedAt: Date.now() } : chat
          ),
        })),

      getChatById: (id: Id<"conversations">) =>
        get().chats.find((chat) => chat._id === id),

      clearChats: () =>
        set({ chats: [], activeChat: null }),
    }),
    {
      name: 'chat-store', // localStorage key
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ activeChat: state.activeChat }), // Only persist activeChat
    }
  )
);
