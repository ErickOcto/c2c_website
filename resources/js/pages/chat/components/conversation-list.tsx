import type { ConversationSummary } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Search } from 'lucide-react';
import { useState } from 'react';

type Props = {
    conversations: ConversationSummary[];
    activeId?: number;
    currentUserId: number;
    onSelect: (conversationId: number) => void;
};

export function ConversationList({
    conversations,
    activeId,
    currentUserId,
    onSelect,
}: Props) {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredConversations = conversations.filter((conv) =>
        conv.other_participant?.name
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()),
    );

    function formatTime(dateStr: string): string {
        const date = new Date(dateStr);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
            return date.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
            });
        }
        if (diffDays === 1) {
            return 'Yesterday';
        }
        if (diffDays < 7) {
            return date.toLocaleDateString([], { weekday: 'short' });
        }
        return date.toLocaleDateString([], {
            month: 'short',
            day: 'numeric',
        });
    }

    return (
        <div className="flex flex-1 flex-col overflow-hidden">
            {/* Search */}
            <div className="p-3">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search conversations..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="h-10 w-full rounded-xl border border-input bg-muted/50 pl-9 pr-4 text-sm placeholder:text-muted-foreground focus:bg-background focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                    />
                </div>
            </div>

            {/* Conversation List */}
            <div className="flex-1 overflow-y-auto">
                {filteredConversations.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-8 text-center">
                        <p className="text-sm text-muted-foreground">
                            {searchQuery
                                ? 'No conversations found'
                                : 'No conversations yet'}
                        </p>
                    </div>
                ) : (
                    filteredConversations.map((conv) => (
                        <button
                            key={conv.id}
                            onClick={() => onSelect(conv.id)}
                            className={`flex w-full items-center gap-3 px-4 py-3 transition-all duration-200 hover:bg-accent/50 ${
                                activeId === conv.id
                                    ? 'bg-primary/5 border-r-2 border-r-primary'
                                    : ''
                            }`}
                        >
                            {/* Avatar */}
                            <div className="relative shrink-0">
                                <Avatar className="h-12 w-12">
                                    <AvatarImage
                                        src={
                                            conv.other_participant?.avatar ??
                                            undefined
                                        }
                                    />
                                    <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
                                        {conv.other_participant?.name?.charAt(
                                            0,
                                        ) ?? '?'}
                                    </AvatarFallback>
                                </Avatar>
                                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-card bg-emerald-500" />
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0 text-left">
                                <div className="flex items-center justify-between gap-2">
                                    <span
                                        className={`truncate text-sm ${
                                            conv.unread_count > 0
                                                ? 'font-bold'
                                                : 'font-medium'
                                        }`}
                                    >
                                        {conv.other_participant?.name ??
                                            'Unknown'}
                                    </span>
                                    {conv.latest_message && (
                                        <span className="shrink-0 text-[10px] text-muted-foreground">
                                            {formatTime(
                                                conv.latest_message.created_at,
                                            )}
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center justify-between gap-2 mt-0.5">
                                    <p
                                        className={`truncate text-xs ${
                                            conv.unread_count > 0
                                                ? 'font-medium text-foreground'
                                                : 'text-muted-foreground'
                                        }`}
                                    >
                                        {conv.latest_message
                                            ? conv.latest_message.sender_id ===
                                              currentUserId
                                                ? `You: ${conv.latest_message.message}`
                                                : conv.latest_message.message
                                            : 'No messages yet'}
                                    </p>
                                    {conv.unread_count > 0 && (
                                        <Badge className="h-5 min-w-5 shrink-0 rounded-full px-1.5 text-[10px] font-bold bg-primary text-primary-foreground">
                                            {conv.unread_count > 99
                                                ? '99+'
                                                : conv.unread_count}
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </button>
                    ))
                )}
            </div>
        </div>
    );
}
