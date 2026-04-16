import { Head, router, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState, useCallback } from 'react';
import type {
    ActiveConversation,
    ChatMessage,
    ConversationSummary,
    LinkedProduct,
} from '@/types';
import { ConversationList } from './components/conversation-list';
import { ChatWindow } from './components/chat-window';
import { MessageInput } from './components/message-input';
import { MessageCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Props = {
    conversations: ConversationSummary[];
    activeConversation?: ActiveConversation;
    initialProduct?: LinkedProduct | null;
};

export default function ChatIndex({ conversations, activeConversation, initialProduct }: Props) {
    const { auth } = usePage<{
        auth: { user: { id: number; name: string } };
    }>().props;

    const [messages, setMessages] = useState<ChatMessage[]>(
        activeConversation?.messages ?? [],
    );
    const [linkedProduct, setLinkedProduct] = useState<LinkedProduct | null>(
        initialProduct ?? null,
    );
    const [sending, setSending] = useState(false);
    const [mobileShowChat, setMobileShowChat] = useState(!!activeConversation);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Sync messages when active conversation changes
    useEffect(() => {
        setMessages(activeConversation?.messages ?? []);
    }, [activeConversation?.id]);

    // Sync initial product when conversation changes (e.g. navigating to a new conversation with a product)
    useEffect(() => {
        setLinkedProduct(initialProduct ?? null);
    }, [activeConversation?.id]);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Real-time: listen for new messages via Echo
    useEffect(() => {
        if (!activeConversation?.id || !window.Echo) {
            return;
        }

        const channel = window.Echo.private(
            `chat.${activeConversation.id}`,
        );

        channel.listen('.Modules\\Chat\\Events\\MessageSent', (e: { message: ChatMessage }) => {
            setMessages((prev) => {
                // Avoid duplicates
                if (prev.some((m) => m.id === e.message.id)) {
                    return prev;
                }
                return [...prev, e.message];
            });
        });

        return () => {
            window.Echo.leave(`chat.${activeConversation.id}`);
        };
    }, [activeConversation?.id]);

    const handleSendMessage = useCallback(
        async (text: string) => {
            if (!activeConversation || sending) {
                return;
            }

            setSending(true);

            // Optimistic message
            const optimisticMessage: ChatMessage = {
                id: Date.now(),
                conversation_id: activeConversation.id,
                sender_id: auth.user.id,
                receiver_id: activeConversation.other_participant?.id ?? 0,
                message: text,
                product_id: linkedProduct?.id ?? null,
                created_at: new Date().toISOString(),
                sender: {
                    id: auth.user.id,
                    name: auth.user.name,
                },
                product: linkedProduct,
            };

            setMessages((prev) => [...prev, optimisticMessage]);
            const productToSend = linkedProduct;
            setLinkedProduct(null);

            try {
                const response = await fetch(
                    `/chat/${activeConversation.id}/messages`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRF-TOKEN':
                                document
                                    .querySelector('meta[name="csrf-token"]')
                                    ?.getAttribute('content') ?? '',
                            Accept: 'application/json',
                        },
                        body: JSON.stringify({
                            message: text,
                            product_id: productToSend?.id ?? null,
                        }),
                    },
                );

                if (response.ok) {
                    const data = await response.json();
                    // Replace optimistic message with real one
                    setMessages((prev) =>
                        prev.map((m) =>
                            m.id === optimisticMessage.id ? data.message : m,
                        ),
                    );
                } else {
                    // Rollback on HTTP error
                    setMessages((prev) =>
                        prev.filter((m) => m.id !== optimisticMessage.id),
                    );
                    setLinkedProduct(productToSend);
                }
            } catch {
                // Remove optimistic message on network error
                setMessages((prev) =>
                    prev.filter((m) => m.id !== optimisticMessage.id),
                );
                setLinkedProduct(productToSend);
            } finally {
                setSending(false);
            }
        },
        [activeConversation, auth.user, linkedProduct, sending],
    );

    const handleSelectConversation = useCallback((conversationId: number) => {
        setMobileShowChat(true);
        router.get(`/chat/${conversationId}`, {}, { preserveState: false });
    }, []);

    const otherParticipantId = activeConversation?.other_participant?.id;

    return (
        <>
            <Head title="Messages" />

            <div className="mx-auto flex h-[calc(100vh-8rem)] max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                <div className="flex w-full overflow-hidden rounded-2xl border border-border/60 bg-card shadow-xl shadow-black/5">
                    {/* Conversation Sidebar */}
                    <div
                        className={`w-full shrink-0 border-r border-border/60 md:w-80 lg:w-96 ${
                            mobileShowChat && activeConversation
                                ? 'hidden md:flex md:flex-col'
                                : 'flex flex-col'
                        }`}
                    >
                        <div className="flex h-16 items-center gap-3 border-b border-border/60 px-5">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
                                <MessageCircle className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <h1 className="text-base font-bold font-heading tracking-tight">
                                    Messages
                                </h1>
                                <p className="text-xs text-muted-foreground">
                                    {conversations.length} conversation
                                    {conversations.length !== 1 ? 's' : ''}
                                </p>
                            </div>
                        </div>
                        <ConversationList
                            conversations={conversations}
                            activeId={activeConversation?.id}
                            currentUserId={auth.user.id}
                            onSelect={handleSelectConversation}
                        />
                    </div>

                    {/* Chat Area */}
                    <div
                        className={`flex flex-1 flex-col ${
                            !mobileShowChat || !activeConversation
                                ? 'hidden md:flex'
                                : 'flex'
                        }`}
                    >
                        {activeConversation ? (
                            <>
                                {/* Chat Header */}
                                <div className="flex h-16 items-center gap-3 border-b border-border/60 px-5">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 md:hidden"
                                        onClick={() => setMobileShowChat(false)}
                                    >
                                        <ArrowLeft className="h-4 w-4" />
                                    </Button>
                                    <div className="flex items-center gap-3">
                                        <div className="relative">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                                                {activeConversation.other_participant?.name?.charAt(
                                                    0,
                                                ) ?? '?'}
                                            </div>
                                            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-card bg-emerald-500" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold">
                                                {activeConversation
                                                    .other_participant?.name ??
                                                    'Unknown'}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                Online
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Messages */}
                                <ChatWindow
                                    messages={messages}
                                    currentUserId={auth.user.id}
                                    messagesEndRef={messagesEndRef}
                                />

                                {/* Input */}
                                <MessageInput
                                    onSend={handleSendMessage}
                                    disabled={sending}
                                    linkedProduct={linkedProduct}
                                    onRemoveLinkedProduct={() =>
                                        setLinkedProduct(null)
                                    }
                                    onLinkProduct={setLinkedProduct}
                                    sellerId={otherParticipantId}
                                />
                            </>
                        ) : (
                            <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8">
                                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10">
                                    <MessageCircle className="h-10 w-10 text-primary" />
                                </div>
                                <div className="text-center">
                                    <h2 className="text-lg font-bold font-heading">
                                        Your Messages
                                    </h2>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        Select a conversation to start chatting
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
