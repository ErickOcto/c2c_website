import type { ChatMessage } from '@/types';
import { ProductContextCard } from './product-context-card';
import type { RefObject } from 'react';

type Props = {
    messages: ChatMessage[];
    currentUserId: number;
    messagesEndRef: RefObject<HTMLDivElement | null>;
};

export function ChatWindow({ messages, currentUserId, messagesEndRef }: Props) {
    function formatTime(dateStr: string): string {
        return new Date(dateStr).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
        });
    }

    function formatDateSeparator(dateStr: string): string {
        const date = new Date(dateStr);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
            return 'Today';
        }
        if (diffDays === 1) {
            return 'Yesterday';
        }
        return date.toLocaleDateString([], {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
        });
    }

    function shouldShowDateSeparator(
        messages: ChatMessage[],
        index: number,
    ): boolean {
        if (index === 0) {
            return true;
        }
        const prev = new Date(messages[index - 1].created_at).toDateString();
        const curr = new Date(messages[index].created_at).toDateString();
        return prev !== curr;
    }

    return (
        <div className="flex-1 overflow-y-auto px-5 py-4">
            {messages.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
                        <svg
                            className="h-8 w-8 text-muted-foreground/50"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1.5}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                            />
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25z"
                            />
                        </svg>
                    </div>
                    <p className="text-sm font-medium text-muted-foreground">
                        Start a conversation
                    </p>
                    <p className="text-xs text-muted-foreground/60">
                        Send a message to begin chatting
                    </p>
                </div>
            ) : (
                <div className="space-y-1">
                    {messages.map((msg, index) => {
                        const isMine = msg.sender_id === currentUserId;
                        const showDate = shouldShowDateSeparator(
                            messages,
                            index,
                        );

                        return (
                            <div key={msg.id}>
                                {/* Date Separator */}
                                {showDate && (
                                    <div className="my-4 flex items-center gap-3">
                                        <div className="h-px flex-1 bg-border" />
                                        <span className="shrink-0 rounded-full bg-muted px-3 py-1 text-[10px] font-medium text-muted-foreground">
                                            {formatDateSeparator(
                                                msg.created_at,
                                            )}
                                        </span>
                                        <div className="h-px flex-1 bg-border" />
                                    </div>
                                )}

                                {/* Message Bubble */}
                                <div
                                    className={`flex gap-2 mb-1 ${
                                        isMine ? 'justify-end' : 'justify-start'
                                    }`}
                                >
                                    {/* Sender avatar (other user only) */}
                                    {!isMine && (
                                        <div className="mt-auto shrink-0">
                                            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary">
                                                {msg.sender?.name?.charAt(0) ??
                                                    '?'}
                                            </div>
                                        </div>
                                    )}

                                    <div
                                        className={`group max-w-[75%] space-y-1`}
                                    >
                                        {/* Product context card */}
                                        {msg.product && (
                                            <ProductContextCard
                                                product={msg.product}
                                                isMine={isMine}
                                            />
                                        )}

                                        {/* Text bubble */}
                                        <div
                                            className={`relative rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                                                isMine
                                                    ? 'bg-primary text-primary-foreground rounded-br-md'
                                                    : 'bg-muted rounded-bl-md'
                                            }`}
                                        >
                                            <p className="whitespace-pre-wrap break-words">
                                                {msg.message}
                                            </p>
                                            <p
                                                className={`mt-1 text-right text-[10px] ${
                                                    isMine
                                                        ? 'text-primary-foreground/60'
                                                        : 'text-muted-foreground'
                                                }`}
                                            >
                                                {formatTime(msg.created_at)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    <div ref={messagesEndRef} />
                </div>
            )}
        </div>
    );
}
