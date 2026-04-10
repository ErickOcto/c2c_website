export type ChatParticipant = {
    id: number;
    name: string;
    avatar?: string | null;
};

export type ChatMessage = {
    id: number;
    conversation_id: number;
    sender_id: number;
    receiver_id: number;
    message: string;
    product_id: number | null;
    created_at: string;
    sender: ChatParticipant;
    product: LinkedProduct | null;
};

export type LinkedProduct = {
    id: number;
    name: string;
    price: number;
    image_url?: string | null;
};

export type ConversationSummary = {
    id: number;
    other_participant: ChatParticipant | null;
    latest_message: {
        id: number;
        message: string;
        sender_id: number;
        created_at: string;
    } | null;
    unread_count: number;
    updated_at: string;
};

export type ActiveConversation = {
    id: number;
    other_participant: ChatParticipant | null;
    messages: ChatMessage[];
};
