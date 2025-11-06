import { Id } from "@/../convex/_generated/dataModel";

export interface Highlight {
    _id: Id<"highlights">;
    messageId: Id<"messages">;
    conversationId: Id<"conversations">;
    userId: Id<"users">;
    startOffset: number;
    endOffset: number;
    text: string;
    color?: string;
}