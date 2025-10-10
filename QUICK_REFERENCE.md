# Quick Reference: Chat Flow

## 🔄 Complete User Journey

### 1️⃣ Entry Point: `/chat`
```
User visits /chat
    ↓
Types message in input field
    ↓
Clicks "GO!" button
    ↓
handleSubmit() triggered
```

**What happens:**
```typescript
// Generate unique ID
const id = uuidv7();

// Create empty chat file via API
await fetch('/api/persist-chat', {
    method: 'POST',
    body: JSON.stringify({
        chatId: id,      // ← Chat ID sent
        messages: []      // ← Empty array
    })
});

// Store user's message temporarily
sessionStorage.setItem(`pendingMessage_${id}`, input);

// Navigate to chat page
router.push(`/chat/${id}`);
```

---

### 2️⃣ API: `/api/persist-chat` (POST)
```
Receives request
    ↓
Checks if messages array is empty
    ↓
If empty → Create file & return
If not empty → Stream LLM response
```

**Logic:**
```typescript
const { messages, chatId } = await req.json();

// Empty messages = new chat creation
if (!messages || messages.length === 0) {
    await saveChat({ chatId, messages: [] });
    return Response({ chatId, success: true });
}

// Has messages = LLM conversation
const result = streamText({
    model: ollama('deepseek-r1:1.5b'),
    prompt: convertToModelMessages(messages)
});

return result.toUIMessageStreamResponse({
    onFinish: ({ messages }) => {
        saveChat({ chatId, messages });  // ← Save on finish
    }
});
```

---

### 3️⃣ Chat Page: `/chat/[id]`
```
Page loads
    ↓
Fetch existing messages from .CHATS/[id].json
    ↓
Pass to ChatArea component
    ↓
ChatArea checks sessionStorage
    ↓
If pending message found → Send it
    ↓
LLM responds and saves to file
```

**Loading flow:**
```typescript
// page.tsx - Fetch initial messages
useEffect(() => {
    const loadChatData = async () => {
        const { id } = await params;
        const response = await fetch(`/api/persist-chat/${id}`);
        const data = await response.json();
        setInitialMessages(data.messages);
    };
    loadChatData();
}, [params]);

// ChatArea.tsx - Load messages
useEffect(() => {
    if (initialMessages?.length > 0) {
        setMessages(initialMessages);
    }
}, [initialMessages]);

// ChatArea.tsx - Process pending message
useEffect(() => {
    const pendingMessage = sessionStorage.getItem(`pendingMessage_${id}`);
    if (pendingMessage && status === 'ready') {
        sendMessage({ 
            text: pendingMessage, 
            metadata: { chatId: id } 
        });
        sessionStorage.removeItem(`pendingMessage_${id}`);
    }
}, [id, status]);
```

---

## 📊 Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER ACTIONS                            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │   /chat (page)   │
                    │  - Input field   │
                    │  - Submit btn    │
                    └──────────────────┘
                              │
                    Generate UUID: abc123
                    Store message in sessionStorage
                              │
                              ▼
                    ┌──────────────────┐
                    │  POST /api/...   │
                    │  chatId: abc123  │
                    │  messages: []    │
                    └──────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  Save to disk:   │
                    │ .CHATS/abc123.json│
                    │     Content: []  │
                    └──────────────────┘
                              │
                router.push(/chat/abc123)
                              │
                              ▼
                    ┌──────────────────┐
                    │ /chat/abc123     │
                    │  (chat page)     │
                    └──────────────────┘
                              │
            ┌─────────────────┴──────────────────┐
            │                                    │
            ▼                                    ▼
    ┌──────────────┐                  ┌──────────────────┐
    │ Load messages│                  │Check sessionStore│
    │ from file    │                  │ for pending msg  │
    └──────────────┘                  └──────────────────┘
            │                                    │
            └─────────────────┬──────────────────┘
                              ▼
                    ┌──────────────────┐
                    │   ChatArea UI    │
                    │ - Show messages  │
                    │ - Input field    │
                    └──────────────────┘
                              │
                   User sends message
                              │
                              ▼
                    ┌──────────────────┐
                    │  POST /api/...   │
                    │  chatId: abc123  │
                    │  messages: [...]│
                    └──────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  Stream LLM      │
                    │  response        │
                    └──────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  Save to disk:   │
                    │.CHATS/abc123.json│
                    │  Content: [...]  │
                    └──────────────────┘
```

---

## 🔑 Key Variables

| Variable | Location | Purpose |
|----------|----------|---------|
| `id` | Generated at `/chat` | Unique chat session identifier |
| `pendingMessage_${id}` | sessionStorage | Temporary storage for first message |
| `messages` | State & File | Array of all chat messages |
| `chatId` | API request body | Identifies which chat file to save to |
| `initialMessages` | ChatArea prop | Messages loaded from file |

---

## 🗂️ File System

```
project-root/
├── .CHATS/                          # Auto-created directory
│   ├── abc123-uuid.json            # Chat 1
│   ├── def456-uuid.json            # Chat 2
│   └── ghi789-uuid.json            # Chat 3
│
└── src/
    ├── app/
    │   ├── (chat)/
    │   │   └── chat/
    │   │       ├── page.tsx         # Entry point (/chat)
    │   │       └── [id]/
    │   │           ├── page.tsx     # Chat page (/chat/[id])
    │   │           └── @chatArea/
    │   │               └── _ui/
    │   │                   └── ChatArea.tsx  # Chat UI
    │   └── api/
    │       └── persist-chat/
    │           ├── route.ts         # POST - create/stream
    │           └── [id]/
    │               └── route.ts     # GET - load chat
    └── utils/
        └── chat-store.ts            # File I/O utilities
```

---

## 🎯 Critical Points

### ✅ DO:
- Always include `chatId` in API requests
- Clear sessionStorage after processing pending messages
- Check `status === 'ready'` before sending messages
- Handle errors when creating/loading chats

### ❌ DON'T:
- Don't navigate before chat file is created
- Don't send messages while status is 'streaming'
- Don't forget to include chatId in metadata
- Don't leave pending messages in sessionStorage

---

## 🔍 Debugging Checklist

If chat isn't working:

- [ ] Check `.CHATS/` directory exists
- [ ] Verify `[id].json` file was created
- [ ] Check sessionStorage in DevTools
- [ ] Look for errors in browser console
- [ ] Verify API responses in Network tab
- [ ] Check if chatId is in request body
- [ ] Confirm messages are being saved
- [ ] Verify LLM is running (Ollama)

---

## 📱 State Management

```typescript
// Chat Entry (/chat)
[input] → useState('')
[isSubmitting] → useState(false)

// Chat Area (/chat/[id])
[input] → useState('')
[hasProcessedPendingMessage] → useState(false)
[messages] → from useChat hook
[status] → from useChat hook ('ready' | 'streaming' | 'submitted')
```

---

**Last Updated:** October 10, 2025
