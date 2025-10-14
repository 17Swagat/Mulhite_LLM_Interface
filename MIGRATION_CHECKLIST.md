# ✅ Convex Migration Checklist

Use this checklist to verify the migration from local file storage to Convex database is working correctly.

## Pre-Migration Verification

- [ ] Convex is installed: `pnpm list convex`
- [ ] Clerk is installed: `pnpm list @clerk/nextjs`
- [ ] Environment variables are set in `.env.local`:
  - [ ] `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
  - [ ] `CLERK_SECRET_KEY`
  - [ ] `CONVEX_DEPLOYMENT`
  - [ ] `NEXT_PUBLIC_CONVEX_URL`
- [ ] Ollama is running: `curl http://localhost:11434/api/tags`
- [ ] deepseek-r1:1.5b model is available: `ollama list`

## Convex Setup

- [ ] Convex development server is running: `npx convex dev`
- [ ] Schema is deployed (check terminal output)
- [ ] Functions are deployed (conversations.tsx)
- [ ] Convex dashboard is accessible: `npx convex dashboard`

## Authentication Setup

- [ ] Clerk application is created
- [ ] Clerk JWT template for Convex is configured
- [ ] Middleware protects `/chat/*` routes
- [ ] Login page is accessible at `/login`

## Functional Testing

### 1. Authentication Flow
- [ ] Visit `http://localhost:3000`
- [ ] Click "Login" or navigate to `/login`
- [ ] Sign in with Clerk (email/password, OAuth, etc.)
- [ ] After login, redirected to `/chat`
- [ ] User record created in Convex (check dashboard → users table)

### 2. Create Conversation
- [ ] On `/chat` page, type a message in input
- [ ] Click "GO!" button
- [ ] New conversation created in Convex (check dashboard → conversations table)
- [ ] Redirected to `/chat/[id]` page
- [ ] Conversation appears in sidebar immediately
- [ ] Message is sent to Ollama
- [ ] AI response streams back
- [ ] User message saved to Convex (check dashboard → messages table)
- [ ] AI response saved to Convex after streaming completes

### 3. Send Message in Existing Chat
- [ ] Navigate to existing chat `/chat/[id]`
- [ ] Type a message and submit
- [ ] Message appears in UI immediately
- [ ] AI response streams
- [ ] User message saved to Convex
- [ ] AI response saved to Convex
- [ ] Conversation `updatedAt` timestamp updated

### 4. Sidebar Functionality
- [ ] Sidebar shows all user's conversations
- [ ] Conversations are sorted by `createdAt` (newest first)
- [ ] Active chat is highlighted
- [ ] Clicking conversation navigates to `/chat/[id]`
- [ ] "New Chat" button navigates to `/chat`
- [ ] Sidebar updates in real-time when conversation created
- [ ] Loading state shows while fetching conversations

### 5. Rename Conversation
- [ ] Hover over conversation in sidebar
- [ ] Three-dot menu (⋮) appears
- [ ] Click menu → "Rename Chat"
- [ ] Input field appears with current title
- [ ] Type new title and press Enter
- [ ] Title updates in Convex (check dashboard)
- [ ] Title updates in sidebar immediately
- [ ] Press Escape to cancel rename (title unchanged)

### 6. Delete Conversation
- [ ] Hover over conversation in sidebar
- [ ] Click menu → "Delete Chat"
- [ ] Confirmation dialog appears
- [ ] Click "OK" to confirm
- [ ] Conversation deleted from Convex
- [ ] All messages deleted from Convex
- [ ] Conversation removed from sidebar immediately
- [ ] If viewing deleted chat, redirected to `/chat`

### 7. Multi-User Isolation
- [ ] Login as User A
- [ ] Create conversation "User A Chat"
- [ ] Logout
- [ ] Login as User B
- [ ] User B cannot see "User A Chat" in sidebar
- [ ] User B cannot navigate to User A's chat URL (should get error)
- [ ] Create conversation "User B Chat"
- [ ] Logout and login as User A
- [ ] User A can only see "User A Chat"

### 8. Real-Time Updates
- [ ] Open app in two browser windows (same user)
- [ ] Create conversation in Window 1
- [ ] Conversation appears in Window 2 sidebar immediately
- [ ] Rename conversation in Window 1
- [ ] Title updates in Window 2 immediately
- [ ] Delete conversation in Window 1
- [ ] Conversation removed from Window 2 immediately

### 9. Persistence
- [ ] Create several conversations
- [ ] Send messages in each
- [ ] Refresh the page
- [ ] All conversations still visible
- [ ] Active chat still highlighted
- [ ] Navigate to conversation
- [ ] All messages are loaded correctly

### 10. Error Handling
- [ ] Stop Convex dev server
- [ ] Try to create conversation → Should show error
- [ ] Restart Convex dev server
- [ ] App should reconnect automatically
- [ ] Stop Ollama server
- [ ] Try to send message → AI streaming fails but message saved to Convex
- [ ] Restart Ollama
- [ ] Send message again → Should work

## Performance Testing

- [ ] Create 20+ conversations
- [ ] Sidebar loads quickly (< 1 second)
- [ ] No unnecessary re-renders (check React DevTools)
- [ ] Zustand only persists `activeChat` (check localStorage)
- [ ] Messages load quickly when opening conversation
- [ ] AI streaming is smooth (no blocking)

## Security Testing

- [ ] Logout and try to access `/chat` → Redirected to login
- [ ] Try to access `/chat/[id]` while logged out → Redirected
- [ ] Try to access another user's conversation URL → Error or redirect
- [ ] Check Convex functions enforce user ownership
- [ ] Verify middleware protects routes

## Data Integrity

- [ ] Open Convex dashboard
- [ ] Check `users` table has correct data
- [ ] Check `conversations` table has correct userId references
- [ ] Check `messages` table has correct conversationId references
- [ ] Verify no orphaned messages (messages without conversation)
- [ ] Verify timestamps are correct (milliseconds since epoch)

## Cleanup Old Files (Optional)

- [ ] Backup `.CHATS` directory: `cp -r .CHATS .CHATS.backup`
- [ ] Delete old API routes (if not needed):
  - [ ] `src/app/api/chats/[id]/route.ts`
  - [ ] `src/app/api/chats/list/route.ts`
  - [ ] `src/app/api/persist-chat/[id]/route.ts`
- [ ] Delete old utilities (if not needed):
  - [ ] `src/utils/chat-store.ts` (file I/O functions)
- [ ] Remove `.CHATS` directory: `rm -rf .CHATS`

## Deployment Checklist

### Convex Production
- [ ] Deploy Convex: `npx convex deploy`
- [ ] Note production URL
- [ ] Update `.env.production` with production URL

### Vercel/Netlify
- [ ] Add environment variables to hosting platform
- [ ] Deploy application
- [ ] Test authentication in production
- [ ] Test conversation creation in production
- [ ] Verify Convex connection works

## Rollback Plan

If migration fails:

1. **Stop Convex dev server**
   ```bash
   # Ctrl+C in Convex terminal
   ```

2. **Revert code changes**
   ```bash
   git checkout main  # Or your pre-migration branch
   ```

3. **Restore old API routes**
   - Old routes should still exist if not deleted
   - Restore from git history if needed

4. **Clear localStorage**
   ```javascript
   localStorage.removeItem('chat-store');
   ```

5. **Restart Next.js**
   ```bash
   pnpm dev
   ```

## Post-Migration

- [ ] Document any issues encountered
- [ ] Update README with new setup instructions
- [ ] Train team on Convex usage
- [ ] Monitor Convex usage/costs in dashboard
- [ ] Set up error tracking (Sentry, etc.)
- [ ] Create backup strategy for Convex data

## Success Criteria

✅ All conversations stored in Convex
✅ All messages persisted to Convex
✅ Real-time updates working without polling
✅ Multi-user isolation working
✅ Authentication fully integrated
✅ No data loss during migration
✅ Performance same or better than before
✅ Ollama LLM still works for inference

---

**Migration Status**: [ ] Not Started | [ ] In Progress | [ ] Complete

**Date**: _________________

**Migrated By**: _________________

**Issues**: _________________
