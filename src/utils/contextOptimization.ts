// Optional: Context Window Limiting Implementation
// This file provides utility functions to limit conversation context
// and reduce AI API costs while maintaining conversation coherence.

import { UIMessage } from "ai";

/**
 * Configuration for context limiting
 */
export const CONTEXT_CONFIG = {
  // Maximum number of messages to send to AI (includes user + assistant messages)
  MAX_CONTEXT_MESSAGES: 20,
  
  // Number of initial messages to always preserve (useful for system prompts or initial context)
  PRESERVE_FIRST_MESSAGES: 2,
  
  // Warn user when conversation cost exceeds this threshold
  COST_WARNING_THRESHOLD: 0.50,
};

/**
 * Limits conversation context by keeping:
 * 1. First N messages (initial context)
 * 2. Last M messages (recent context)
 * 
 * @param messages - Full message history
 * @param maxMessages - Maximum messages to include
 * @param preserveFirst - Number of first messages to always keep
 * @returns Limited message array
 */
export function limitMessageContext(
  messages: UIMessage[],
  maxMessages: number = CONTEXT_CONFIG.MAX_CONTEXT_MESSAGES,
  preserveFirst: number = CONTEXT_CONFIG.PRESERVE_FIRST_MESSAGES
): UIMessage[] {
  // If conversation is short, return all messages
  if (messages.length <= maxMessages) {
    return messages;
  }

  // Keep first N messages for initial context
  const firstMessages = messages.slice(0, preserveFirst);
  
  // Keep last (maxMessages - preserveFirst) messages for recent context
  const recentMessages = messages.slice(-(maxMessages - preserveFirst));
  
  return [...firstMessages, ...recentMessages];
}

/**
 * Estimates token count for a message (rough approximation)
 * More accurate estimation would require tiktoken or similar library
 * 
 * @param message - Message to estimate tokens for
 * @returns Estimated token count
 */
export function estimateTokenCount(message: UIMessage): number {
  let totalChars = 0;
  
  for (const part of message.parts) {
    if (part.type === 'text' && part.text) {
      totalChars += part.text.length;
    }
  }
  
  // Rough estimate: 1 token ≈ 4 characters (for English text)
  return Math.ceil(totalChars / 4);
}

/**
 * Estimates total tokens for an array of messages
 * 
 * @param messages - Array of messages
 * @returns Total estimated tokens
 */
export function estimateTotalTokens(messages: UIMessage[]): number {
  return messages.reduce((total, message) => {
    return total + estimateTokenCount(message);
  }, 0);
}

/**
 * Summarizes a conversation by grouping Q&A pairs
 * This is a simple text-based summary. For AI-powered summarization,
 * you'd need to call the AI API with a summarization prompt.
 * 
 * @param messages - Messages to summarize
 * @returns Summary string
 */
export function createConversationSummary(messages: UIMessage[]): string {
  const pairs: string[] = [];
  
  for (let i = 0; i < messages.length; i += 2) {
    const userMsg = messages[i];
    const assistantMsg = messages[i + 1];
    
    if (!userMsg || !assistantMsg) continue;
    
    const question = userMsg.parts.find(p => p.type === 'text')?.text || '';
    const answer = assistantMsg.parts.find(p => p.type === 'text')?.text || '';
    
    if (question && answer) {
      pairs.push(`Q: ${question.substring(0, 100)}... A: ${answer.substring(0, 100)}...`);
    }
  }
  
  return `Previous conversation summary:\n${pairs.join('\n')}`;
}

/**
 * Creates a context-optimized message array by replacing old messages with a summary
 * 
 * @param messages - Full message history
 * @param maxMessages - Maximum messages to include
 * @returns Optimized message array with summary
 */
export function createOptimizedContext(
  messages: UIMessage[],
  maxMessages: number = CONTEXT_CONFIG.MAX_CONTEXT_MESSAGES
): UIMessage[] {
  if (messages.length <= maxMessages) {
    return messages;
  }

  // Messages to summarize (exclude recent messages)
  const messagesToSummarize = messages.slice(0, -(maxMessages - 1));
  const recentMessages = messages.slice(-(maxMessages - 1));
  
  // Create summary message
  const summaryText = createConversationSummary(messagesToSummarize);
  const summaryMessage: UIMessage = {
    id: 'summary-context',
    role: 'system',
    parts: [
      {
        type: 'text',
        text: summaryText,
      },
    ],
  };
  
  return [summaryMessage, ...recentMessages];
}

/**
 * Cost tracking utilities
 */
export class ConversationCostTracker {
  private totalCost: number = 0;
  private messageCount: number = 0;
  
  /**
   * Add cost for a message
   */
  addCost(cost: number): void {
    this.totalCost += cost;
    this.messageCount++;
  }
  
  /**
   * Get total cost
   */
  getTotalCost(): number {
    return this.totalCost;
  }
  
  /**
   * Get average cost per message
   */
  getAverageCost(): number {
    if (this.messageCount === 0) return 0;
    return this.totalCost / this.messageCount;
  }
  
  /**
   * Get message count
   */
  getMessageCount(): number {
    return this.messageCount;
  }
  
  /**
   * Check if cost exceeds threshold
   */
  exceedsThreshold(threshold: number = CONTEXT_CONFIG.COST_WARNING_THRESHOLD): boolean {
    return this.totalCost > threshold;
  }
  
  /**
   * Reset tracker
   */
  reset(): void {
    this.totalCost = 0;
    this.messageCount = 0;
  }
  
  /**
   * Get formatted cost string
   */
  getFormattedCost(): string {
    return `$${this.totalCost.toFixed(4)}`;
  }
}

/**
 * Example usage in ChatArea component:
 * 
 * ```typescript
 * import { limitMessageContext, ConversationCostTracker, CONTEXT_CONFIG } from '@/utils/contextOptimization';
 * 
 * // In your component
 * const costTracker = useRef(new ConversationCostTracker());
 * 
 * // In handleSubmit, before sending message
 * const optimizedMessages = limitMessageContext(messages);
 * 
 * // Temporarily use optimized context
 * setMessages(optimizedMessages);
 * 
 * sendMessage({ text: userMessage }, options);
 * 
 * // In onFinish callback
 * onFinish: async ({ message: finishedMessage }) => {
 *   const cost = (message.metadata as any)?.cost || 0;
 *   costTracker.current.addCost(cost);
 *   
 *   if (costTracker.current.exceedsThreshold()) {
 *     console.warn(
 *       `Conversation cost: ${costTracker.current.getFormattedCost()} ` +
 *       `(${costTracker.current.getMessageCount()} messages)`
 *     );
 *   }
 *   
 *   // Restore full messages
 *   setMessages(allMessages);
 * }
 * ```
 */
