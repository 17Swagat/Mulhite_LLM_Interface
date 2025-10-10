# Testing Guide for Chat Application

## 🧪 Pre-Testing Setup

### 1. Make sure Ollama is running
```cmd
ollama serve
```

### 2. Verify the model is available
```cmd
ollama list
```
Should show `deepseek-r1:1.5b` in the list.

### 3. Start the development server
```cmd
pnpm dev
```

### 4. Open browser
Navigate to `http://localhost:3000`

---

## ✅ Test Case 1: Create New Chat

### Steps:
1. Navigate to `http://localhost:3000/chat`
2. You should see:
   - Purple gradient background
   - "Write Your Prompt" heading
   - Large input field with placeholder "Say something..."
   - Blue "GO!" button

3. Type a message (e.g., "Hello, tell me a joke")
4. Click "GO!" button

### Expected Results:
- ✅ Button should change to "..." briefly
- ✅ URL should change to `/chat/[uuid]`
- ✅ You should see the chat interface with sidebar
- ✅ Your message should be sent automatically
- ✅ LLM should start responding with reasoning + answer

### Verify File Creation:
1. Open your project folder
2. Look for `.CHATS` directory (it should be created automatically)
3. Check if a new `.json` file exists (named with UUID)
4. Open the file - it should contain your messages

**Example file content:**
```json
[
  {
    "id": "msg-uuid-1",
    "role": "user",
    "parts": [
      {
        "type": "text",
        "text": "Hello, tell me a joke"
      }
    ]
  },
  {
    "id": "msg-uuid-2",
    "role": "assistant",
    "parts": [
      {
        "type": "reasoning",
        "text": "The user wants a joke..."
      },
      {
        "type": "text",
        "text": "Why don't scientists trust atoms? Because they make up everything!"
      }
    ]
  }
]
```

---

## ✅ Test Case 2: Continue Existing Chat

### Steps:
1. From Test Case 1, you should still be at `/chat/[uuid]`
2. Scroll to bottom input field
3. Type another message (e.g., "Tell me another one")
4. Click Submit or press Enter

### Expected Results:
- ✅ Message should be added to the chat
- ✅ LLM should respond
- ✅ Messages should scroll automatically to show latest
- ✅ File should be updated with new messages

### Verify File Update:
1. Open the same `.json` file from Test Case 1
2. Should now have 4 messages total (2 user + 2 assistant)
3. File should be properly formatted JSON

---

## ✅ Test Case 3: Chat Persistence (Refresh)

### Steps:
1. While on `/chat/[uuid]` with existing messages
2. Note the UUID in the URL
3. Refresh the page (F5 or Ctrl+R)
4. Wait for page to load

### Expected Results:
- ✅ Should see "Loading chat..." briefly
- ✅ All previous messages should reappear
- ✅ Should be able to send new messages
- ✅ No duplicate messages
- ✅ Scroll position should be at bottom

---

## ✅ Test Case 4: Multiple Chats

### Steps:
1. Navigate to `/chat` (home)
2. Type a new message (e.g., "What is the capital of France?")
3. Click "GO!"
4. Note the new UUID in URL (should be different)
5. Send a few messages in this chat
6. Go back to `/chat` again
7. Create a third chat with different message

### Expected Results:
- ✅ Each chat should have unique UUID
- ✅ Each chat should have its own `.json` file
- ✅ Should have 3 files in `.CHATS/` directory
- ✅ Each file should contain only its own messages
- ✅ Navigating back to old UUID should load old chat

### Verify Multiple Files:
```
.CHATS/
├── 01947e9c-7b8a-7890-a1b2-c3d4e5f6g7h8.json  ← Chat 1
├── 01947e9d-2a3b-4c5d-6e7f-8a9b0c1d2e3f.json  ← Chat 2
└── 01947e9e-9f8e-7d6c-5b4a-3c2b1a0e9f8e.json  ← Chat 3
```

---

## ✅ Test Case 5: Direct URL Access

### Steps:
1. Copy the UUID from any existing chat URL
2. Close the tab or open new tab
3. Navigate directly to `http://localhost:3000/chat/[paste-uuid]`

### Expected Results:
- ✅ Chat should load with all previous messages
- ✅ Should be able to continue conversation
- ✅ No errors in console

---

## ✅ Test Case 6: Invalid Chat ID

### Steps:
1. Navigate to `http://localhost:3000/chat/invalid-uuid-12345`

### Expected Results:
- ✅ Should show "Loading chat..." then empty chat area
- ✅ Should still be able to send messages
- ✅ New file should be created with the invalid UUID
- ✅ OR: Should show "Chat not found" message (depending on implementation)

---

## ✅ Test Case 7: Empty Message Handling

### Steps:
1. Go to `/chat`
2. Don't type anything
3. Try to click "GO!" button

### Expected Results:
- ✅ Button should be disabled
- ✅ Nothing should happen
- ✅ Should stay on `/chat` page

### Steps (Chat Area):
1. Go to any existing chat
2. Don't type anything in input
3. Try to submit empty message

### Expected Results:
- ✅ Submit button should be disabled or do nothing
- ✅ No empty messages sent

---

## ✅ Test Case 8: Stop Generation

### Steps:
1. Send a message that requires long response
2. While LLM is responding (status = 'streaming')
3. Click the "X" button (stop button)

### Expected Results:
- ✅ Response generation should stop
- ✅ Partial response should be saved
- ✅ Input should be enabled again
- ✅ Should be able to send new message

---

## 🐛 Common Issues & Solutions

### Issue: Chat file not created
**Check:**
- Console errors (F12)
- Network tab - did API call succeed?
- File permissions in project directory
- `.CHATS` directory exists

**Solution:**
```cmd
# Manually create directory
mkdir .CHATS
```

### Issue: Messages not persisting
**Check:**
- `chatId` is in API request body
- File is being written (check file timestamp)
- JSON is valid in the file

**Solution:**
- Check `chat-store.ts` saveChat function
- Verify `onFinish` callback is called

### Issue: Pending message not sent
**Check:**
- sessionStorage in DevTools (Application tab)
- Key format: `pendingMessage_${uuid}`
- Status is 'ready' before sending

**Solution:**
- Check browser console for errors
- Verify useEffect dependencies

### Issue: Page shows "Loading chat..." forever
**Check:**
- API route `/api/persist-chat/[id]` is working
- File exists in `.CHATS/` directory
- JSON is valid

**Solution:**
```cmd
# Test API manually
curl http://localhost:3000/api/persist-chat/[your-uuid]
```

### Issue: Ollama not responding
**Check:**
```cmd
ollama list
ollama ps
curl http://localhost:11434/api/tags
```

**Solution:**
```cmd
ollama serve
ollama run deepseek-r1:1.5b
```

---

## 📊 Browser Console Logs

### Expected Console Messages:

#### When creating new chat:
```
Creating empty chat file with ID: 01947e9c-7b8a-7890-a1b2-c3d4e5f6g7h8
```

#### When loading chat:
```
Layout.tsx - Chat ID: 01947e9c-7b8a-7890-a1b2-c3d4e5f6g7h8
```

#### When pending message is found:
```
Found pending message: Hello, tell me a joke
```

#### When saving chat:
```
Saving chat with ID: 01947e9c-7b8a-7890-a1b2-c3d4e5f6g7h8
```

### Unexpected Console Errors:

❌ `Error loading chat: 404`
- File doesn't exist, but not critical if new chat

❌ `Failed to create chat`
- API error, check server logs

❌ `Unexpected token in JSON`
- Corrupted chat file

---

## 🎯 Success Criteria

After running all tests, you should have:

- ✅ Multiple chat files in `.CHATS/` directory
- ✅ Each file contains valid JSON
- ✅ All chats are accessible via their UUID
- ✅ Messages persist after refresh
- ✅ New chats can be created anytime
- ✅ No errors in browser console
- ✅ No errors in terminal (Next.js server)

---

## 📝 Test Results Template

```markdown
## Test Results - [Date]

| Test Case | Status | Notes |
|-----------|--------|-------|
| 1. Create New Chat | ✅ / ❌ | |
| 2. Continue Chat | ✅ / ❌ | |
| 3. Chat Persistence | ✅ / ❌ | |
| 4. Multiple Chats | ✅ / ❌ | |
| 5. Direct URL Access | ✅ / ❌ | |
| 6. Invalid Chat ID | ✅ / ❌ | |
| 7. Empty Message | ✅ / ❌ | |
| 8. Stop Generation | ✅ / ❌ | |

### Issues Found:
- 

### Additional Notes:
- 
```

---

**Happy Testing! 🚀**

If you encounter any issues not covered here, check:
1. Browser console (F12)
2. Network tab (API calls)
3. Terminal output (Next.js logs)
4. `.CHATS/` directory contents
