# Convex + Clerk Quick Reference

## 🔐 Authentication

### Check if user is logged in
```typescript
import { useUser } from "@clerk/nextjs";

const { user, isLoaded, isSignedIn } = useUser();
```

### Get user info in Convex functions
```typescript
// In queries
const user = await getCurrentUserQuery(ctx);
// Returns: { _id, clerkUserId, email, name }

// In mutations (auto-creates user if missing)
const user = await getCurrentUserMutation(ctx);
```

## 📊 Querying Data

### List user's conversations
```typescript
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

const conversations = useQuery(api.conversations.listConversations);
// Returns: Array<{ _id, userId, title, createdAt, updatedAt }>
```

### Get messages for a conversation
```typescript
const messagesData = useQuery(
  api.conversations.getMessages,
  { conversationId: "j97..." as Id<"conversations"> }
);
// Returns: { messages: Array<Message>, nextCursor: string | undefined }
```

### Conditional query (skip if no ID)
```typescript
const messages = useQuery(
  api.conversations.getMessages,
  conversationId ? { conversationId } : "skip"
);
```

## ✏️ Mutating Data

### Create conversation
```typescript
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";

const createConversation = useMutation(api.conversations.createConversation);

// Call it
const result = await createConversation({ title: "My Chat" });
// Returns: { _id: "j97..." }
```

### Add message to conversation
```typescript
const addMessage = useMutation(api.conversations.addMessage);

await addMessage({
  conversationId: "j97..." as Id<"conversations">,
  role: "user", // or "assistant"
  parts: [
    { type: "text", text: "Hello!" },
    { type: "reasoning", text: "Thinking..." }
  ],
});
```

### Update conversation title
```typescript
const updateConversation = useMutation(api.conversations.updateConversation);

await updateConversation({
  conversationId: "j97..." as Id<"conversations">,
  title: "New Title",
});
```

### Delete conversation
```typescript
const deleteConversation = useMutation(api.conversations.deleteConversation);

await deleteConversation({
  conversationId: "j97..." as Id<"conversations">,
});
// Also deletes all messages in the conversation
```

## 🎯 Zustand Store

### Access store
```typescript
import { useChatStore } from "@/stores/chatStore";

const { chats, activeChat, setActiveChat, addChat, removeChat } = useChatStore();
```

### Store structure
```typescript
{
  chats: ChatItem[], // Synced from Convex
  activeChat: Id<"conversations"> | null, // Persisted to localStorage
  
  // Actions
  setChats: (chats: ChatItem[]) => void,
  addChat: (chat: ChatItem) => void,
  removeChat: (id: Id<"conversations">) => void,
  setActiveChat: (id: Id<"conversations"> | null) => void,
  updateChatTitle: (id: Id<"conversations">, title: string) => void,
  getChatById: (id: Id<"conversations">) => ChatItem | undefined,
  clearChats: () => void,
}
```

## 🔄 Real-time Updates

Convex provides automatic real-time updates. No need to manually refetch!

```typescript
// This automatically updates when data changes in Convex
const conversations = useQuery(api.conversations.listConversations);

// Use in useEffect to sync with Zustand
useEffect(() => {
  if (conversations) {
    setChats(conversations);
  }
}, [conversations]);
```

## 🚀 Common Patterns

### Create conversation and navigate
```typescript
const createConversation = useMutation(api.conversations.createConversation);
const { addChat, setActiveChat } = useChatStore();
const router = useRouter();

const result = await createConversation({ title: "New Chat" });
const conversationId = result._id;

addChat({
  _id: conversationId,
  title: "New Chat",
  createdAt: Date.now(),
  updatedAt: Date.now(),
  userId: '' as any, // Filled by Convex
});

setActiveChat(conversationId);
router.push(`/chat/${conversationId}`);
```

### Load and display messages
```typescript
const conversationId = params.id as Id<"conversations">;
const messagesData = useQuery(
  api.conversations.getMessages,
  { conversationId }
);

if (!messagesData) return <div>Loading...</div>;

return (
  <div>
    {messagesData.messages.map(msg => (
      <div key={msg._id}>
        {msg.role}: {msg.parts[0].text}
      </div>
    ))}
  </div>
);
```

### Save message after AI response
```typescript
const addMessage = useMutation(api.conversations.addMessage);
const { sendMessage } = useChat({
  onFinish: async ({ message }) => {
    await addMessage({
      conversationId,
      role: 'assistant',
      parts: message.parts,
    });
  },
});
```

### Delete conversation with confirmation
```typescript
const deleteConversation = useMutation(api.conversations.deleteConversation);
const { removeChat, activeChat } = useChatStore();
const router = useRouter();

const confirmed = confirm("Delete this chat?");
if (!confirmed) return;

await deleteConversation({ conversationId });
removeChat(conversationId);

if (activeChat === conversationId) {
  router.push('/chat');
}
```

## 🛡️ Protected Routes

Routes under `/chat/*` are automatically protected by middleware:

```typescript
// src/middleware.ts
const isProtectedRoute = createRouteMatcher(['/chat/:path*']);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect(); // Redirects to /login if not authenticated
  }
});
```

## 🐛 Debugging

### Check Convex connection
```bash
npx convex dev
```

### View Convex dashboard
```bash
# Open browser to Convex dashboard
npx convex dashboard
```

### Check user authentication
```typescript
const { user } = useUser();
console.log(user?.id); // Clerk user ID
```

### View Zustand state
```typescript
console.log(useChatStore.getState());
```

## 📝 Type Imports

```typescript
import { Id } from "../convex/_generated/dataModel";
import { api } from "../convex/_generated/api";

type ConversationId = Id<"conversations">;
type UserId = Id<"users">;
type MessageId = Id<"messages">;
```

## ⚡ Performance Tips

1. **Use conditional queries** to avoid unnecessary fetches
2. **Zustand only persists activeChat** (not all chats) to reduce localStorage size
3. **Convex automatically batches** multiple queries/mutations
4. **Messages are paginated** by default (50 per page)

## 🔗 Useful Links

- [Convex Docs](https://docs.convex.dev)
- [Clerk Docs](https://clerk.com/docs)
- [Zustand Docs](https://docs.pmnd.rs/zustand)
- [AI SDK Docs](https://sdk.vercel.ai/docs)
