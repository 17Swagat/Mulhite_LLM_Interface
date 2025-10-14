# 🐛 Common Issues & Troubleshooting

## Issue: "User not found. Please sign in again"

### Symptoms
- User is logged in with Clerk
- Error appears when accessing `/chat`
- Error message: `User not found. Please sign in again.`

### Root Cause
User is authenticated with Clerk but doesn't exist in Convex `users` table yet.

### Solution
The app now automatically creates users on first load. If you still see this error:

1. **Clear browser cache and refresh**
   ```
   Ctrl + Shift + R (Windows/Linux)
   Cmd + Shift + R (Mac)
   ```

2. **Check Convex dev server is running**
   ```bash
   npx convex dev
   ```

3. **Manually trigger user creation**
   - The `AppSidebar` component now calls `ensureUser()` on mount
   - This automatically creates the user in Convex if they don't exist

4. **Verify in Convex dashboard**
   ```bash
   npx convex dashboard
   ```
   - Go to `users` table
   - Check if your `clerkUserId` exists

5. **Force user creation**
   - Log out of Clerk
   - Clear localStorage: `localStorage.clear()`
   - Log back in
   - User will be auto-created on first conversation

### How It Works

1. User logs in with Clerk ✅
2. `AppSidebar` loads and calls `ensureUser()` mutation ✅
3. `ensureUser()` calls `getCurrentUserMutation()` which:
   - Looks for user by `clerkUserId`
   - If not found, creates user automatically ✅
4. `listConversations` query now returns `[]` if user doesn't exist (instead of throwing error) ✅

### Prevention
The issue is now prevented by:
- ✅ Calling `ensureUser()` mutation on app initialization
- ✅ Queries return empty arrays instead of throwing errors
- ✅ Mutations auto-create users when needed

---

## Issue: Convex connection errors

### Symptoms
- "Failed to connect to Convex"
- Queries return `undefined` indefinitely
- Mutations fail silently

### Solution

1. **Check Convex dev server**
   ```bash
   npx convex dev
   ```
   Make sure it says "Watching for file changes..."

2. **Check environment variables**
   ```bash
   # .env.local should have:
   CONVEX_DEPLOYMENT=...
   NEXT_PUBLIC_CONVEX_URL=https://...
   ```

3. **Restart both servers**
   ```bash
   # Terminal 1
   npx convex dev
   
   # Terminal 2
   pnpm dev
   ```

4. **Clear Convex cache**
   ```bash
   rm -rf .convex
   npx convex dev
   ```

---

## Issue: Clerk authentication not working

### Symptoms
- Redirects to login but doesn't authenticate
- "Unauthorized" errors even when logged in
- Clerk user info not available

### Solution

1. **Check Clerk environment variables**
   ```env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   ```

2. **Verify Clerk JWT template**
   - Go to Clerk dashboard
   - Navigate to "JWT Templates"
   - Ensure Convex template is created
   - Check Issuer URL matches `convex/auth.config.ts`

3. **Check middleware configuration**
   ```typescript
   // src/middleware.ts
   const isProtectedRoute = createRouteMatcher(['/chat/:path*']);
   ```

4. **Clear Clerk session**
   - Log out completely
   - Clear cookies
   - Log back in

---

## Issue: Ollama streaming not working

### Symptoms
- Messages send but no AI response
- Spinner runs indefinitely
- "Failed to fetch" errors

### Solution

1. **Check Ollama is running**
   ```bash
   curl http://localhost:11434/api/tags
   ```

2. **Verify model is installed**
   ```bash
   ollama list
   # Should show: deepseek-r1:1.5b
   ```

3. **Test model manually**
   ```bash
   ollama run deepseek-r1:1.5b "Hello"
   ```

4. **Check API endpoint**
   ```typescript
   // src/app/api/persist-chat/route.ts
   const result = streamText({
     model: ollama('deepseek-r1:1.5b'),
     messages: messages as any,
   });
   ```

5. **Restart Ollama**
   ```bash
   # Kill Ollama process
   killall ollama
   
   # Restart
   ollama serve
   ```

---

## Issue: Messages not saving to Convex

### Symptoms
- Messages appear in UI but disappear on refresh
- Convex `messages` table is empty
- AI responds but conversation not persisted

### Solution

1. **Check `onFinish` callback**
   ```typescript
   // ChatArea.tsx should have:
   useChat({
     onFinish: async ({ message: finishedMessage }) => {
       await addMessageToConvex({ ... });
     }
   });
   ```

2. **Verify mutation is imported**
   ```typescript
   const addMessageToConvex = useMutation(api.conversations.addMessage);
   ```

3. **Check browser console**
   - Look for "Failed to save message" errors
   - Check Network tab for failed mutations

4. **Test mutation manually in Convex dashboard**
   ```javascript
   // In Convex dashboard
   api.conversations.addMessage({
     conversationId: "...",
     role: "user",
     parts: [{ type: "text", text: "Test" }]
   })
   ```

---

## Issue: Sidebar not updating in real-time

### Symptoms
- New conversations don't appear immediately
- Need to refresh to see changes
- Delete doesn't remove item from sidebar

### Solution

1. **Verify Convex query is reactive**
   ```typescript
   // AppSidebar.tsx
   const conversations = useQuery(api.conversations.listConversations);
   ```

2. **Check useEffect syncs to Zustand**
   ```typescript
   useEffect(() => {
     if (conversations) {
       setChats(conversations);
     }
   }, [conversations, setChats]);
   ```

3. **Ensure mutations update Convex**
   - Create: `createConversation` mutation
   - Delete: `deleteConversation` mutation
   - Rename: `updateConversation` mutation

4. **Check Convex dev server logs**
   - Should show query subscriptions
   - Should show mutation executions

---

## Issue: TypeScript errors after migration

### Symptoms
- Red squiggly lines in IDE
- `Id<"conversations">` type errors
- "Cannot find name" errors

### Solution

1. **Regenerate Convex types**
   ```bash
   npx convex dev
   ```
   This auto-generates `convex/_generated/` files

2. **Check imports**
   ```typescript
   import { Id } from "../convex/_generated/dataModel";
   import { api } from "../convex/_generated/api";
   ```

3. **Restart TypeScript server**
   - VS Code: `Ctrl+Shift+P` → "TypeScript: Restart TS Server"

4. **Clear Next.js cache**
   ```bash
   rm -rf .next
   pnpm dev
   ```

---

## Issue: "Cannot read properties of undefined"

### Symptoms
- React errors about undefined properties
- `conversations.map is not a function`
- `messages` is undefined

### Solution

1. **Add loading checks**
   ```typescript
   if (!conversations) return <div>Loading...</div>;
   if (!messagesData) return <div>Loading messages...</div>;
   ```

2. **Use optional chaining**
   ```typescript
   conversations?.map(chat => ...)
   messagesData?.messages?.map(msg => ...)
   ```

3. **Check conditional queries**
   ```typescript
   const messages = useQuery(
     api.conversations.getMessages,
     conversationId ? { conversationId } : "skip"
   );
   ```

---

## Getting Help

If you're still stuck:

1. **Check Convex dashboard logs**
   ```bash
   npx convex dashboard
   ```
   Go to "Logs" section

2. **Check browser console**
   - Open DevTools (F12)
   - Look for errors in Console tab
   - Check Network tab for failed requests

3. **Enable verbose logging**
   ```typescript
   // Add to components
   console.log("Conversations:", conversations);
   console.log("Messages:", messagesData);
   ```

4. **Restart everything**
   ```bash
   # Kill all processes
   # Terminal 1
   npx convex dev
   
   # Terminal 2
   pnpm dev
   
   # Terminal 3 (if needed)
   ollama serve
   ```

5. **Check documentation**
   - [CONVEX_MIGRATION_SUMMARY.md](./CONVEX_MIGRATION_SUMMARY.md)
   - [CONVEX_QUICK_REFERENCE.md](./CONVEX_QUICK_REFERENCE.md)
   - [MIGRATION_CHECKLIST.md](./MIGRATION_CHECKLIST.md)
