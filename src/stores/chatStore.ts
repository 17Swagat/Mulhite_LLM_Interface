import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface ChatItem {
  id: string;
  title: string;
  createdAt: number;
  lastMessagePreview?: string;
}

interface ChatStore {
  chats: ChatItem[];
  activeChat: string | null;
  
  // Actions
  addChat: (chat: ChatItem) => void;
  removeChat: (id: string) => void;
  setActiveChat: (id: string | null) => void;
  updateChatTitle: (id: string, title: string) => void;
  loadChatsFromFiles: (chatIds: string[]) => void;
  getChatById: (id: string) => ChatItem | undefined;
  syncWithFiles: (fileIds: string[]) => void;
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      chats: [],
      activeChat: null,

      addChat: (chat: ChatItem) =>
        set((state) => {
          // Check if chat already exists
          const exists = state.chats.some((c) => c.id === chat.id);
          if (exists) {
            return state; // Don't add duplicates
          }
          
          // Add new chat at the beginning (top)
          return {
            chats: [chat, ...state.chats],
            activeChat: chat.id,
          };
        }),

      removeChat: (id: string) =>
        set((state) => ({
          chats: state.chats.filter((chat) => chat.id !== id),
          activeChat: state.activeChat === id ? null : state.activeChat,
        })),

      setActiveChat: (id: string | null) =>
        set({ activeChat: id }),

      updateChatTitle: (id: string, title: string) =>
        set((state) => ({
          chats: state.chats.map((chat) =>
            chat.id === id ? { ...chat, title } : chat
          ),
        })),

      loadChatsFromFiles: (chatIds: string[]) =>
        set((state) => {
          // Create chat items for IDs that don't exist yet
          const existingIds = new Set(state.chats.map((c) => c.id));
          const newChats: ChatItem[] = chatIds
            .filter((id) => !existingIds.has(id))
            .map((id) => ({
              id,
              title: id.substring(0, 8), // Short preview of ID
              createdAt: Date.now(),
            }));

          // Merge with existing chats, sort by createdAt (newest first)
          const allChats = [...newChats, ...state.chats].sort(
            (a, b) => b.createdAt - a.createdAt
          );

          return { chats: allChats };
        }),

      getChatById: (id: string) =>
        get().chats.find((chat) => chat.id === id),

      syncWithFiles: (fileIds: string[]) =>
        set((state) => {
          const fileIdSet = new Set(fileIds);
          // Remove chats that don't exist in files
          const validChats = state.chats.filter((chat) => fileIdSet.has(chat.id));
          
          // Add new chats from files that aren't in store
          const existingIds = new Set(validChats.map((c) => c.id));
          const newChats: ChatItem[] = fileIds
            .filter((id) => !existingIds.has(id))
            .map((id) => ({
              id,
              title: id.substring(0, 8) + '...', // Short preview of ID
              createdAt: Date.now(),
            }));

          // Merge and sort by createdAt (newest first)
          const allChats = [...newChats, ...validChats].sort(
            (a, b) => b.createdAt - a.createdAt
          );

          return { chats: allChats };
        }),
    }),
    {
      name: 'chat-store', // localStorage key
      storage: createJSONStorage(() => localStorage),
    }
  )
);
